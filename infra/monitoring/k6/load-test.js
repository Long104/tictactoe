import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const baseURL = __ENV.BASE_URL || 'https://tictactoe.example.com';
  
  // Homepage test
  const home = http.get(baseURL);
  check(home, {
    'homepage status 200': (r) => r.status === 200,
  });
  
  // Health check
  const health = http.get(`${baseURL}/health`);
  check(health, {
    'health check 200': (r) => r.status === 200,
  });
  
  // API test
  const api = http.get(`${baseURL}/api/status`);
  check(api, {
    'api status 200': (r) => r.status === 200,
  });
  
  sleep(0.5);
}

export function handleSummary(data) {
  return {
    'stdout': JSON.stringify({
      total_requests: data.metrics.http_reqs.values.count,
      failed_rate: data.metrics.http_req_failed.values.rate,
      avg_duration: data.metrics.http_req_duration.values.avg,
      p95_duration: data.metrics.http_req_duration.values['p(95)'],
    }),
    'stress-test-results.json': JSON.stringify(data),
  };
}