import React from 'react'
import {Meta} from '@storybook/react'
import {ThemeProvider} from '../..'
import BaseStyles from '../../BaseStyles'
import {DropdownMenu} from '../../DropdownMenu2'
import {ActionList} from '../../ActionList2'
import Box from '../../Box'
import Text from '../../Text'
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
  title: 'Composite components/DropdownMenu2/examples',
  component: DropdownMenu,
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
      disabled: true
    }
  }
}
export default meta

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
      <h1>Simple Dropdown Menu</h1>

      <p>This pattern is the classic dropdown menu - single section with the selected value shown in the button</p>

      <DropdownMenu>
        <DropdownMenu.Button aria-label="Select field type" leadingIcon={selectedType.icon}>
          {selectedType.name}
        </DropdownMenu.Button>
        <DropdownMenu.Overlay width="medium">
          <ActionList>
            {fieldTypes.map((type, index) => (
              <ActionList.Item key={index} selected={index === selectedIndex} onSelect={() => setSelectedIndex(index)}>
                <type.icon /> {type.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </DropdownMenu.Overlay>
      </DropdownMenu>
    </>
  )
}

export function WithPlaceholder(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const selectedType = fieldTypes[selectedIndex] || {}

  return (
    <>
      <h1>With placeholder</h1>

      <p>This pattern is the starting state of the dropdown menu with a placeholder when there is default value</p>

      <DropdownMenu>
        <DropdownMenu.Button aria-label="Select field type" leadingIcon={selectedType.icon}>
          {selectedType.name || 'Pick a field type'}
        </DropdownMenu.Button>
        <DropdownMenu.Overlay width="medium">
          <ActionList>
            {fieldTypes.map((type, index) => (
              <ActionList.Item key={index} selected={index === selectedIndex} onSelect={() => setSelectedIndex(index)}>
                <type.icon /> {type.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </DropdownMenu.Overlay>
      </DropdownMenu>
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
        <DropdownMenu>
          <DropdownMenu.Button
            aria-label="Select a milestone"
            variant="invisible"
            trailingIcon={GearIcon}
            sx={{
              color: 'fg.muted',
              width: '100%',
              paddingX: 0,
              gridTemplateColumns: 'min-content 1fr min-content',
              textAlign: 'left',
              ':hover, :focus': {background: 'none !important', color: 'accent.fg'}
            }}
          >
            Milestone
          </DropdownMenu.Button>
          <DropdownMenu.Overlay width="medium">
            <ActionList showDividers role="none">
              <ActionList.Group title="Open" role="menu">
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
              <ActionList.Group title="Closed" role="menu">
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
          </DropdownMenu.Overlay>
        </DropdownMenu>
        {selectedMilestone ? (
          <Text as="div" color="fg.muted" sx={{fontSize: 1, mt: 2}}>
            {selectedMilestone.name}
          </Text>
        ) : (
          <Text as="div" color="fg.muted" sx={{fontSize: 1, mt: 2}}>
            No milestone
          </Text>
        )}
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

  const selectedOption = selectedIndex && options[selectedIndex]

  return (
    <>
      <h1>List with mixed selection</h1>

      <p>
        In this list, there is a ActionList.Group with single selection for picking one option, followed by a Item that
        is an action. This pattern appears inside a DropdownMenu for selection view options in Memex
      </p>

      <DropdownMenu>
        <DropdownMenu.Button aria-label="Select field type" leadingIcon={selectedOption && selectedOption.icon}>
          {selectedOption ? `Group by ${selectedOption.text}` : 'Group items by'}
        </DropdownMenu.Button>
        <DropdownMenu.Overlay width="medium">
          <ActionList role="none">
            <ActionList.Group title="Group by" role="menu">
              {options.map((option, index) => (
                <ActionList.Item
                  key={index}
                  selected={index === selectedIndex}
                  onSelect={() => setSelectedIndex(index)}
                >
                  <ActionList.LeadingVisual>{option.icon}</ActionList.LeadingVisual>
                  {option.text}
                </ActionList.Item>
              ))}
            </ActionList.Group>
            {typeof selectedIndex === 'number' && (
              <ActionList.Group role="menu">
                <ActionList.Divider />
                <ActionList.Item onSelect={() => setSelectedIndex(null)} role="menuitem">
                  <ActionList.LeadingVisual>
                    <XIcon />
                  </ActionList.LeadingVisual>
                  Clear Group by
                </ActionList.Item>
              </ActionList.Group>
            )}
          </ActionList>
        </DropdownMenu.Overlay>
      </DropdownMenu>
    </>
  )
}
