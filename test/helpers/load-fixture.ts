import { promises as fsp } from 'fs';
import path from 'path';

export async function loadFixture(name: string): Promise<string> {
  const fixtureDir = path.resolve(__dirname, '..', 'fixtures');
  return fsp.readFile(path.join(fixtureDir, name), 'utf8');
}
