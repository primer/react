import Link from '.'
import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/Link/Dev',
  component: Link,
} as Meta<ComponentProps<typeof Link>>

export const Inline = () => (
  <div>
    <div style={{display: 'flex', flexDirection: 'column'}} data-a11y-link-underlines="true">
      [data-a11y-link-underlines=true] (inline links have underline)
      <Link href="#">inline: undefined</Link>
      <Link inline={true} href="#">
        inline: true
      </Link>
      <Link inline={false} href="#">
        inline: false
      </Link>
      <br />
      <Link muted={true} inline={true} href="#">
        inline: true, muted: true
      </Link>
    </div>
    <br />
    <div style={{display: 'flex', flexDirection: 'column'}} data-a11y-link-underlines="false">
      [data-a11y-link-underlines=false] (inline has no effect)
      <Link href="#">inline: undefined</Link>
      <Link inline={true} href="#">
        inline: true
      </Link>
      <Link inline={false} href="#">
        inline: false
      </Link>
      <br />
      <Link muted={true} inline={true} href="#">
        inline: true, muted: true
      </Link>
    </div>
  </div>
)
