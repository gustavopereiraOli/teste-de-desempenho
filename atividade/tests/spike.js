import http from 'k6/http';

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '10s', target: 300 },
    { duration: '1m', target: 300 },
    { duration: '0s', target: 10 },
  ],
};

export default function () {
  http.post('http://localhost:3000/checkout/simple', JSON.stringify({}), { headers: { 'Content-Type': 'application/json' } });
}