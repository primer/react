import type {Meta, StoryObj} from '@storybook/react-vite'
import {Link} from '../Link'
import {PageLayout} from '../PageLayout'
import {Banner} from './index'
const meta = {
  title: 'React Tailwind/Content/Banner',
  component: Banner,
  args: {
    title: 'Info',
    description: (
      <>
        GitHub users are{' '}
        <Link inline href="#">
          now required
        </Link>{' '}
        to enable two-factor authentication as an additional security measure.
      </>
    ),
  },
} satisfies Meta<typeof Banner>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: {
    onDismiss: () => {},
    primaryAction: <Banner.PrimaryAction>Button</Banner.PrimaryAction>,
    secondaryAction: <Banner.SecondaryAction>Button</Banner.SecondaryAction>,
  },
}
export const Playground: Story = {
  render: args => (
    <PageLayout>
      <PageLayout.Pane divider="line" position="start">
        <Banner aria-label="Pane level banner" {...args} />
      </PageLayout.Pane>
      <PageLayout.Content>
        <Banner aria-label="Content level banner" {...args} />
      </PageLayout.Content>
    </PageLayout>
  ),
  args: {
    title: 'Banner title',
    description: 'GitHub users are now required to enable two-factor authentication as an additional security measure.',
    variant: 'info',
  },
}
