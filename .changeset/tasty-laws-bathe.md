---
'@primer/components': minor
---

System props are deprecated in all components except `Box`. Move all system props into the [`sx` prop](https://primer.style/components/overriding-styles) instead. Example:

```diff
- <Button mr={2}>...</Button>
+ <Button sx={{mr: 2}}>...</Button>
```

There is a codemod available to migrate from system props to the `sx` prop:

- TypeScript example:

  ```shell
  npx jscodeshift -t node_modules/@primer/components/codemods/removeSystemProps.js
  --parser=tsx path/to/workspace/src/*.tsx
  ```

- Babel example:

  ```shell
  npx jscodeshift -t node_modules/@primer/components/codemods/removeSystemProps.js
  --parser=babel path/to/workspace/src/*.tsx
  ```
