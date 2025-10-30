import React from 'react'
import type {Meta} from '@storybook/react-vite'
import {ActionList} from '.'
import {Item} from './Item'
import {LinkItem} from './LinkItem'
import {Group} from './Group'
import {Divider} from './Divider'
import {Description} from './Description'
import Avatar from '../Avatar'
import {FileDirectoryIcon, HeartFillIcon} from '@primer/octicons-react'
import {Stack} from '../Stack'
import {AnchoredOverlay} from '../AnchoredOverlay'

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

export const GroupHeadingCustomClassname = () => (
  <ActionList>
    <ActionList.Heading as="h2">Filter by</ActionList.Heading>
    <ActionList.Group>
      <ActionList.GroupHeading className="testCustomClassnameColor" as="h3">
        Repositories
      </ActionList.GroupHeading>
      <ActionList.Item onSelect={() => {}}>app/assets/modules</ActionList.Item>
      <ActionList.Item onSelect={() => {}}>src/react/components</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)

export const ListCustomClassname = () => (
  <ActionList className="testCustomClassnameBorder">
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Quote reply</ActionList.Item>
  </ActionList>
)

export const DividerCustomClassname = () => (
  <ActionList>
    <ActionList.Item>Edit comment</ActionList.Item>
    <ActionList.Divider className="testCustomClassnameBgColor" />
    <ActionList.Item>Quote reply</ActionList.Item>
  </ActionList>
)

export const HeadingCustomClassname = () => (
  <ActionList>
    <ActionList.Heading className="testCustomClassnameColor" as="h2">
      Filter by
    </ActionList.Heading>
    <ActionList.Group>
      <ActionList.GroupHeading as="h3">Repositories</ActionList.GroupHeading>
      <ActionList.Item onSelect={() => {}}>app/assets/modules</ActionList.Item>
      <ActionList.Item onSelect={() => {}}>src/react/components</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)

export const DescriptionCustomClassname = () => (
  <ActionList>
    <ActionList.Item>
      Label
      <ActionList.Description className="testCustomClassnameColor">This is a description</ActionList.Description>
    </ActionList.Item>
  </ActionList>
)

export const VisualCustomClassname = () => (
  <ActionList>
    <ActionList.Item>
      Label
      <ActionList.LeadingVisual className="testCustomClassnameColor">
        <FileDirectoryIcon />
      </ActionList.LeadingVisual>
      <ActionList.TrailingVisual className="testCustomClassnameColor">
        <HeartFillIcon />
      </ActionList.TrailingVisual>
    </ActionList.Item>
  </ActionList>
)

export const TrailingVisualGap = () => (
  <div style={{width: '300px'}}>
    <ActionList>
      <ActionList.Item>
        This story tests the gap between the label and trailing visual.
        <ActionList.LeadingVisual>
          <FileDirectoryIcon />
        </ActionList.LeadingVisual>
        <ActionList.TrailingVisual>
          <HeartFillIcon />
        </ActionList.TrailingVisual>
      </ActionList.Item>
    </ActionList>
  </div>
)

export const ItemLabelStylesWithMixedDescriptions = () => (
  <Stack>
    <Stack align="start" direction="horizontal">
      <Stack.Item style={{border: 'solid 1px var(--borderColor-default)', padding: '1rem'}}>
        <ActionList>
          <ActionList.Heading as="h2" size="small">
            Some items have inline description
          </ActionList.Heading>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description>Inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description>Inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>Item with no description</ActionList.Item>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description>Inline description</ActionList.Description>
          </ActionList.Item>
        </ActionList>
      </Stack.Item>
      <Stack.Item style={{border: 'solid 1px var(--borderColor-default)', padding: '1rem'}}>
        <ActionList>
          <ActionList.Heading as="h2" size="small">
            Some items have block description
          </ActionList.Heading>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>Item with no description</ActionList.Item>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
        </ActionList>
      </Stack.Item>
    </Stack>
    <Stack align="start" direction="horizontal">
      <Stack.Item style={{border: 'solid 1px var(--borderColor-default)', padding: '1rem'}}>
        <ActionList>
          <ActionList.Heading as="h2" size="small">
            Some items have inline description inside a group
          </ActionList.Heading>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description>Inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>Item with no description</ActionList.Item>
          <ActionList.Group>
            <ActionList.GroupHeading as="h3">This is a group</ActionList.GroupHeading>
            <ActionList.Item>
              Item with inline description
              <ActionList.Description>Inline description</ActionList.Description>
            </ActionList.Item>
            <ActionList.Item>Item with no description</ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </Stack.Item>
      <Stack.Item style={{border: 'solid 1px var(--borderColor-default)', padding: '1rem'}}>
        <ActionList>
          <ActionList.Heading as="h2" size="small">
            Some link items have block description
          </ActionList.Heading>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>Item with no description</ActionList.Item>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
        </ActionList>
      </Stack.Item>
    </Stack>
    <Stack align="start" direction="horizontal">
      <Stack.Item style={{border: 'solid 1px var(--borderColor-default)', padding: '1rem'}}>
        <ActionList>
          <ActionList.Heading as="h2" size="small">
            All items have descriptions
          </ActionList.Heading>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description>Inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            Item with inline description
            <ActionList.Description>Inline description</ActionList.Description>
          </ActionList.Item>
        </ActionList>
      </Stack.Item>
      <Stack.Item style={{border: 'solid 1px var(--borderColor-default)', padding: '1rem'}}>
        <ActionList>
          <ActionList.Heading as="h2" size="small">
            No items have descriptions
          </ActionList.Heading>
          <ActionList.Item>Item with no description</ActionList.Item>
          <ActionList.Item>Item with no description</ActionList.Item>
        </ActionList>
      </Stack.Item>
    </Stack>
  </Stack>
)

export const OverlayWrapping = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '100px'}}>
      <div style={{width: '300px', border: 'solid 1px gray'}}>
        <ActionList>
          <ActionList.Item>thisisalongemailaddress@longemail.com</ActionList.Item>
          <ActionList.Item>
            thisisalongemailaddress@longemail.com
            <ActionList.TrailingVisual>
              <HeartFillIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            thisisalongemailaddress@longemail.com
            <ActionList.LeadingVisual>
              <HeartFillIcon />
            </ActionList.LeadingVisual>
          </ActionList.Item>
          <ActionList.Item>This is a long item title long long long oh wow</ActionList.Item>
          <ActionList.Item>
            This is a long item title long long long oh wow
            <ActionList.TrailingVisual>
              <HeartFillIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </div>

      <div>
        <AnchoredOverlay
          open
          renderAnchor={props => (
            <button type="button" {...props}>
              Overlay
            </button>
          )}
        >
          <ActionList role="menu">
            <ActionList.Item role="menuitem">This menu should grow a bit</ActionList.Item>
          </ActionList>
        </AnchoredOverlay>
      </div>

      <div>
        <AnchoredOverlay
          open
          width="small"
          renderAnchor={props => (
            <button type="button" {...props}>
              Overlay
            </button>
          )}
        >
          <ActionList role="menu">
            <ActionList.Item role="menuitem">This menu should wrap because it has a small size</ActionList.Item>
            {/* <ActionList.Item role="menuitem">
            thisisalongemailaddress@longemail.com
            <ActionList.TrailingVisual>
              <HeartFillIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item> */}
            {/* <ActionList.Item role="menuitem">
            thisisalongemailaddress@longemail.com
            <ActionList.LeadingVisual>
              <HeartFillIcon />
            </ActionList.LeadingVisual>
          </ActionList.Item> */}
          </ActionList>
        </AnchoredOverlay>
      </div>
    </div>
  )
}
