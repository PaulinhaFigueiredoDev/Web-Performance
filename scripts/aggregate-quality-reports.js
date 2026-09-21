import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const reportsRoot = path.join(process.cwd(), 'reports');

const reportPaths = {
  playwright: 'playwright/results.json',
  performance: 'lighthouse/performance/summary.json',
  lighthouseAccessibility: 'lighthouse/accessibility/summary.json',
  axeHomepage: 'axe/summary.json',
  axeHomepageRaw: 'axe/result.json',
  axeMobile: 'axe/mobile-menu/summary.json',
  axeMobileRaw: 'axe/mobile-menu/result.json',
  webViewLow: 'webview/low/summary.json',
  webViewMid: 'webview/mid/summary.json',
  webViewHigh: 'webview/high/summary.json'
};

async function readJson(relativePath) {
  const absolutePath = path.join(reportsRoot, relativePath);

  try {
    const [content, stats] = await Promise.all([
      fs.readFile(absolutePath, 'utf8'),
      fs.stat(absolutePath)
    ]);

    return {
      data: JSON.parse(content),
      source: {
        path: `reports/${relativePath}`,
        available: true,
        updatedAt: stats.mtime.toISOString()
      }
    };
  } catch (error) {
    return {
      data: null,
      source: {
        path: `reports/${relativePath}`,
        available: false,
        updatedAt: null,
        error: error.code === 'ENOENT' ? 'Relatório ainda não gerado.' : error.message
      }
    };
  }
}

function normalizePath(value = '') {
  return value.replaceAll('\\', '/');
}

function collectPlaywrightTests(suites, parentTitles = []) {
  const tests = [];

  for (const suite of suites || []) {
    const titles = [...parentTitles, suite.title].filter(Boolean);

    for (const spec of suite.specs || []) {
      const specFile = normalizePath(spec.file);
      const isE2E = specFile.startsWith('e2e/')
        || specFile.startsWith('tests/e2e/')
        || specFile.includes('/tests/e2e/');

      if (!isE2E) {
        continue;
      }

      for (const playwrightTest of spec.tests || []) {
        const results = playwrightTest.results || [];
        const lastResult = results.at(-1);
        const rawStatus = playwrightTest.status === 'flaky'
          ? 'flaky'
          : lastResult?.status || playwrightTest.status || 'skipped';
        const status = ['failed', 'timedOut', 'interrupted'].includes(rawStatus)
          ? 'failed'
          : rawStatus;
        const error = lastResult?.error || lastResult?.errors?.[0] || null;

        tests.push({
          title: spec.title,
          suite: titles.join(' › '),
          file: specFile,
          project: playwrightTest.projectName || playwrightTest.projectId || 'chromium',
          status,
          durationMs: results.reduce((total, result) => total + (result.duration || 0), 0),
          retries: Math.max(0, results.length - 1),
          error: error ? {
            message: error.message || error.value || 'Falha sem mensagem.',
            stack: error.stack || null
          } : null
        });
      }
    }

    tests.push(...collectPlaywrightTests(suite.suites, titles));
  }

  return tests;
}

function buildE2E(playwrightReport) {
  const tests = collectPlaywrightTests(playwrightReport?.suites);

  if (tests.length === 0) {
    return {
      available: false,
      status: 'unavailable',
      score: null,
      totals: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 },
      durationMs: 0,
      tests: []
    };
  }

  const totals = tests.reduce((result, item) => {
    result.total += 1;
    if (item.status === 'passed') result.passed += 1;
    else if (item.status === 'flaky') result.flaky += 1;
    else if (item.status === 'skipped') result.skipped += 1;
    else result.failed += 1;
    return result;
  }, { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 });
  const evaluated = Math.max(1, totals.total - totals.skipped);
  const score = Math.round(((totals.passed + totals.flaky) / evaluated) * 100);
  const status = totals.failed > 0 ? 'critical' : totals.flaky > 0 ? 'attention' : 'healthy';

  return {
    available: true,
    status,
    score,
    totals,
    durationMs: tests.reduce((total, item) => total + item.durationMs, 0),
    tests
  };
}

function buildPerformance(summary) {
  if (!summary?.metrics) {
    return { available: false, status: 'unavailable', score: null, metrics: {}, samples: [] };
  }

  const metrics = summary.metrics;
  const entries = Object.values(metrics);
  const passed = entries.filter((metric) => metric.passed).length;
  const score = Math.round((passed / Math.max(1, entries.length)) * 100);

  return {
    available: true,
    status: passed === entries.length ? 'healthy' : 'attention',
    score,
    lighthouseScore: summary.score,
    aggregation: summary.aggregation || 'single-run',
    runCount: summary.runCount || 1,
    metrics,
    samples: summary.samples || [],
    generatedAt: summary.generatedAt || null
  };
}

function buildLighthouseAccessibility(summary) {
  if (!summary) {
    return {
      available: false,
      status: 'unavailable',
      score: null,
      failedAudits: [],
      manualAudits: []
    };
  }

  return {
    available: true,
    status: summary.passed ? 'healthy' : 'critical',
    score: summary.score,
    threshold: summary.threshold,
    passed: summary.passed,
    failedAudits: summary.failedAudits || [],
    manualAudits: summary.manualAudits || [],
    generatedAt: summary.generatedAt || null
  };
}

function normalizeIncomplete(summary, raw) {
  if (summary?.incomplete) return summary.incomplete;

  return (raw?.incomplete || []).map((item) => ({
    id: item.id,
    impact: item.impact,
    help: item.help,
    helpUrl: item.helpUrl,
    nodes: (item.nodes || []).map((node) => ({
      target: node.target,
      html: node.html,
      failureSummary: node.failureSummary
    }))
  }));
}

function buildAxeTarget(name, summary, raw) {
  if (!summary) {
    return { name, available: false, counts: {}, violations: [], incomplete: [] };
  }

  return {
    name,
    available: true,
    counts: summary.counts || {},
    violations: summary.violations || [],
    incomplete: normalizeIncomplete(summary, raw)
  };
}

function buildAxe(homepageSummary, homepageRaw, mobileSummary, mobileRaw) {
  const targets = [
    buildAxeTarget('Homepage', homepageSummary, homepageRaw),
    buildAxeTarget('Menu mobile aberto', mobileSummary, mobileRaw)
  ];
  const availableTargets = targets.filter((target) => target.available);

  if (availableTargets.length === 0) {
    return { available: false, status: 'unavailable', score: null, targets };
  }

  const blocking = availableTargets.reduce(
    (total, target) => total + (target.counts.blocking || 0),
    0
  );
  const violations = availableTargets.reduce(
    (total, target) => total + (target.counts.violations || 0),
    0
  );
  const incomplete = availableTargets.reduce(
    (total, target) => total + target.incomplete.length,
    0
  );
  const score = blocking > 0 ? 0 : violations > 0 ? 75 : incomplete > 0 ? 95 : 100;

  return {
    available: true,
    status: blocking > 0 ? 'critical' : violations > 0 || incomplete > 0 ? 'attention' : 'healthy',
    score,
    totals: { blocking, violations, incomplete },
    targets
  };
}

function buildWebView(profileReports) {
  const profiles = profileReports.map(({ id, data }) => ({
    id,
    available: Boolean(data),
    ...(data || {})
  }));
  const availableProfiles = profiles.filter((profile) => profile.available);
  const passed = availableProfiles.filter((profile) => profile.passed).length;
  const failed = availableProfiles.length - passed;
  const missing = profiles.length - availableProfiles.length;

  return {
    available: availableProfiles.length > 0,
    status: failed > 0 ? 'critical' : missing > 0 ? 'attention' : 'healthy',
    score: availableProfiles.length === 0
      ? null
      : Math.round((passed / availableProfiles.length) * 100),
    totals: { total: profiles.length, passed, failed, missing },
    profiles
  };
}

function buildOverall(categories) {
  const weightedCategories = [
    { key: 'e2e', weight: 35, value: categories.e2e },
    { key: 'performance', weight: 30, value: categories.performance },
    { key: 'lighthouseAccessibility', weight: 15, value: categories.accessibility.lighthouse },
    { key: 'axe', weight: 20, value: categories.accessibility.axe }
  ];
  const available = weightedCategories.filter((category) => category.value.available);
  const availableWeight = available.reduce((total, category) => total + category.weight, 0);
  const score = availableWeight === 0
    ? null
    : Math.round(available.reduce(
      (total, category) => total + category.value.score * category.weight,
      0
    ) / availableWeight);
  const missing = weightedCategories
    .filter((category) => !category.value.available)
    .map((category) => category.key);
  if (!categories.webview.available) missing.push('webview');
  const qualityChecks = [...available.map((category) => category.value), categories.webview];
  const hasCritical = qualityChecks.some((category) => category.status === 'critical');
  const hasAttention = qualityChecks.some((category) => category.status === 'attention');
  const status = hasCritical
    ? 'critical'
    : hasAttention || missing.length > 0
      ? 'attention'
      : 'healthy';

  return {
    score,
    status,
    gatePassed: status === 'healthy' && missing.length === 0,
    missingCategories: missing,
    weights: Object.fromEntries(weightedCategories.map(({ key, weight }) => [key, weight])),
    requiredChecks: ['webview']
  };
}

export async function aggregateQualityReports({ write = false } = {}) {
  const entries = await Promise.all(
    Object.entries(reportPaths).map(async ([name, relativePath]) => {
      const result = await readJson(relativePath);
      return [name, result];
    })
  );
  const reports = Object.fromEntries(entries);
  const categories = {
    e2e: buildE2E(reports.playwright.data),
    webview: buildWebView([
      { id: 'low', data: reports.webViewLow.data },
      { id: 'mid', data: reports.webViewMid.data },
      { id: 'high', data: reports.webViewHigh.data }
    ]),
    performance: buildPerformance(reports.performance.data),
    accessibility: {
      lighthouse: buildLighthouseAccessibility(reports.lighthouseAccessibility.data),
      axe: buildAxe(
        reports.axeHomepage.data,
        reports.axeHomepageRaw.data,
        reports.axeMobile.data,
        reports.axeMobileRaw.data
      )
    }
  };
  const quality = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    overall: buildOverall(categories),
    categories,
    sources: Object.fromEntries(
      Object.entries(reports).map(([name, report]) => [name, report.source])
    )
  };

  if (write) {
    const outputPath = path.join(reportsRoot, 'quality/summary.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(quality, null, 2), 'utf8');
  }

  return quality;
}

const isDirectExecution = process.argv[1]
  && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectExecution) {
  const quality = await aggregateQualityReports({ write: true });
  console.log(`Dashboard de qualidade gerada: ${quality.overall.score ?? 'sem dados'}/100 (${quality.overall.status})`);
}
