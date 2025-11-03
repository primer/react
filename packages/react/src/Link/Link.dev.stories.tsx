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
      [data-a11y-link-underlines=true] (inline always underlines)
      <Link href="#">inline: undefined, underline: undefined</Link>
      <Link underline={true} href="#">
        inline: undefined, underline: true
      </Link>
      <Link underline={false} href="#">
        inline: undefined, underline: false
      </Link>
      <br />
      <Link inline={true} href="#">
        inline: true, underline: undefined
      </Link>
      <Link inline={false} href="#">
        inline: false, underline: undefined
      </Link>
      <br />
      <Link inline={true} underline={true} href="#">
        inline: true, underline: true
      </Link>
      <Link inline={true} underline={false} href="#">
        inline: true, underline: false
      </Link>
      <Link inline={false} underline={true} href="#">
        inline: false, underline: true
      </Link>
      <Link inline={false} underline={false} href="#">
        inline: false, underline: false
      </Link>
      <br />
      <Link muted={true} inline={true} href="#">
        inline: true, muted: true
      </Link>
    </div>
    <br />
    <div style={{display: 'flex', flexDirection: 'column'}} data-a11y-link-underlines="false">
      [data-a11y-link-underlines=false] (inline does nothing)
      <Link href="#">inline: undefined, underline: undefined</Link>
      <Link underline={true} href="#">
        inline: undefined, underline: true
      </Link>
      <Link underline={false} href="#">
        inline: undefined, underline: false
      </Link>
      <br />
      <Link inline={true} href="#">
        inline: true, underline: undefined
      </Link>
      <Link inline={false} href="#">
        inline: false, underline: undefined
      </Link>
      <br />
      <Link inline={true} underline={true} href="#">
        inline: true, underline: true
      </Link>
      <Link inline={true} underline={false} href="#">
        inline: true, underline: false
      </Link>
      <Link inline={false} underline={true} href="#">
        inline: false, underline: true
      </Link>
      <Link inline={false} underline={false} href="#">
        inline: false, underline: false
      </Link>
      <br />
      <Link muted={true} inline={true} href="#">
        inline: true, muted: true
      </Link>
    </div>
  </div>
)
