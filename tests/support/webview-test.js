import { test as base, expect } from '@playwright/test';
import { getWebViewProfile } from './webview-profiles.js';

export const test = base.extend({
  webViewProfile: [async ({ page }, use, testInfo) => {
    const profile = getWebViewProfile(testInfo.project.name);
    const client = await page.context().newCDPSession(page);

    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: profile.network.latency,
      downloadThroughput: profile.network.downloadThroughput,
      uploadThroughput: profile.network.uploadThroughput,
      connectionType: profile.network.connectionType
    });
    await client.send('Emulation.setCPUThrottlingRate', {
      rate: profile.cpuSlowdownMultiplier
    });

    await page.addInitScript(({ hardwareConcurrency, deviceMemory }) => {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        configurable: true,
        get: () => hardwareConcurrency
      });
      Object.defineProperty(navigator, 'deviceMemory', {
        configurable: true,
        get: () => deviceMemory
      });
      window.__WEBVIEW_MESSAGES__ = [];
      window.ReactNativeWebView = {
        postMessage(message) {
          window.__WEBVIEW_MESSAGES__.push(String(message));
        }
      };
    }, {
      hardwareConcurrency: profile.hardwareConcurrency,
      deviceMemory: profile.deviceMemory
    });

    await use(profile);
    await client.detach();
  }, { auto: true }]
});

export { expect };
