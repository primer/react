---
"@primer/components": major
---

Components no longer have a default `theme` prop. To ensure components still render correctly, you'll need pass the Primer theme to a [styled-components](https://styled-components.com/) `<ThemeProvider>` at the root of your application:

```jsx
import {ThemeProvider} from 'styled-components'
import {theme} from '@primer/components'

funciton App(props) {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <div>your app here</div>
      </ThemeProvider>
    </div>
  )
}
```
