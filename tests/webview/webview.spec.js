import { test, expect } from '../support/webview-test.js';
import { HomePage } from '../pages/HomePage.js';
import { attachJson, saveReport } from '../support/reports.js';

test('valida a jornada principal no contexto Android WebView', async ({ page, webViewProfile }, testInfo) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  const environment = await page.evaluate(() => ({
    userAgent: navigator.userAgent,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    maxTouchPoints: navigator.maxTouchPoints,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    bridgeAvailable: typeof window.ReactNativeWebView?.postMessage === 'function',
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
  }));

  await page.evaluate(() => window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' })));
  const bridgeMessages = await page.evaluate(() => window.__WEBVIEW_MESSAGES__);

  await expect(homePage.mobileMenuButton).toBeVisible();
  await expect(homePage.mobileMenuButton).toBeEnabled({ timeout: 30_000 });
  await homePage.mobileMenuButton.click();
  const mobileMenu = page.locator('#mobile-navigation-menu');
  await expect(mobileMenu).toBeVisible({ timeout: 20_000 });
  await mobileMenu.getByText('Best Sellers', { exact: true }).click();
  await expect(page).toHaveURL(/#best-sellers-section$/);

  const navigation = await page.evaluate(() => {
    const entry = performance.getEntriesByType('navigation')[0];
    if (!entry) return null;
    return {
      domContentLoadedMs: entry.domContentLoadedEventEnd,
      loadMs: entry.loadEventEnd,
      transferSize: entry.transferSize
    };
  });
  const checks = {
    webViewUserAgent: /\bwv\b/.test(environment.userAgent),
    touchEnabled: environment.maxTouchPoints > 0,
    viewportMatches: environment.viewport.width === webViewProfile.viewport.width
      && environment.viewport.height === webViewProfile.viewport.height,
    bridgeAvailable: environment.bridgeAvailable,
    bridgeMessageDelivered: bridgeMessages.includes('{"type":"ready"}'),
    responsiveLayout: !environment.horizontalOverflow,
    mobileNavigation: true
  };
  const passed = Object.values(checks).every(Boolean);
  const summary = {
    context: 'android-webview-emulation',
    profile: {
      id: webViewProfile.id,
      label: webViewProfile.label,
      device: webViewProfile.device,
      viewport: webViewProfile.viewport,
      deviceScaleFactor: webViewProfile.deviceScaleFactor,
      cpuSlowdownMultiplier: webViewProfile.cpuSlowdownMultiplier,
      network: {
        label: webViewProfile.network.label,
        latency: webViewProfile.network.latency,
        downloadKbps: Math.round((webViewProfile.network.downloadThroughput * 8) / 1000),
        uploadKbps: Math.round((webViewProfile.network.uploadThroughput * 8) / 1000)
      }
    },
    environment,
    checks,
    navigation,
    passed,
    generatedAt: new Date().toISOString()
  };

  await saveReport({
    directory: `webview/${webViewProfile.id}`,
    files: { 'summary.json': summary }
  });
  await attachJson(testInfo, `webview-${webViewProfile.id}-summary`, summary);

  for (const [name, result] of Object.entries(checks)) {
    expect.soft(result, `Validação WebView reprovada: ${name}`).toBe(true);
  }
});
