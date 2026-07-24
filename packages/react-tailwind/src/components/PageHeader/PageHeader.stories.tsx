import type {Meta, StoryObj} from '@storybook/react-vite'
import {PageHeader} from './PageHeader'

const meta = {
  title: 'Layout/PageHeader',
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
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {hasBorder: true}}
export const WithNavigation: StoryObj<typeof meta> = {
  render: () => (
    <PageHeader>
      <PageHeader.TitleArea>
        <PageHeader.Title>Repository</PageHeader.Title>
      </PageHeader.TitleArea>
      <PageHeader.Navigation as="nav" aria-label="Repository">
        <a href="/">Code</a>
      </PageHeader.Navigation>
    </PageHeader>
  ),
}
