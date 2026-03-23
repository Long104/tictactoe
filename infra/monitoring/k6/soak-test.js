import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 50 },
    { duration: '30m', target: 50 },
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
    memory: ['avg<500'],
  },
};

export default function () {
  const baseURL = __ENV.BASE_URL || 'https://tictactoe.example.com';
  
  const responses = http.batch([
    ['GET', baseURL],
    ['GET', `${baseURL}/health`],
    ['GET', `${baseURL}/api/status`],
  ]);
  
  check(responses[0], {
    'homepage loaded': (r) => r.status === 200,
  });
  
  check(responses[1], {
    'health endpoint OK': (r) => r.status === 200,
  });
  
  check(responses[2], {
    'api status OK': (r) => r.status === 200,
  });
  
  sleep(1);
}