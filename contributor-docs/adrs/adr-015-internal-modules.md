# Internal Modules

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | ✅     |

## Context

Currently all files live under the `src` directory. In the `npm` package for `@primer/react`, we specify the following export pattern:

```json5
{
  exports: {
    // ...
    './lib-esm/*': {
      import: [
        // ...
      ],
      require: [
        // ...
      ],
    },
  },
}
```

This pattern, along with our Rollup setup, opts-in files and folders under the `src` directory into the public API of the package. This means that certain parts of the codebase which aren't intended to be used outside of `@primer/react` are considered part of its public API and can be imported and used by consumers.

## Decision

Adopt a convention in Primer React where internal modules live in the `src/internal` folder. This folder which would include all components, hooks, and other modules which are not intended for usage outside of the project. Files within `src/internal` may be grouped by area, such as `src/internal/components`, `src/internal/hooks`, etc.

In the `"exports"` field of our `npm` package, we can then add the following pattern:

```json5
{
  exports: {
    // ...
    './lib-esm/internal/*': null,
  },
}
```

This pattern would remove any files and folders within `src/internal` from the public API of the `npm` package. This pattern is inspired by [this section](https://nodejs.org/api/packages.html#package-entry-points) from Node.js, specifically this example:

```json
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### Impact

- Update the `"exports"` field in `package.json` to exclude `./lib-esm/internal` from usage
- (In a major release) Move internal-only files into internal folder
- For internal modules that are being created after this ADR is accepted, add them to the `src/internal` folder
