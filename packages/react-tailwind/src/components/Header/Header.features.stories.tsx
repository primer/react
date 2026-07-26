import {MarkGithubIcon} from '@primer/octicons-react'
import {Avatar} from '../Avatar'
import {Header} from './Header'

export default {title: 'React Tailwind/Layout/Header/Features', component: Header}

export const WithFullSizeItem = {
  render: () => (
    <Header>
      <Header.Item>Item 1</Header.Item>
      <Header.Item full>Item 2</Header.Item>
      <Header.Item>Item 3</Header.Item>
    </Header>
  ),
}
export const WithLinks = {
  render: () => (
    <Header>
      <Header.Item>
        <Header.Link href="#">About</Header.Link>
      </Header.Item>
      <Header.Item>
        <Header.Link href="#">Releases</Header.Link>
      </Header.Item>
      <Header.Item>
        <Header.Link href="#">Team</Header.Link>
      </Header.Item>
    </Header>
  ),
}
export const WithManyItems = {
  render: () => (
    <Header>
      <Header.Item>
        <Header.Link className="text-body-large" href="#">
          <MarkGithubIcon className="mr-2" size={32} />
          <span>GitHub</span>
        </Header.Link>
      </Header.Item>
      {Array.from({length: 10}, (_, index) => (
        <Header.Item key={index}>Item</Header.Item>
      ))}
      <Header.Item className="mr-0">
        <Avatar src="https://github.com/octocat.png" size={20} square alt="@octocat" />
      </Header.Item>
    </Header>
  ),
}
