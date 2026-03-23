import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '30s', target: 100 },
    { duration: '10s', target: 100 },
    { duration: '30s', target: 500 },
    { duration: '10s', target: 500 },
    { duration: '1m', target: 10 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const baseURL = __ENV.BASE_URL || 'https://tictactoe.example.com';
  
  const res = http.get(baseURL);
  
  check(res, {
    'response received': (r) => r.status > 0,
    'not timeout': (r) => r.timings.duration < 5000,
  });
}