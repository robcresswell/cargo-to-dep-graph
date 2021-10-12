#!/usr/bin/env -S node --experimental-specifier-resolution=node --loader ts-node/esm/transpile-only --no-warnings
import type { AssertionError } from 'assert';
import assert from 'assert/strict';
import path from 'path';
import { buildDepGraph } from '../src/main';
import { loadFixture } from './helpers/load-fixture';

async function test() {
  const cargoFileRaw = await loadFixture(path.join('simple', 'Cargo.toml'));
  const cargoLockRaw = await loadFixture(path.join('simple', 'Cargo.lock'));

  const expected = {
    schemaVersion: '1.2.0',
    pkgManager: { name: 'cargo' },
    pkgs: [
      {
        id: 'rust-test@0.1.0',
        info: {
          name: 'rust-test',
          version: '0.1.0',
        },
      },
      {
        id: 'rand@0.8.4',
        info: {
          name: 'rand',
          version: '0.8.4',
        },
      },
      {
        id: 'libc@0.2.103',
        info: {
          name: 'libc',
          version: '0.2.103',
        },
      },
      {
        id: 'rand_chacha@0.3.1',
        info: {
          name: 'rand_chacha',
          version: '0.3.1',
        },
      },
      {
        id: 'rand_core@0.6.3',
        info: {
          name: 'rand_core',
          version: '0.6.3',
        },
      },
      {
        id: 'rand_hc@0.3.1',
        info: {
          name: 'rand_hc',
          version: '0.3.1',
        },
      },
      {
        id: 'ppv-lite86@0.2.10',
        info: {
          name: 'ppv-lite86',
          version: '0.2.10',
        },
      },
      {
        id: 'getrandom@0.2.3',
        info: {
          name: 'getrandom',
          version: '0.2.3',
        },
      },
      {
        id: 'cfg-if@1.0.0',
        info: {
          name: 'cfg-if',
          version: '1.0.0',
        },
      },
      {
        id: 'wasi@0.10.2+wasi-snapshot-preview1',
        info: {
          name: 'wasi',
          version: '0.10.2+wasi-snapshot-preview1',
        },
      },
    ],
    graph: {
      rootNodeId: 'root-node',
      nodes: [
        {
          nodeId: 'root-node',
          pkgId: 'rust-test@0.1.0',
          deps: [
            {
              nodeId: 'rand@0.8.4',
            },
          ],
        },
        {
          nodeId: 'rand@0.8.4',
          pkgId: 'rand@0.8.4',
          deps: [
            {
              nodeId: 'libc@0.2.103',
            },
            {
              nodeId: 'rand_chacha@0.3.1',
            },
            {
              nodeId: 'rand_core@0.6.3',
            },
            {
              nodeId: 'rand_hc@0.3.1',
            },
          ],
        },
        {
          nodeId: 'libc@0.2.103',
          pkgId: 'libc@0.2.103',
          deps: [],
        },
        {
          nodeId: 'rand_chacha@0.3.1',
          pkgId: 'rand_chacha@0.3.1',
          deps: [
            {
              nodeId: 'ppv-lite86@0.2.10',
            },
            {
              nodeId: 'rand_core@0.6.3',
            },
          ],
        },
        {
          nodeId: 'rand_core@0.6.3',
          pkgId: 'rand_core@0.6.3',
          deps: [
            {
              nodeId: 'getrandom@0.2.3',
            },
          ],
        },
        {
          nodeId: 'rand_hc@0.3.1',
          pkgId: 'rand_hc@0.3.1',
          deps: [
            {
              nodeId: 'rand_core@0.6.3',
            },
          ],
        },
        {
          nodeId: 'ppv-lite86@0.2.10',
          pkgId: 'ppv-lite86@0.2.10',
          deps: [],
        },
        {
          nodeId: 'getrandom@0.2.3',
          pkgId: 'getrandom@0.2.3',
          deps: [
            {
              nodeId: 'cfg-if@1.0.0',
            },
            {
              nodeId: 'libc@0.2.103',
            },
            {
              nodeId: 'wasi@0.10.2+wasi-snapshot-preview1',
            },
          ],
        },
        {
          nodeId: 'cfg-if@1.0.0',
          pkgId: 'cfg-if@1.0.0',
          deps: [],
        },
        {
          nodeId: 'wasi@0.10.2+wasi-snapshot-preview1',
          pkgId: 'wasi@0.10.2+wasi-snapshot-preview1',
          deps: [],
        },
      ],
    },
  };

  const { depGraph } = await buildDepGraph(cargoFileRaw, cargoLockRaw);
  const depGraphJson = depGraph.toJSON();

  assert.deepStrictEqual(depGraphJson, expected);
}

test()
  .then(() => {
    console.log('\x1b[32m✓ All tests passed!\x1b[0m');
  })
  .catch((err: unknown) => {
    console.error((err as AssertionError).message);
    console.log('\x1b[31m⨯ Tests failed!\x1b[0m');
    process.exit(1);
  });
