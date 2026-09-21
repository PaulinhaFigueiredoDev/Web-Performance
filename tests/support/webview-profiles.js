const androidWebViewUserAgent = (device, androidVersion) =>
  `Mozilla/5.0 (Linux; Android ${androidVersion}; ${device} Build/WebViewTest; wv) `
  + 'AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.0.0 Mobile Safari/537.36';

export const webViewProfiles = {
  'webview-low': {
    id: 'low',
    label: 'Low-end',
    device: 'Android Go',
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 2,
    userAgent: androidWebViewUserAgent('Android Go', '11'),
    cpuSlowdownMultiplier: 6,
    network: {
      label: '4G limitada',
      latency: 150,
      downloadThroughput: 1_600_000 / 8,
      uploadThroughput: 750_000 / 8,
      connectionType: 'cellular4g'
    },
    hardwareConcurrency: 2,
    deviceMemory: 2
  },
  'webview-mid': {
    id: 'mid',
    label: 'Mid-end',
    device: 'Android intermediário',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2.75,
    userAgent: androidWebViewUserAgent('Android Mid', '13'),
    cpuSlowdownMultiplier: 4,
    network: {
      label: '4G',
      latency: 80,
      downloadThroughput: 4_000_000 / 8,
      uploadThroughput: 3_000_000 / 8,
      connectionType: 'cellular4g'
    },
    hardwareConcurrency: 4,
    deviceMemory: 4
  },
  'webview-high': {
    id: 'high',
    label: 'High-end',
    device: 'Android premium',
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 3,
    userAgent: androidWebViewUserAgent('Android High', '15'),
    cpuSlowdownMultiplier: 1,
    network: {
      label: '5G/Wi-Fi rápida',
      latency: 40,
      downloadThroughput: 20_000_000 / 8,
      uploadThroughput: 10_000_000 / 8,
      connectionType: 'cellular4g'
    },
    hardwareConcurrency: 8,
    deviceMemory: 8
  }
};

export function getWebViewProfile(projectName) {
  const profile = webViewProfiles[projectName];
  if (!profile) throw new Error(`Perfil WebView desconhecido: ${projectName}`);
  return profile;
}
