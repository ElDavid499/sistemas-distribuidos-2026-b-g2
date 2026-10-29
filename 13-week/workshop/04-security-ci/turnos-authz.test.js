// Negative authorization test for TB1 (patient clients -> /api/turnos).
// Story: "[security] Only the owner can cancel an appointment (Turno)", criteria 1 and 2.
// Runs with the Node.js built-in test runner (Node 18+), no extra dependencies:
//   node --test turnos-authz.test.js
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = process.env.BASE_URL || 'http://localhost:10000';
const PASSWORD = process.env.TEST_PASSWORD || 'W13-Test-Pass-2026!';
const PATIENT_A = process.env.PATIENT_A_EMAIL || 'w13.patient.a@example.com';
const PATIENT_B = process.env.PATIENT_B_EMAIL || 'w13.patient.b@example.com';

// Body for POST /api/turnos. Adjust field names to backend/models/Turno.js if they differ.
const TURNO_BODY = process.env.TURNO_BODY
  ? JSON.parse(process.env.TURNO_BODY)
  : {
      especialidad: 'Medicina General',
      medico: 'Dr. W13 Test',
      fecha: '2026-12-01',
      hora: '10:30',
      motivo: 'W13 negative authorization test',
    };

async function call(method, path, token, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = null; }
  return { status: res.status, json };
}

async function tokenFor(email) {
  if (process.env.REGISTER_USERS === '1') {
    await call('POST', '/api/auth/register', null, {
      name: email.split('@')[0], email, password: PASSWORD, phone: '3000000000',
    });
  }
  const res = await call('POST', '/api/auth/login', null, { email, password: PASSWORD });
  const token = res.json && (res.json.token || res.json.accessToken || res.json.access_token);
  assert.ok(token, `login failed for ${email} (status ${res.status})`);
  return token;
}

const idOf = (j) => j && (j._id || j.id || (j.turno && (j.turno._id || j.turno.id)));

let tokenA;
let tokenB;
let turnoId;

before(async () => {
  tokenA = await tokenFor(PATIENT_A);
  tokenB = await tokenFor(PATIENT_B);
  const created = await call('POST', '/api/turnos', tokenA, TURNO_BODY);
  assert.ok([200, 201].includes(created.status), `create failed: ${created.status}`);
  turnoId = idOf(created.json);
  assert.ok(turnoId, 'POST /api/turnos did not return the Turno id');
});

after(async () => {
  if (turnoId) await call('DELETE', `/api/turnos/${turnoId}`, tokenA);
});

test('DELETE /api/turnos/:id without token returns 401', async () => {
  const res = await call('DELETE', `/api/turnos/${turnoId}`, null);
  assert.equal(res.status, 401);
});

test('DELETE /api/turnos/:id with another patient token returns 403', async () => {
  const res = await call('DELETE', `/api/turnos/${turnoId}`, tokenB);
  assert.equal(res.status, 403);
});

test('the Turno of patient A still exists after the rejected cancel', async () => {
  const res = await call('GET', '/api/turnos', tokenA);
  assert.equal(res.status, 200);
  const list = Array.isArray(res.json) ? res.json : (res.json && (res.json.turnos || res.json.data)) || [];
  assert.ok(list.some((t) => idOf(t) === turnoId), 'Turno was deleted by another patient');
});
