import React from 'react'
import {Meta} from '@storybook/react'
import {ThemeProvider} from '..'
import BaseStyles from '../BaseStyles'
import {DropdownMenu} from '../DropdownMenu2'
import {ActionList} from '../ActionList2'
import {NewButton as Button} from '../NewButton'
import Box from '../Box'
import Text from '../Text'
import TextInput from '../TextInput'
import ProgressBar from '../ProgressBar'
import {
  GearIcon,
  MilestoneIcon,
  CalendarIcon,
  IterationsIcon,
  NumberIcon,
  SingleSelectIcon,
  TypographyIcon
} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Composite components/DropdownMenu2',
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

export function SimpleDropdownMenu(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const selectedType = fieldTypes[selectedIndex]

  return (
    <>
      <h1>Simple Dropdown Menu</h1>

      <DropdownMenu>
        <DropdownMenu.Button aria-label="Select field type" leadingIcon={selectedType.icon}>
          {selectedType.name}
        </DropdownMenu.Button>
        <DropdownMenu.Overlay width="medium">
          <ActionList selectionVariant="single">
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
SimpleDropdownMenu.storyName = 'Simple DropdownMenu'

export function MemexIteration(): JSX.Element {
  const [duration, setDuration] = React.useState(1)

  return (
    <>
      <h1>Simple DropdownMenu</h1>

      <DropdownMenu>
        <DropdownMenu.Button
          variant="invisible"
          sx={{
            fontWeight: 'normal',
            color: 'fg.muted',
            ':hover, :focus': {background: 'none !important', color: 'accent.fg'}
          }}
          aria-label="Select iteration duration"
        >
          {duration} {duration > 1 ? 'weeks' : 'week'}
        </DropdownMenu.Button>
        <DropdownMenu.Overlay width="medium">
          <ActionList selectionVariant="single">
            {[1, 2, 3, 4, 5, 6].map(weeks => (
              <ActionList.Item key={weeks} selected={duration === weeks} onSelect={() => setDuration(weeks)}>
                {weeks} {weeks > 1 ? 'weeks' : 'week'}
              </ActionList.Item>
            ))}
          </ActionList>
        </DropdownMenu.Overlay>
      </DropdownMenu>
    </>
  )
}
MemexIteration.storyName = 'Memex Iteration'

const milestones = [
  {name: 'v29.2.0', due: 'September 30, 2021', progress: 95},
  {name: 'v30.0.0', due: 'December 1, 2021', progress: 40},
  {name: 'FY22 - Q3', due: 'December 31, 2021', progress: 10}
]

export function SingleSelectListStory(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  const selectedMilestone = milestones[selectedIndex]

  return (
    <>
      <h1>Single Select List</h1>
      <Box sx={{width: 200}}>
        <DropdownMenu>
          <DropdownMenu.Anchor aria-label="Select a project">
            <DropdownMenu.Anchor>
              <Button
                aria-label="Select iteration duration"
                variant="invisible"
                trailingIcon={GearIcon}
                sx={{
                  color: 'fg.muted',
                  ':hover, :focus': {background: 'none !important', color: 'accent.fg'},
                  width: '100%',
                  textAlign: 'left',
                  paddingX: 0
                }}
              >
                Milestone
              </Button>
            </DropdownMenu.Anchor>
          </DropdownMenu.Anchor>
          <DropdownMenu.Overlay width="medium">
            <ActionList selectionVariant="single" showDividers>
              {milestones.map((milestone, index) => (
                <ActionList.Item
                  key={index}
                  selected={index === selectedIndex}
                  onSelect={() => setSelectedIndex(index)}
                >
                  <ActionList.LeadingVisual>
                    <MilestoneIcon />
                  </ActionList.LeadingVisual>
                  {milestone.name}
                  <ActionList.Description variant="block">Due by {milestone.due}</ActionList.Description>
                </ActionList.Item>
              ))}
            </ActionList>
          </DropdownMenu.Overlay>
        </DropdownMenu>
        {selectedMilestone ? (
          <Text as="div" color="fg.muted" sx={{fontSize: 1, mt: 2}}>
            <ProgressBar progress={selectedMilestone.progress} sx={{mb: 2}} />
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
SingleSelectListStory.storyName = 'Single Select'

export function MemexAddColumn(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const selectedType = fieldTypes[selectedIndex]

  const [duration, setDuration] = React.useState(1)

  return (
    <>
      <h1>Memex Add column</h1>

      <Box as="form" sx={{display: 'flex', flexDirection: 'column', width: 200}}>
        <TextInput defaultValue="Estimate" aria-label="Field Name" sx={{mb: 2}} />
        <DropdownMenu>
          <DropdownMenu.Button aria-label="Select field type" leadingIcon={selectedType.icon}>
            {selectedType.name}
          </DropdownMenu.Button>
          <DropdownMenu.Overlay width="medium">
            <ActionList selectionVariant="single">
              {fieldTypes.map((type, index) => (
                <ActionList.Item
                  key={index}
                  selected={index === selectedIndex}
                  onSelect={() => setSelectedIndex(index)}
                >
                  {type.icon} {type.name}
                </ActionList.Item>
              ))}
            </ActionList>
          </DropdownMenu.Overlay>
        </DropdownMenu>
        <Text sx={{fontSize: 0, color: 'fg.muted', mt: 3, mb: 1}}>Options</Text>

        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Text sx={{fontSize: 1}}>Duration:</Text>
          <DropdownMenu>
            <DropdownMenu.Button
              id="duration"
              aria-label="Select field type"
              sx={{textAlign: 'left', ml: 2, flexGrow: 1}}
            >
              {duration} {duration > 1 ? 'weeks' : 'week'}
            </DropdownMenu.Button>
            <DropdownMenu.Overlay width="medium">
              <ActionList selectionVariant="single">
                {[1, 2, 3, 4, 5, 6].map(weeks => (
                  <ActionList.Item key={weeks} selected={duration === weeks} onSelect={() => setDuration(weeks)}>
                    {weeks} {weeks > 1 ? 'weeks' : 'week'}
                  </ActionList.Item>
                ))}
              </ActionList>
            </DropdownMenu.Overlay>
          </DropdownMenu>
        </Box>
      </Box>
    </>
  )
}
MemexAddColumn.storyName = 'Memex Add Column'
