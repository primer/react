## Rule Details

This rule aims to prevent the use of the `title` attribute with some components from `@primer/react`. The `title` attribute is not keyboard accessible, which results in accessibility issues. Instead, we should utilize alternatives that are accessible.

👎 Examples of **incorrect** code for this rule

```jsx
import {RelativeTime} from '@primer/react'

const App = () => <RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={false} />
```

👍 Examples of **correct** code for this rule:

```jsx
import {RelativeTime} from '@primer/react'

const App = () => <RelativeTime date={new Date('2020-01-01T00:00:00Z')} />
```

The noTitle attribute is true by default, so it can be omitted.

## With alternative tooltip

If you want to still utilize a tooltip in a similar way to how the `title` attribute works, you can use the [Primer `Tooltip`](https://primer.style/components/tooltip/react/beta). If you use the `Tooltip` component, you must use it with an interactive element, such as with a button or a link.

```jsx
import {RelativeTime, Tooltip} from '@primer/react'

const App = () => {
  const date = new Date('2020-01-01T00:00:00Z')
  return (
    <Tooltip text={date.toString()}>
      <Link href="#">
        <RelativeTime date={date} noTitle={true} />
      </Link>
    </Tooltip>
  )
}
```
