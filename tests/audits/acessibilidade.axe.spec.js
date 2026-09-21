import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { attachJson, saveReport } from '../support/reports.js';

const blockingImpacts = new Set(['critical', 'serious']);
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

function summarize(results, url) {
  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    tags: violation.tags,
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      html: node.html,
      failureSummary: node.failureSummary
    }))
  }));
  const blockingViolations = violations.filter((violation) => blockingImpacts.has(violation.impact));
  const incomplete = results.incomplete.map((item) => ({
    id: item.id,
    impact: item.impact,
    description: item.description,
    help: item.help,
    helpUrl: item.helpUrl,
    tags: item.tags,
    nodes: item.nodes.map((node) => ({
      target: node.target,
      html: node.html,
      failureSummary: node.failureSummary
    }))
  }));

  return {
    summary: {
      tool: 'axe-core',
      url,
      generatedAt: results.timestamp,
      counts: {
        violations: violations.length,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length,
        blocking: blockingViolations.length
      },
      violations,
      incomplete
    },
    violations,
    blockingViolations
  };
}

function logViolations(violations) {
  if (violations.length > 0) {
    console.table(violations.map((violation) => ({
      Rule: violation.id,
      Impact: violation.impact,
      Elements: violation.nodes.length,
      Help: violation.help
    })));
  }
}

test('Acessibilidade da homepage com axe', async ({ page }, testInfo) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  const results = await new AxeBuilder({ page })
    .withTags(wcagTags)
    .analyze();
  const { summary, violations, blockingViolations } = summarize(results, page.url());

  await saveReport({
    directory: 'axe',
    files: {
      'result.json': results,
      'summary.json': summary
    }
  });
  await attachJson(testInfo, 'axe-accessibility-summary', summary);
  logViolations(violations);

  expect(
    blockingViolations,
    `${blockingViolations.length} violações critical/serious encontradas pelo axe`
  ).toEqual([]);
});

test.describe('Menu mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('Acessibilidade do Drawer aberto com axe', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.openMobileMenu();
    await homePage.mobileNavigation.waitFor();

    const results = await new AxeBuilder({ page })
      .include('#mobile-navigation-menu')
      .withTags(wcagTags)
      .analyze();
    const { summary, violations, blockingViolations } = summarize(results, page.url());

    await saveReport({
      directory: 'axe/mobile-menu',
      files: {
        'result.json': results,
        'summary.json': summary
      }
    });
    await attachJson(testInfo, 'axe-mobile-menu-summary', summary);
    logViolations(violations);

    expect(
      blockingViolations,
      `${blockingViolations.length} violações critical/serious no menu mobile`
    ).toEqual([]);
  });
});
