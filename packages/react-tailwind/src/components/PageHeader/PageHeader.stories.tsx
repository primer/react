import {GitBranchIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {IconButton} from '../IconButton'
import {PageHeader} from './PageHeader'

const meta = {
  title: 'React Tailwind/Layout/PageHeader',
  component: PageHeader,
  parameters: {layout: 'fullscreen', controls: {expanded: true}},
  argTypes: {
    as: {control: 'select', options: ['div', 'header', 'section']},
    hasBorder: {control: 'boolean'},
  },
} satisfies Meta<typeof PageHeader>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-4">
      <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
          <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
    </div>
  ),
}

export const Playground: Story = {
  args: {as: 'div', hasBorder: false},
  render: args => (
    <div className="p-4">
      <PageHeader {...args} role="banner" aria-label="Branches">
        <PageHeader.TitleArea>
          <PageHeader.LeadingVisual hidden>
            <GitBranchIcon />
          </PageHeader.LeadingVisual>
          <PageHeader.Title as="h2">Branches</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Actions hidden>
          <IconButton aria-label="More" icon={GitBranchIcon} />
        </PageHeader.Actions>
      </PageHeader>
    </div>
  ),
}
