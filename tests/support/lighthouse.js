import * as chromeLauncher from 'chrome-launcher';

export async function runLighthouseAudit({ url, category }) {
  const lighthouseModule = await import('lighthouse');
  const lighthouse = lighthouseModule.default;
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'html',
      onlyCategories: [category]
    });

    if (!result) {
      throw new Error(`Lighthouse did not return a result for ${category}`);
    }

    return result;
  } finally {
    await chrome.kill();
  }
}
