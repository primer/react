import {Meta} from '@storybook/react'
import React from 'react'
import {LawIcon, StarIcon, RepoForkedIcon, BookIcon, EyeIcon} from '@primer/octicons-react'
import {ThemeProvider} from '../..'
import {ActionList as _ActionList} from '../../ActionList2'
import {Header} from '../../ActionList/Header'
import BaseStyles from '../../BaseStyles'

const ActionList = Object.assign(_ActionList, {
  Header
})

const meta: Meta = {
  title: 'Composite components/ActionList2/examples',
  component: ActionList,
  decorators: [
    (Story: React.ComponentType): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    )
  ],
  parameters: {
    controls: {
      disable: true
    }
  }
}
export default meta

export function WithLinks(): JSX.Element {
  return (
    <>
      <h1>With Links</h1>

      <p>This pattern can be seen in the repository sidebar, containing a list of links</p>

      <ActionList>
        <ActionList.LinkItem href="https://github.com/primer/react#readme">
          <ActionList.LeadingVisual>
            <BookIcon />
          </ActionList.LeadingVisual>
          Readme
        </ActionList.LinkItem>
        <ActionList.LinkItem href="https://github.com/primer/react/blob/main/LICENSE">
          <ActionList.LeadingVisual>
            <LawIcon />
          </ActionList.LeadingVisual>
          MIT License
        </ActionList.LinkItem>
        <ActionList.LinkItem href="https://github.com/primer/react/stargazers">
          <ActionList.LeadingVisual>
            <StarIcon />
          </ActionList.LeadingVisual>
          <strong>1.5k</strong> stars
        </ActionList.LinkItem>
        <ActionList.LinkItem href="https://github.com/primer/react/watchers">
          <ActionList.LeadingVisual>
            <EyeIcon />
          </ActionList.LeadingVisual>
          <strong>21</strong> watching
        </ActionList.LinkItem>
        <ActionList.LinkItem href="https://github.com/primer/react/network/members">
          <ActionList.LeadingVisual>
            <RepoForkedIcon />
          </ActionList.LeadingVisual>
          <strong>225</strong> forks
        </ActionList.LinkItem>
      </ActionList>
    </>
  )
}
