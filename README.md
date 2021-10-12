# cargo-to-dep-graph

A small library that converts Cargo files (a `cargo.toml` and its
respective `cargo.lock`) into a
[dependency graph](https://www.npmjs.com/package/@snyk/dep-graph)

## Getting started

```console
npm i cargo-to-dep-graph
```

```ts
import { cargoToDepGraph } from 'cargo-to-dep-graph';

const depGraph = await cargoToDepGraph(
  'cargo.toml file contents',
  'cargo.lock file contents',
);
```
