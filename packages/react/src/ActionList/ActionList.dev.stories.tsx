import React from 'react'
import type {Meta} from '@storybook/react'
import {ActionList} from '.'
import {Item} from './Item'
import {LinkItem} from './LinkItem'
import {Group} from './Group'
import {Divider} from './Divider'
import {Description} from './Description'
import Avatar from '../Avatar'

export default {
  title: 'Components/ActionList/Dev',
  component: ActionList,
  subcomponents: {Item, LinkItem, Group, Divider, Description},
} as Meta<typeof ActionList>

const users = [
  {login: 'pksjce', name: 'Pavithra Kodmad'},
  {login: 'jfuchs', name: 'Jonathan Fuchs'},
  {login: 'colebemis', name: 'Cole Bemis'},
  {login: 'mperrotti', name: 'Mike Perrotti'},
  {login: 'dgreif', name: 'Dusty Greif'},
  {login: 'smockle', name: 'Clay Miller'},
  {login: 'siddharthkp', name: 'Siddharth Kshetrapal'},
]

export const GroupWithSubtleTitleOldAPI = () => {
  const [assignees, setAssignees] = React.useState(users.slice(0, 1))

  const toggleAssignee = (assignee: (typeof users)[number]) => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <>
      <p>
        This is only for regression tests. It is not the recommended API for group headings. Please see the stories
        under features.
      </p>
      <ActionList selectionVariant="multiple" role="menu" showDividers aria-label="Reviewers">
        {/* eslint-disable-next-line primer-react/no-deprecated-props */}
        <ActionList.Group title="Everyone">
          {users.slice(2).map(user => (
            <ActionList.Item
              role="menuitemcheckbox"
              key={user.login}
              selected={Boolean(assignees.find(assignee => assignee.login === user.login))}
              aria-checked={Boolean(assignees.find(assignee => assignee.login === user.login))}
              onSelect={() => toggleAssignee(user)}
            >
              <ActionList.LeadingVisual>
                <Avatar src={`https://github.com/${user.login}.png`} />
              </ActionList.LeadingVisual>
              {user.login}
              <ActionList.Description>{user.name}</ActionList.Description>
            </ActionList.Item>
          ))}
        </ActionList.Group>
      </ActionList>
    </>
  )
}

export const GroupWithFilledTitleOldAPI = () => {
  const [assignees, setAssignees] = React.useState(users.slice(0, 1))

  const toggleAssignee = (assignee: (typeof users)[number]) => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <>
      <p>
        This is only for regression tests. It is not the recommended API for group headings. Please see the stories
        under features.
      </p>
      <ActionList selectionVariant="multiple" role="menu" showDividers aria-label="Reviewers">
        {/* eslint-disable-next-line primer-react/no-deprecated-props */}
        <ActionList.Group title="Everyone" variant="filled">
          {users.slice(2).map(user => (
            <ActionList.Item
              role="menuitemcheckbox"
              key={user.login}
              selected={Boolean(assignees.find(assignee => assignee.login === user.login))}
              aria-checked={Boolean(assignees.find(assignee => assignee.login === user.login))}
              onSelect={() => toggleAssignee(user)}
            >
              <ActionList.LeadingVisual>
                <Avatar src={`https://github.com/${user.login}.png`} />
              </ActionList.LeadingVisual>
              {user.login}
              <ActionList.Description>{user.name}</ActionList.Description>
            </ActionList.Item>
          ))}
        </ActionList.Group>
      </ActionList>
    </>
  )
}
