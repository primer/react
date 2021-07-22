---
'@primer/components': minor
---

The following components have been deprecated in favor of the `Box` component:

| Component   | Replacement                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- |
| `Flex`      | `<Box display="flex">`                                                                      |
| `Grid`      | `<Box display="grid">`                                                                      |
| `Position`  | `<Box>`                                                                                     |
| `Absolute`  | `<Box position="absolute">`                                                                 |
| `Fixed`     | `<Box position="fixed">`                                                                    |
| `Relative`  | `<Box position="relative">`                                                                 |
| `Sticky`    | `<Box position="sticky">`                                                                   |
| `BorderBox` | `<Box borderWidth="1px" borderStyle="solid" borderColor="border.primary" borderRadius={2}>` |

There is a codemod available to upgrade these components:

- TypeScript example:

  ```shell
  npx jscodeshift -t node_modules/@primer/components/codemods/deprecateUtilityComponents.js
  --parser=tsx path/to/workspace/src/*.tsx
  ```

- Babel example:

  ```shell
  npx jscodeshift -t node_modules/@primer/components/codemods/deprecateUtilityComponents.js
  --parser=babel path/to/workspace/src/*.tsx
  ```
