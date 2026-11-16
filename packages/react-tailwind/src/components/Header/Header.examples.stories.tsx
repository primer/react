import {MarkGithubIcon, SearchIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Header} from './Header'

const meta = {title: 'React Tailwind/Layout/Header/Examples', component: Header} satisfies Meta<typeof Header>
export default meta
type Story = StoryObj<typeof meta>

export const RepositoryHeader: Story = {
  render: () => (
    <Header>
      <Header.Item>
        <Header.Link href="#" aria-label="GitHub home">
          <MarkGithubIcon size={32} />
        </Header.Link>
      </Header.Item>
      <Header.Item full>
        <Header.Link href="#">octo-org/design-system</Header.Link>
      </Header.Item>
      <Header.Item>
        <Header.Link href="#" aria-label="Search repositories">
          <SearchIcon />
        </Header.Link>
      </Header.Item>
      <Header.Item>
        <Header.Link href="#">Sign in</Header.Link>
      </Header.Item>
    </Header>
  ),
}
