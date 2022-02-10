# Primer React Consumer Test

This directory is used to run a simple test that asserts that a consumer of
Primer React can build their own project with strict TypeScript options enabled,
including `"skipLibCheck": false`.

During Primer React's build process, we run the TypeScript compiler and output
`.d.ts` declaration files for consumers of Primer React that are using
TypeScript. If the build script runs with a TypeScript configuration that has
any files in its `types` or `typeRoots` that import any of our development
dependencies, it's possible for our build output to be polluted by interface
augmentations in those dependencies, or in transitive dependencies.

The best way to avoid this is to ensure that any files that import development
dependencies are excluded in our `tsconfig.build.json` file we use to build
Primer React.

If a mistake is made and a file is omitted, we will catch those when we attempt
to build this consumer library, which has `"skipLibCheck": false` in its
TypeScript configuration.

For historical context, see these issues:

- [v27.0.0 breaks TypeScript typings](https://github.com/primer/react/issues/1163)
- [Storybook dependency changes types in build output](https://github.com/primer/react/issues/1849)
