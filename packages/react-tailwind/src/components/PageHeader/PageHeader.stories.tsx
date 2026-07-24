import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './PageHeader'

const meta = {
  title: 'React Tailwind/Layout/PageHeader',
  component: PageHeader,
  render: args => (
    <PageHeader {...args}>
      <PageHeader.TitleArea>
        <PageHeader.Title as="h1">Settings</PageHeader.Title>
      </PageHeader.TitleArea>
    </PageHeader>
  ),
} satisfies Meta<typeof PageHeader>
export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Playground: Story = {args: {hasBorder: true}}
export const WithNavigation: Story = {
  render: () => (
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Repository</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Navigation as="nav" aria-label="Repository">
        <a className="text-accent" href="/">
          Code
        </a>
      </PageHeader.Navigation>
    </PageHeader>
  ),
}
