import { test, expect } from '@playwright/test';
import { runLighthouseAudit } from '../support/lighthouse.js';
import { attachJson, saveReport } from '../support/reports.js';

function extractMetrics(result, thresholds) {
  const audits = result.lhr.audits;
  return {
    FCP: { value: audits['first-contentful-paint']?.numericValue, threshold: thresholds.fcp },
    LCP: { value: audits['largest-contentful-paint']?.numericValue, threshold: thresholds.lcp },
    CLS: { value: audits['cumulative-layout-shift']?.numericValue, threshold: thresholds.cls },
    TTFB: { value: audits['server-response-time']?.numericValue, threshold: thresholds.ttfb }
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

test('Performance da homepage', async ({}, testInfo) => {
  test.setTimeout(120_000);

  const url = testInfo.project.use.baseURL;
  const runCount = Number(process.env.LIGHTHOUSE_PERFORMANCE_RUNS || 3);
  const thresholds = { fcp: 1800, lcp: 2500, cls: 0.1, ttfb: 800 };
  const runs = [];

  for (let index = 0; index < runCount; index += 1) {
    const result = await runLighthouseAudit({ url, category: 'performance' });
    runs.push({
      result,
      score: Math.round(result.lhr.categories.performance.score * 100),
      metrics: extractMetrics(result, thresholds)
    });
  }

  const metrics = Object.fromEntries(
    Object.keys(runs[0].metrics).map((name) => [name, {
      value: median(runs.map((run) => run.metrics[name].value)),
      threshold: runs[0].metrics[name].threshold
    }])
  );

  for (const metric of Object.values(metrics)) {
    metric.passed = metric.value < metric.threshold;
  }

  const representativeRun = [...runs].sort(
    (first, second) => first.metrics.LCP.value - second.metrics.LCP.value
  )[Math.floor(runs.length / 2)];

  const summary = {
    tool: 'lighthouse',
    category: 'performance',
    url,
    aggregation: 'median',
    runCount,
    score: median(runs.map((run) => run.score)),
    generatedAt: representativeRun.result.lhr.fetchTime,
    samples: runs.map((run, index) => ({
      run: index + 1,
      score: run.score,
      metrics: run.metrics
    })),
    metrics
  };

  const files = {
    'report.html': representativeRun.result.report,
    'result.json': representativeRun.result.lhr,
    'summary.json': summary
  };
  runs.forEach((run, index) => {
    files[`run-${index + 1}.html`] = run.result.report;
    files[`run-${index + 1}.json`] = run.result.lhr;
  });

  await saveReport({
    directory: 'lighthouse/performance',
    files
  });
  await attachJson(testInfo, 'lighthouse-performance-summary', summary);

  console.table(
    Object.fromEntries(
      Object.entries(metrics).map(([name, metric]) => [name, {
        Value: Number(metric.value.toFixed(name === 'CLS' ? 3 : 2)),
        Threshold: `< ${metric.threshold}`,
        Status: metric.passed ? 'PASS' : 'FAIL'
      }])
    )
  );

  for (const [name, metric] of Object.entries(metrics)) {
    expect.soft(metric.value, `${name} acima do threshold`).toBeLessThan(metric.threshold);
  }
});
