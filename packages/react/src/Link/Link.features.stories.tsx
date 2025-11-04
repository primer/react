import Link from '../Link'
import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/Link/Features',
  component: Link,
} as Meta<ComponentProps<typeof Link>>

export const Muted = () => (
  <Link href="#" muted>
    Link
  </Link>
)

export const Underline = () => (
  <Link href="#" underline>
    Link
  </Link>
)

export const Inline = () => (
  <div data-a11y-link-underlines="true">
    <Link inline={true} href="#">
      Link
    </Link>
  </div>
)
