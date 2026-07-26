import type {Meta, StoryObj} from '@storybook/react-vite'
import {Hidden} from './Hidden'
import {Button} from '../Button'

const meta = {
  title: 'React Tailwind/Components/Hidden/Features',
  component: Hidden,
  args: {children: 'Hidden content', when: 'narrow'},
} satisfies Meta<typeof Hidden>
export default meta
type Story = StoryObj<typeof meta>

export const HideContent: Story = {
  render: () => (
    <div>
      <Hidden when="narrow"> This value is shown in regular and wide viewports</Hidden>
      <Hidden when="regular"> This value is shown in narrow and wide viewports</Hidden>
      <Hidden when="wide"> This value is shown in narrow and regular viewports</Hidden>
    </div>
  ),
}
export const RenderContentResponsively: Story = {
  render: () => (
    <div>
      <Hidden when="narrow">
        <Button variant="primary">I am visible when the viewport is regular or wide viewport</Button>
      </Hidden>

      <Hidden when={['regular', 'wide']}>
        <Button variant="primary">I am visible when the viewport is narrow</Button>
      </Hidden>
    </div>
  ),
}
