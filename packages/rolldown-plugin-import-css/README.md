# rolldown-plugin-import-css

> A Rolldown plugin to include generated CSS alongside transformed CSS Modules so
> that importing a component from a library includes its CSS.

## Usage

```ts
// rollup.config.js
import {importCSS} from 'rolldown-plugin-import-css'

export default {
  input: ['src/index.ts'],
  plugins: [
    // ...
    importCSS({
      modulesRoot: 'src',

      // Optionally, include postcss plugins to run alongside postcss-modules
      postcssPlugins: [autoprefixer()],

      // Optionally, include options to pass to postcss-modules
      postcssModulesOptions: {
        generateScopedName: '[name]_[local]_[hash:base64:5]',
      },
    }),
  ],
}
```

This plugin will include both the generated CSS Modules file which contains the
classes for the component to use along with the transformed CSS. When importing
the CSS Modules file, the transformed CSS will be included as well.

```ts
// Example output
import './path-to-header-[hash].css'
export default {
  header: 'header___3s4s',
}
```

This structure is designed so that consumers can import a component file and, as
long as their bundler is setup for this, the CSS for that component will be
included automatically
