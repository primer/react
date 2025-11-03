import Link from '../Link'
import type {Meta, StoryFn} from '@storybook/react-vite'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Components/Link',
  component: Link,
} as Meta<ComponentProps<typeof Link> & {text: string}>

export const Playground: StoryFn<ComponentProps<typeof Link> & {text: string}> = ({text, ...args}) => (
  <Link {...args}>{text}</Link>
)

Playground.args = {
  text: 'Link',
  href: '#',
  muted: false,
  underline: false,
  inline: false,
}

export const Default = () => <Link href="#">Links are great</Link>
