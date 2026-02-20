# Component API Design Guidelines

All component API guidelines have been moved to `.github/instructions/` files where they are automatically applied by Copilot when working on matching files.

## Instructions files

| File                                                                                         | Applies to                      | Contents                                                                                                             |
| -------------------------------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [typescript-react.instructions.md](../.github/instructions/typescript-react.instructions.md) | `**/*.ts, **/*.tsx`             | File structure, props, refs, CSS module integration, variants, responsive props, dev warnings, SSR, exports          |
| [css.instructions.md](../.github/instructions/css.instructions.md)                           | `**/*.css`                      | Class names, data attributes, custom properties, Primer tokens, responsive design, specificity                       |
| [testing.instructions.md](../.github/instructions/testing.instructions.md)                   | `**/*.test.tsx, **/*.test.ts`   | Unit test patterns, story patterns, VRT/AVT, docs.json format, coverage checklist                                    |
| [component-design.instructions.md](../.github/instructions/component-design.instructions.md) | `packages/react/src/**/*.tsx`   | Children vs data props, compound components, polymorphism, defaults/escape hatches, deprecation, known anti-patterns |
| [hooks.instructions.md](../.github/instructions/hooks.instructions.md)                       | `packages/react/src/**/use*.ts` | Component vs generic behavior hooks, dependency rules, hook design rules                                             |

## Other contributor docs

- [Principles](./principles.md) — core values
- [Style Guide](./style.md) — preferred code patterns
- [Authoring CSS](./authoring-css.md) — CSS Modules deep dive
- [Testing](./testing.md) — testing strategy
- [Behaviors](./behaviors.md) — hook architecture
- [Component contents API patterns](./component-contents-api-patterns.md) — children vs data deep dive
- [Deprecating components](./deprecating-components.md) — deprecation process
- [ADRs](./adrs/) — architectural decision records
