import { test, expect } from '@playwright/test';
import { runLighthouseAudit } from '../support/lighthouse.js';
import { attachJson, saveReport } from '../support/reports.js';

function getAuditNodes(audit) {
  return (audit.details?.items || []).map((item) => ({
    selector: item.node?.selector || item.node?.path || null,
    snippet: item.node?.snippet || null,
    explanation: item.node?.explanation || item.explanation || null
  }));
}

test('Acessibilidade da homepage com Lighthouse', async ({}, testInfo) => {
  const url = testInfo.project.use.baseURL;
  const threshold = Number(process.env.LIGHTHOUSE_A11Y_MIN_SCORE || 90);
  const result = await runLighthouseAudit({ url, category: 'accessibility' });
  const category = result.lhr.categories.accessibility;
  const categoryAudits = category.auditRefs.map(({ id }) => result.lhr.audits[id]);
  const failedAudits = categoryAudits
    .filter((audit) => audit.scoreDisplayMode !== 'notApplicable' && audit.score === 0)
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      description: audit.description,
      score: audit.score,
      displayValue: audit.displayValue || null,
      nodes: getAuditNodes(audit)
    }));
  const manualAudits = categoryAudits
    .filter((audit) => audit.scoreDisplayMode === 'manual')
    .map((audit) => ({ id: audit.id, title: audit.title, description: audit.description }));
  const score = Math.round(category.score * 100);
  const summary = {
    tool: 'lighthouse',
    category: 'accessibility',
    url,
    score,
    threshold,
    passed: score >= threshold,
    generatedAt: result.lhr.fetchTime,
    failedAudits,
    manualAudits
  };

  await saveReport({
    directory: 'lighthouse/accessibility',
    files: {
      'report.html': result.report,
      'result.json': result.lhr,
      'summary.json': summary
    }
  });
  await attachJson(testInfo, 'lighthouse-accessibility-summary', summary);

  console.log(`Lighthouse Accessibility: ${score}/100`);
  if (failedAudits.length > 0) {
    console.table(failedAudits.map((audit) => ({
      Audit: audit.id,
      Title: audit.title,
      Elements: audit.nodes.length
    })));
  }

  expect(score, `Nota de acessibilidade abaixo de ${threshold}`).toBeGreaterThanOrEqual(threshold);
});
