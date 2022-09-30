import {canUseDOM} from '../utils/environment'

if (canUseDOM) {
  if (typeof require === 'function') {
    // Since require() is synchronous, we use Promise.resolve() to create a
    // promise-chain to then run `require()` in order to emulate `import()`
    // behavior
    // eslint-disable-next-line github/no-then
    Promise.resolve().then(() => {
      require('@github/markdown-toolbar-element')
    })
  } else {
    import('@github/markdown-toolbar-element')
  }
}
