# `@primer/spec`

Utilities for parsing and validating Primer component specifications.

The package supports both component spec layouts:

```text
Component/
└── SPEC.md
```

```text
Component/
└── spec/
    ├── README.md
    ├── default.md
    └── feature.md
```

## Usage

Parse and validate one component:

```ts
import {loadComponentSpec} from '@primer/spec'

const result = await loadComponentSpec('packages/react/src/Component')

if (!result.valid) {
  for (const diagnostic of result.diagnostics) {
    console.error(
      `${diagnostic.location.path}:${diagnostic.location.line}:${diagnostic.location.column} ${diagnostic.message}`,
    )
  }
}

console.log(result.value)
```

Find and validate every component spec below a directory:

```ts
import {validateComponentSpecs} from '@primer/spec'

const result = await validateComponentSpecs('packages/react/src')
```

Pure Markdown parsers are also exported for tooling that already owns file
loading:

```ts
import {parseComponentSpec, parseFeatureSpec, parseSpecIndex} from '@primer/spec'
```

Parsing always returns a normalized value when enough structure is available,
along with source-located diagnostics. `valid` is `false` when any error
diagnostic is present.
