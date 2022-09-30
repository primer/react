import {canUseDOM} from '../utils/environment'

if (canUseDOM) {
  if (typeof require === 'function') {
    Promise.resolve().then(() => {
      require('@github/markdown-toolbar-element')
    })
  } else {
    import('@github/markdown-toolbar-element')
  }
}
