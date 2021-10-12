import toml from '@iarna/toml';
import { DepGraph, DepGraphBuilder } from '@snyk/dep-graph';
import { eventLoopSpinner } from 'event-loop-spinner';

export async function buildDepGraph(
  cargoFileRaw: string,
  cargoLockRaw: string,
): Promise<{ depGraph: DepGraph }> {
  const cargoFile = toml.parse(cargoFileRaw) as unknown as CargoFile;
  const lockfile = toml.parse(cargoLockRaw) as unknown as CargoLockFile;

  const graphBuilder = new DepGraphBuilder(
    { name: 'cargo' },
    {
      name: cargoFile.package.name,
      version: cargoFile.package.version,
    },
  );

  const lockFileDepLookup: {
    [packageName: string]: {
      name: string;
      version: string;
      source: string;
      checksum: string;
      dependencies: string[];
    };
  } = {};

  lockfile.package.forEach((pkg) => {
    lockFileDepLookup[pkg.name] = pkg;
  });

  const queue: {
    parentNodeId: string;
    name: string;
    version: string;
    dependencies: string[];
  }[] = Object.keys(cargoFile.dependencies).map((name) => {
    const { version, dependencies } = lockFileDepLookup[name];

    return {
      parentNodeId: 'root-node',
      name,
      version,
      dependencies,
    };
  });

  while (queue.length > 0) {
    if (eventLoopSpinner.isStarving()) {
      await eventLoopSpinner.spin();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { name, version, dependencies, parentNodeId } = queue.shift()!;

    const nodeId = `${name}@${version}`;

    graphBuilder.addPkgNode(
      {
        name,
        version,
      },
      nodeId,
    );

    graphBuilder.connectDep(parentNodeId, nodeId);

    if (dependencies) {
      dependencies.forEach((dependencyName) => {
        queue.push({
          parentNodeId: nodeId,
          ...lockFileDepLookup[dependencyName],
        });
      });
    }
  }

  return { depGraph: graphBuilder.build() };
}

/**
 * A `cargo.toml` file parsed to JSON
 */
interface CargoFile {
  package: {
    name: string;
    version: string;
    edition: string;
  };
  dependencies: {
    [packageName: string]: string;
  };
  'dev-dependencies': {
    [packageName: string]: string;
  };
  'build-dependencies': {
    [packageName: string]: string;
  };
}

/**
 * A `cargo.lock` file parsed to JSON
 */
interface CargoLockFile {
  version: number;
  package: {
    name: string;
    version: string;
    source: string;
    checksum: string;
    dependencies: string[];
  }[];
}
