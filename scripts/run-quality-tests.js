import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aggregateQualityReports } from './aggregate-quality-reports.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const playwrightCli = path.join(projectRoot, 'node_modules/@playwright/test/cli.js');
const result = spawnSync(process.execPath, [playwrightCli, 'test', '--workers=1'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: process.env
});

try {
  const quality = await aggregateQualityReports({ write: true });
  console.log(`\nDashboard de qualidade: ${quality.overall.score ?? 'sem dados'}/100 (${quality.overall.status})`);
} catch (error) {
  console.error('\nNão foi possível gerar os dados da dashboard.', error);
  process.exitCode = 1;
}

if (process.exitCode !== 1) {
  process.exitCode = result.status ?? 1;
}
