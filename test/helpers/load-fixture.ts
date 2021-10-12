import { promises as fsp } from 'fs';
import { URL } from 'node:url';
import path from 'path';

export async function loadFixture(name: string): Promise<string> {
  const __dirname = new URL('.', import.meta.url).pathname;
  const fixtureDir = path.resolve(__dirname, '..', 'fixtures');
  return fsp.readFile(path.join(fixtureDir, name), 'utf8');
}
