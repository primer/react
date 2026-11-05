import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './PageHeader'

const meta = {
  title: 'React Tailwind/Layout/PageHeader/Responsive Variants',
  component: PageHeader,
  parameters: {layout: 'fullscreen', controls: {expanded: true}},
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Test responsive size variants on TitleArea.
 * Resize the viewport to see different title sizes at different breakpoints.
 */
export const TitleAreaSizeResponsive: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.TitleArea variant={{narrow: 'subtitle', regular: 'medium', wide: 'large'}}>
        <PageHeader.Title>Title variant: subtitle (narrow) → medium (regular) → large (wide)</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The title size changes based on viewport width: **subtitle** on narrow viewports, **medium** on regular viewports, and **large** on wide viewports.',
      },
    },
  },
}
