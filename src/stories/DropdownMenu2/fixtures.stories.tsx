import React from 'react'
import {Meta} from '@storybook/react'
import {ThemeProvider} from '../..'
import BaseStyles from '../../BaseStyles'
import {DropdownMenu} from '../../DropdownMenu2'
import {ActionList} from '../../ActionList2'
import {Button} from '../../Button2'
import Box from '../../Box'
import Text from '../../Text'
import TextInput from '../../TextInput'
import ProgressBar from '../../ProgressBar'
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
  title: 'Composite components/DropdownMenu2/fixtures',
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
SimpleDropdownMenu.storyName = 'Simple DropdownMenu'

export function Placeholder(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const selectedType = fieldTypes[selectedIndex] || {}

  return (
    <>
      <h1>With placeholder</h1>

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
Placeholder.storyName = 'Placeholder'

export function MemexIteration(): JSX.Element {
  const [duration, setDuration] = React.useState(1)

  return (
    <>
      <h1>Memex Iteration Menu</h1>

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
          <ActionList>
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
MemexIteration.storyName = 'Memex Iteration Menu'

const milestones = [
  {name: 'v29.2.0', due: 'September 30, 2021', progress: 95},
  {name: 'v30.0.0', due: 'December 1, 2021', progress: 40},
  {name: 'FY22 - Q3', due: 'December 31, 2021', progress: 10}
]

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
            <ActionList>
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
              <ActionList>
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

export function MilestoneStory(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  const selectedMilestone = milestones[selectedIndex] as typeof milestones[0] | undefined

  return (
    <>
      <h1>Milestone selector</h1>
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
                  width: '100%',
                  paddingX: 0,
                  gridTemplateColumns: 'min-content 1fr min-content',
                  textAlign: 'left',
                  ':hover, :focus': {background: 'none !important', color: 'accent.fg'}
                }}
              >
                Milestone
              </Button>
            </DropdownMenu.Anchor>
          </DropdownMenu.Anchor>
          <DropdownMenu.Overlay width="medium">
            <ActionList showDividers>
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
MilestoneStory.storyName = 'Milestone selector'

export function ControlledMenu(): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  return (
    <>
      <h1>Controlled Menu</h1>

      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <h2>selected Value: {fieldTypes[selectedIndex].name}</h2>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenu.Button onClick={() => setOpen(!open)}>{open ? 'Close Menu' : 'Open Menu'}</DropdownMenu.Button>
        <DropdownMenu.Overlay>
          <ActionList>
            {fieldTypes.map((type, index) => (
              <ActionList.Item key={index} selected={index === selectedIndex} onSelect={() => setSelectedIndex(index)}>
                {type.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </DropdownMenu.Overlay>
      </DropdownMenu>
    </>
  )
}
ControlledMenu.storyName = 'Controlled Menu'

export function ExternalAnchor(): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.createRef<HTMLButtonElement>()
  const anchorRef = React.createRef<HTMLDivElement>()

  const [selectedIndex, setSelectedIndex] = React.useState(0)

  return (
    <>
      <h1>External Anchor</h1>

      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <h2>selected Value: {fieldTypes[selectedIndex].name}</h2>

      <Button ref={triggerRef} onClick={() => setOpen(!open)}>
        {open ? 'Close Menu' : 'Open Menu'}
      </Button>

      <Box ref={anchorRef} sx={{backgroundColor: 'papayawhip', mt: 10, p: 4}}>
        Anchored on me!
      </Box>

      <DropdownMenu open={open} onOpenChange={setOpen} anchorRef={anchorRef}>
        <DropdownMenu.Overlay
          ignoreClickRefs={[
            // Because the component is controlled from a button but anchored elsewhere,
            // clicking the external button should not be counted as "clicking outside"
            triggerRef
          ]}
        >
          <ActionList>
            {fieldTypes.map((type, index) => (
              <ActionList.Item key={index} selected={index === selectedIndex} onSelect={() => setSelectedIndex(index)}>
                {type.name}
              </ActionList.Item>
            ))}
          </ActionList>
        </DropdownMenu.Overlay>
      </DropdownMenu>
    </>
  )
}
ExternalAnchor.storyName = 'External Anchor'
