import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '2m', target: 1000 },
  ],
};

export default function () {
  http.post('http://localhost:3000/checkout/crypto', JSON.stringify({}), { headers: { 'Content-Type': 'application/json' } });
}