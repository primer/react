### Technical debt

This is where catalog technical debt, reasons we took it on and strategies on paying it in the future.

1. TODO: [create-slots](https://github.com/primer/react/blob/main/src/utils/create-slots.tsx) needs a double render which would create UI jank with server side rendering
2. TODO: styled-components + styled-system performance adds up over time as components build up
3. TODO: primitives are resolved to hex values instead of css variables which creates [flash of incorrect theme](https://github.com/primer/react/pull/1868#:~:text=Long%20term%20fix%20(not%20in%20this%20PR)%3A)
