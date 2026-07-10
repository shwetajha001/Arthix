import dotenv from 'dotenv';
dotenv.config();

const API = 'http://localhost:5001/api';

const run = async () => {
  const random = Math.random().toString(36).slice(2, 8);
  const email = `testuser+${random}@example.com`;
  const password = 'Test1234!';

  console.log('Signup', email);
  let res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email, password }),
  });
  console.log('signup status', res.status);
  let data = await res.json();
  console.log('signup data', data);

  res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log('login status', res.status);
  data = await res.json();
  console.log('login data', data);
  const token = data.token;

  res = await fetch(`${API}/budget`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ monthlyBudget: 5000 }),
  });
  console.log('put budget status', res.status);
  console.log('put budget body', await res.json());

  res = await fetch(`${API}/budget`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('get budget status', res.status);
  console.log('get budget body', await res.json());
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
