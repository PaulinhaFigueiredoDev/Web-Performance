import fs from 'node:fs/promises';
import path from 'node:path';

export async function saveReport({ directory, files }) {
  const reportDirectory = path.resolve('reports', directory);
  await fs.mkdir(reportDirectory, { recursive: true });

  const paths = {};
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(reportDirectory, filename);
    const output = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    await fs.writeFile(filePath, output, 'utf8');
    paths[filename] = filePath;
  }

  return paths;
}

export async function attachJson(testInfo, name, value) {
  await testInfo.attach(name, {
    body: Buffer.from(JSON.stringify(value, null, 2)),
    contentType: 'application/json'
  });
}
