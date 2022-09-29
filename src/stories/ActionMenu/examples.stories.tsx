import React from 'react'
import {Meta} from '@storybook/react'
import {ThemeProvider, BaseStyles, Box, Text, Avatar, ActionMenu, ActionList} from '../..'
import {
  GearIcon,
  MilestoneIcon,
  CalendarIcon,
  IterationsIcon,
  NumberIcon,
  SingleSelectIcon,
  TypographyIcon,
  IssueOpenedIcon,
  TableIcon,
  PeopleIcon,
  XIcon
} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Components/ActionMenu/examples',
  component: ActionMenu,
  decorators: [
    (Story: React.ComponentType<React.PropsWithChildren<unknown>>): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    )
  ],
  parameters: {
    controls: {
      disabled: true
    }
  }
}
export default meta

export function MenuWithActions(): JSX.Element {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  return (
    <>
      <h1>Simple Menu</h1>
      <h2>Last option activated: {actionFired}</h2>
      <ActionMenu>
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item onSelect={() => onSelect('Copy link')}>
              Copy link
              <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item onSelect={() => onSelect('Quote reply')}>
              Quote reply
              <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item onSelect={() => onSelect('Edit comment')}>
              Edit comment
              <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item variant="danger" onSelect={() => onSelect('Delete file')}>
              Delete file
              <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

const fieldTypes = [
  {icon: TypographyIcon, name: 'Text'},
  {icon: NumberIcon, name: 'Number'},
  {icon: CalendarIcon, name: 'Date'},
  {icon: SingleSelectIcon, name: 'Single select'},
  {icon: IterationsIcon, name: 'Iteration'}
]

export function SingleSelection(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const selectedType = fieldTypes[selectedIndex]
  return (
    <>
      <h1>Single Selection</h1>

      <p>This pattern has a single section with the selected value shown in the button</p>

      <ActionMenu>
        <ActionMenu.Button aria-label="Field type" leadingIcon={selectedType.icon}>
          {selectedType.name}
        </ActionMenu.Button>
        <ActionMenu.Overlay width="medium">
          <ActionList selectionVariant="single">
            {fieldTypes.map((type, index) => (
              <ActionList.Item
                key={index}
                selected={index === selectedIndex}
                onSelect={() => setSelectedIndex(index)}
                disabled={index === 3}
              >
                <type.icon /> {type.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

export function SingleSelectionWithPlaceholder(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const selectedType = fieldTypes[selectedIndex] || {}

  return (
    <>
      <h1>With placeholder</h1>

      <p>This pattern has a placeholder in menu button when no value is selected yet</p>

      <ActionMenu>
        <ActionMenu.Button aria-label="Field type" leadingIcon={selectedType.icon}>
          {selectedType.name || 'Pick a field type'}
        </ActionMenu.Button>
        <ActionMenu.Overlay width="medium">
          <ActionList selectionVariant="single">
            {fieldTypes.map((type, index) => (
              <ActionList.Item key={index} selected={index === selectedIndex} onSelect={() => setSelectedIndex(index)}>
                <type.icon /> {type.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

const milestones = [
  {name: 'FY21 - Q2', due: 'December 31, 2021', progress: 90},
  {name: 'FY22 - Q3', due: 'March 31, 2022', progress: 10},
  {name: 'FY23 - Q1', due: 'June 30, 2022', progress: 0},
  {name: 'FY23 - Q2', due: 'December 30, 2022', progress: 0}
]

export function GroupsAndDescription(): JSX.Element {
  const [selectedMilestone, setSelectedMilestone] = React.useState<typeof milestones[0] | undefined>()

  return (
    <>
      <h1>Milestone selector</h1>
      <Box sx={{width: 200}}>
        <ActionMenu>
          <ActionMenu.Button
            aria-label="Milestone"
            aria-describedby="selected-milestone"
            variant="invisible"
            trailingIcon={GearIcon}
            sx={{
              color: 'fg.muted',
              width: '100%',
              paddingX: 0,
              gridTemplateColumns: 'min-content 1fr min-content',
              textAlign: 'left',
              ':hover, :focus, &[aria-expanded=true]': {background: 'none !important', color: 'accent.fg'}
            }}
          >
            Milestone
          </ActionMenu.Button>
          <ActionMenu.Overlay width="medium">
            <ActionList selectionVariant="single" showDividers>
              <ActionList.Group title="Open">
                {milestones
                  .filter(milestone => !milestone.name.includes('21'))
                  .map((milestone, index) => (
                    <ActionList.Item
                      key={index}
                      selected={milestone.name === selectedMilestone?.name}
                      onSelect={() => setSelectedMilestone(milestone)}
                    >
                      <ActionList.LeadingVisual>
                        <MilestoneIcon />
                      </ActionList.LeadingVisual>
                      {milestone.name}
                      <ActionList.Description variant="block">Due by {milestone.due}</ActionList.Description>
                    </ActionList.Item>
                  ))}
              </ActionList.Group>
              <ActionList.Group title="Closed">
                {milestones
                  .filter(milestone => milestone.name.includes('21'))
                  .map((milestone, index) => (
                    <ActionList.Item
                      key={index}
                      selected={milestone.name === selectedMilestone?.name}
                      onSelect={() => setSelectedMilestone(milestone)}
                    >
                      <ActionList.LeadingVisual>
                        <MilestoneIcon />
                      </ActionList.LeadingVisual>
                      {milestone.name}
                      <ActionList.Description variant="block">Due by {milestone.due}</ActionList.Description>
                    </ActionList.Item>
                  ))}
              </ActionList.Group>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
        {selectedMilestone ? (
          <Text as="div" id="selected-milestone" color="fg.muted" sx={{fontSize: 1, mt: 2}}>
            {selectedMilestone.name}
          </Text>
        ) : (
          <Text as="div" id="selected-milestone" color="fg.muted" sx={{fontSize: 1, mt: 2}}>
            No milestone
          </Text>
        )}
      </Box>
    </>
  )
}

const users = [
  {login: 'pksjce', name: 'Pavithra Kodmad'},
  {login: 'jfuchs', name: 'Jonathan Fuchs'},
  {login: 'colebemis', name: 'Cole Bemis'},
  {login: 'mperrotti', name: 'Mike Perrotti'},
  {login: 'dgreif', name: 'Dusty Greif'},
  {login: 'smockle', name: 'Clay Miller'},
  {login: 'siddharthkp', name: 'Siddharth Kshetrapal'}
]

export function MultipleSelection(): JSX.Element {
  const [assignees, setAssignees] = React.useState(users.slice(0, 2))

  const toggleAssignee = (assignee: typeof users[number]) => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <>
      <h1>Multi Select List</h1>

      <p>ActionMenu with multiple selection is not seen in production. You see SelectPanel used instead.</p>

      <Box sx={{width: 200}}>
        <ActionMenu>
          <ActionMenu.Button
            aria-label="Assignees"
            variant="invisible"
            trailingIcon={GearIcon}
            sx={{
              color: 'fg.muted',
              width: '100%',
              paddingX: 0,
              gridTemplateColumns: 'min-content 1fr min-content',
              textAlign: 'left',
              ':hover, :focus, &[aria-expanded=true]': {background: 'none !important', color: 'accent.fg'}
            }}
          >
            Assignees
          </ActionMenu.Button>
          <ActionMenu.Overlay>
            <ActionList selectionVariant="multiple" showDividers>
              {users.map(user => (
                <ActionList.Item
                  key={user.login}
                  selected={Boolean(assignees.find(assignee => assignee.login === user.login))}
                  onSelect={() => toggleAssignee(user)}
                >
                  <ActionList.LeadingVisual>
                    <Avatar src={`https://github.com/${user.login}.png`} />
                  </ActionList.LeadingVisual>
                  {user.login}
                  <ActionList.Description>{user.name}</ActionList.Description>
                </ActionList.Item>
              ))}
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Box>
    </>
  )
}

export function MixedSelection(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  const options = [
    {text: 'Status', icon: IssueOpenedIcon},
    {text: 'Stage', icon: TableIcon},
    {text: 'Assignee', icon: PeopleIcon},
    {text: 'Team', icon: TypographyIcon},
    {text: 'Estimate', icon: NumberIcon},
    {text: 'Due Date', icon: CalendarIcon}
  ]

  const selectedOption = selectedIndex !== null && options[selectedIndex]

  return (
    <>
      <h1>List with mixed selection</h1>

      <p>
        In this list, there is a ActionList.Group with single selection for picking one option, followed by a Item that
        is an action. This pattern appears inside a ActionMenu for selection view options in Memex
      </p>

      <ActionMenu>
        <ActionMenu.Button aria-label="Group by" leadingIcon={selectedOption && selectedOption.icon}>
          {selectedOption ? `Group by ${selectedOption.text}` : 'Group items by'}
        </ActionMenu.Button>
        <ActionMenu.Overlay width="medium">
          <ActionList>
            <ActionList.Group selectionVariant="single" title="Group by">
              {options.map((option, index) => (
                <ActionList.Item
                  key={index}
                  selected={index === selectedIndex}
                  onSelect={() => setSelectedIndex(index)}
                >
                  <ActionList.LeadingVisual>
                    <option.icon />
                  </ActionList.LeadingVisual>
                  {option.text}
                </ActionList.Item>
              ))}
            </ActionList.Group>
            {typeof selectedIndex === 'number' && (
              <ActionList.Group>
                <ActionList.Divider />
                <ActionList.Item onSelect={() => setSelectedIndex(null)}>
                  <ActionList.LeadingVisual>
                    <XIcon />
                  </ActionList.LeadingVisual>
                  Clear Group by
                </ActionList.Item>
              </ActionList.Group>
            )}
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}
