import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter, Trend } from 'k6/metrics';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export default function () {
  const baseURL = __ENV.BASE_URL || 'https://tictactoe.example.com';
  
  const res = http.get(`${baseURL}/`);
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'contains game': (r) => r.body.includes('Tic') || r.body.includes('game'),
  });
  
  errorRate.add(!success);
  responseTime.add(res.timings.duration);
  
  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '  ';
  const enableColors = options.enableColors || false;
  
  let output = '\n';
  output += '=== K6 Load Test Results ===\n\n';
  
  output += `${indent}Total Requests: ${data.metrics.http_reqs.values.count}\n`;
  output += `${indent}Failed Requests: ${data.metrics.http_req_failed.values.passes}\n`;
  output += `${indent}Request Rate: ${data.metrics.http_reqs.values.rate.toFixed(2)} req/s\n\n`;
  
  output += `${indent}Response Times:\n`;
  output += `${indent}  - Avg: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
  output += `${indent}  - Max: ${data.metrics.http_req_duration.values.max.toFixed(2)}ms\n`;
  output += `${indent}  - P95: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
  output += `${indent}  - P99: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms\n\n`;
  
  const thresholds = data.metrics.thresholds;
  for (const [key, value] of Object.entries(thresholds)) {
    output += `${indent}${key}: ${value.ok ? 'PASSED ✓' : 'FAILED ✗'}\n`;
  }
  
  return output;
}