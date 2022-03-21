import React from 'react'
import {Meta} from '@storybook/react'
import {
  ThemeProvider,
  BaseStyles,
  Box,
  Text,
  TextInput,
  StyledOcticon,
  FormControl,
  ActionMenu,
  ActionList,
  Button,
  IconButton
} from '../..'
import {
  ServerIcon,
  PlusCircleIcon,
  TriangleDownIcon,
  KebabHorizontalIcon,
  PencilIcon,
  ArchiveIcon,
  TrashIcon,
  ProjectIcon,
  ListUnorderedIcon,
  ArrowDownIcon,
  SearchIcon,
  VersionsIcon,
  TableIcon,
  CalendarIcon,
  IterationsIcon,
  NumberIcon,
  SingleSelectIcon,
  TypographyIcon,
  IconProps
} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Composite components/ActionMenu/fixtures',
  component: ActionMenu,
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

export function ActionsStory(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>

      <ActionMenu>
        <ActionMenu.Button aria-label="Open Actions Menu" trailingIcon={null}>
          <ServerIcon />
        </ActionMenu.Button>
        <ActionMenu.Overlay width="medium">
          <ActionList>
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <ServerIcon />
              </ActionList.LeadingVisual>
              Open current Codespace
              <ActionList.Description variant="block">
                Your existing Codespace will be opened to its previous state, and you&apos;ll be asked to manually
                switch to new-branch.
              </ActionList.Description>
              <ActionList.TrailingVisual>⌘O</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <PlusCircleIcon />
              </ActionList.LeadingVisual>
              Create new Codespace
              <ActionList.Description variant="block">
                Create a brand new Codespace with a fresh image and checkout this branch.
              </ActionList.Description>
              <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

export function ExternalAnchor(): JSX.Element {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  const [open, setOpen] = React.useState(false)
  const anchorRef = React.createRef<HTMLButtonElement>()

  return (
    <>
      <h1>External Anchor</h1>
      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <h2>Last option activated: {actionFired}</h2>
      <div>
        <Button ref={anchorRef} onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="true">
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
      </div>
      <br />

      <ActionMenu open={open} onOpenChange={setOpen} anchorRef={anchorRef}>
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

export function ControlledMenu(): JSX.Element {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  const [open, setOpen] = React.useState(false)
  const triggerRef = React.createRef<HTMLButtonElement>()

  return (
    <>
      <h1>Controlled Menu</h1>
      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <h2>Last option activated: {actionFired}</h2>
      <div>
        <Button ref={triggerRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
      </div>
      <br />

      {/**
       * Even though the state is controlled externally,
       * we can pass an Anchor for the menu to "anchor to"
       */}
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button>Anchor</ActionMenu.Button>
        <ActionMenu.Overlay
          ignoreClickRefs={[
            // Because the component is controlled from outside, but the anchor is still internal,
            // clicking the external button should not be counted as "clicking outside"
            triggerRef
          ]}
        >
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

export function CustomAnchor(): JSX.Element {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  return (
    <>
      <h1>Custom Anchor</h1>
      <h2>Last option activated: {actionFired}</h2>
      <ActionMenu>
        <ActionMenu.Anchor>
          <summary style={{cursor: 'pointer'}} aria-label="Open column options">
            <KebabHorizontalIcon />
          </summary>
        </ActionMenu.Anchor>
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item onSelect={() => onSelect('Rename')}>
              <ActionList.LeadingVisual>
                <PencilIcon />
              </ActionList.LeadingVisual>
              Rename
            </ActionList.Item>
            <ActionList.Item onSelect={() => onSelect('Archive')}>
              <ActionList.LeadingVisual>
                <ArchiveIcon />
              </ActionList.LeadingVisual>
              Archive all cards
            </ActionList.Item>
            <ActionList.Item variant="danger" onSelect={() => onSelect('Delete file')}>
              <ActionList.LeadingVisual>
                <TrashIcon />
              </ActionList.LeadingVisual>
              Delete
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

export function MemexTableMenu(): JSX.Element {
  const [name, setName] = React.useState('Estimate')
  const inputRef = React.createRef<HTMLInputElement>()

  /** To add custom components to the Menu,
   *  you need to switch to a controlled menu
   */
  const [open, setOpen] = React.useState(false)
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setName(event.currentTarget.value)
      setOpen(false)
    }
  }

  /** This requires inside knowledge. If you to do this with onBlur
   *  on the input, it doesn't work :(
   */
  const handleClickOutside = () => {
    if (inputRef.current) setName(inputRef.current.value)
    setOpen(false)
  }

  return (
    <>
      <h1>Memex Table Menu</h1>
      <Box
        sx={{
          width: 200,
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          border: '1px solid',
          borderColor: 'border.default'
        }}
      >
        <Text sx={{fontSize: 0, fontWeight: 'bold'}}>{name}</Text>
        <ActionMenu open={open} onOpenChange={setOpen}>
          <ActionMenu.Anchor>
            <IconButton icon={TriangleDownIcon} aria-label="Open Estimate column options menu" sx={{padding: 0}} />
          </ActionMenu.Anchor>

          <ActionMenu.Overlay onClickOutside={handleClickOutside}>
            <TextInput ref={inputRef} sx={{m: 2}} defaultValue={name} onKeyPress={handleKeyPress} />
            <ActionMenu.Divider sx={{m: 0}} />

            <ActionList>
              <ActionList.Item>Sort ascending (123...)</ActionList.Item>
              <ActionList.Item>Sort descending (123...)</ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item>Filter by values</ActionList.Item>
              <ActionList.Item>Group by values</ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item disabled>Hide field</ActionList.Item>
              <ActionList.Item variant="danger">Delete file</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Box>
    </>
  )
}

/* copied from github/memex */
const LayoutToggleItem = ({
  selected,
  children,
  Icon,
  ...props
}: {
  selected: boolean
  children: React.ReactNode
  Icon: React.ComponentType<IconProps>
}) => {
  return (
    <FormControl
      sx={{
        flex: 'auto',
        borderRadius: 2,
        border: '1px solid',
        borderColor: selected ? 'accent.emphasis' : 'border.default',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: selected ? 'accent.subtle' : '',
        boxShadow: selected ? theme => `inset 0 0 0 1px ${theme.colors.accent.emphasis}` : '',
        mb: 2,
        mt: 1,
        '&:hover': {
          backgroundColor: !selected ? 'canvas.subtle' : ''
        },
        '&:first-of-type': {
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '0px',
          borderRight: selected ? undefined : '0'
        },
        '&:last-of-type': {
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
          borderLeft: selected ? undefined : '0'
        }
      }}
    >
      <FormControl.Label sx={{fontWeight: 'normal', cursor: 'pointer', px: 3, py: 2, mb: 0}} {...props}>
        <Box sx={{textAlign: 'center', flexDirection: 'column', m: 'auto', alignItems: 'center', display: 'flex'}}>
          <Icon size="medium" />
          <Text sx={{color: selected ? 'fg.default' : 'fg.muted', fontSize: 0}}>{children}</Text>
        </Box>
      </FormControl.Label>
    </FormControl>
  )
}

/* copied from github/memex */
const ViewChangeButtons = ({setOpen}: {setOpen: (open: boolean) => void}) => (
  <Box sx={{display: 'flex'}}>
    <Button
      variant="invisible"
      onClick={() => setOpen(false)}
      sx={{
        flex: 'auto',
        minWidth: '50%',
        borderRight: '1px solid',
        borderColor: 'border.default',
        borderRadius: 0,
        mt: -2,
        mb: -2,
        py: 3,
        '&:hover': {
          bg: 'canvas.inset'
        }
      }}
    >
      Save changes
    </Button>

    <Button
      variant="invisible"
      onClick={() => setOpen(false)}
      sx={{
        flex: 'auto',
        color: 'fg.muted',
        borderRadius: 0,
        mt: -2,
        mb: -2,
        py: 3,
        fontWeight: 'normal',
        '&:hover': {
          bg: 'canvas.inset'
        }
      }}
    >
      Discard changes
    </Button>
  </Box>
)

export function MemexViewOptionsMenu(): JSX.Element {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <h1>Memex View Options Menu</h1>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <Text sx={{fontSize: 1, mr: 3}}>
          <StyledOcticon icon={ProjectIcon} sx={{mr: 2}} />
          React
        </Text>
        <ActionMenu open={open} onOpenChange={setOpen}>
          <ActionMenu.Anchor aria-label="Open View options menu">
            <IconButton
              icon={TriangleDownIcon}
              sx={{
                padding: '0 1px',
                lineHeight: '18px'
              }}
            />
          </ActionMenu.Anchor>

          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Group title="Layout">
                <li style={{listStyle: 'none'}}>
                  <Box sx={{mx: 3, display: 'flex'}}>
                    <LayoutToggleItem selected Icon={TableIcon}>
                      Table
                    </LayoutToggleItem>
                    <LayoutToggleItem selected={false} Icon={ProjectIcon}>
                      Board
                    </LayoutToggleItem>
                  </Box>
                </li>
              </ActionList.Group>
              <ActionList.Divider />

              <ActionList.Group title="Configuration">
                <ActionList.Item>
                  <ActionList.LeadingVisual>
                    <ListUnorderedIcon />
                  </ActionList.LeadingVisual>
                  Title, Assignees, Status, Labels, Repositories
                </ActionList.Item>
                <ActionList.Item>
                  <ActionList.LeadingVisual>
                    <ListUnorderedIcon />
                  </ActionList.LeadingVisual>
                  group: none
                </ActionList.Item>
                <ActionList.Item>
                  <ActionList.LeadingVisual>
                    <ArrowDownIcon />
                  </ActionList.LeadingVisual>
                  sort: manual
                </ActionList.Item>
                <ActionList.Item>
                  <ActionList.LeadingVisual>
                    <SearchIcon />
                  </ActionList.LeadingVisual>
                  Search or filter this view
                </ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <PencilIcon />
                </ActionList.LeadingVisual>
                Rename view
              </ActionList.Item>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <VersionsIcon />
                </ActionList.LeadingVisual>
                Save changes to new view
              </ActionList.Item>
              <ActionList.Item disabled>
                <ActionList.LeadingVisual>
                  <TrashIcon />
                </ActionList.LeadingVisual>
                Delete view
              </ActionList.Item>
              <ActionList.Divider />

              <li style={{listStyle: 'none'}}>
                <ViewChangeButtons setOpen={setOpen} />
              </li>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Box>
    </>
  )
}

export function MemexIteration(): JSX.Element {
  const [duration, setDuration] = React.useState(1)

  return (
    <>
      <h1>Memex Iteration Menu</h1>

      <ActionMenu>
        <ActionMenu.Button
          variant="invisible"
          sx={{
            fontWeight: 'normal',
            color: 'fg.muted',
            ':hover, :focus': {background: 'none !important', color: 'accent.fg'}
          }}
          aria-label="Select iteration duration"
        >
          {duration} {duration > 1 ? 'weeks' : 'week'}
        </ActionMenu.Button>
        <ActionMenu.Overlay width="medium">
          <ActionList selectionVariant="single">
            {[1, 2, 3, 4, 5, 6].map(weeks => (
              <ActionList.Item key={weeks} selected={duration === weeks} onSelect={() => setDuration(weeks)}>
                {weeks} {weeks > 1 ? 'weeks' : 'week'}
              </ActionList.Item>
            ))}
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

export function MemexAddColumn(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const selectedType = fieldTypes[selectedIndex]

  const [durationUnit, setDurationUnit] = React.useState('weeks')

  return (
    <>
      <h1>Memex Add column</h1>

      <Box as="form" sx={{display: 'flex', flexDirection: 'column', width: 320}}>
        <FormControl>
          <FormControl.Label visuallyHidden>Column name</FormControl.Label>
          <TextInput defaultValue="Estimate" aria-label="Field Name" sx={{mb: 2}} />
        </FormControl>
        <ActionMenu>
          <ActionMenu.Button
            aria-label="Select field type"
            leadingIcon={selectedType.icon}
            sx={{
              gridTemplateColumns: 'min-content 1fr min-content',
              '[data-component="text"]': {textAlign: 'left'}
            }}
          >
            {selectedType.name}
          </ActionMenu.Button>
          <ActionMenu.Overlay width="medium">
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
          </ActionMenu.Overlay>
        </ActionMenu>
        <Text sx={{fontSize: 0, color: 'fg.muted', mt: 3, mb: 1}}>Options</Text>

        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Text as="label" sx={{fontSize: 1, mr: 2}} htmlFor="duration">
            Duration:
          </Text>
          <TextInput id="duration" type="number" defaultValue="2" sx={{width: '6ch'}} />

          <ActionMenu>
            <ActionMenu.Button
              id="duration"
              aria-label="Select field type"
              sx={{
                textAlign: 'left',
                ml: 2,
                flexGrow: 1,
                gridTemplateColumns: 'min-content 1fr min-content',
                '[data-component="text"]': {textAlign: 'left'}
              }}
            >
              {durationUnit}
            </ActionMenu.Button>
            <ActionMenu.Overlay width="medium">
              <ActionList selectionVariant="single">
                <ActionList.Item selected={durationUnit === 'weeks'} onSelect={() => setDurationUnit('weeks')}>
                  weeks
                </ActionList.Item>
                <ActionList.Item selected={durationUnit === 'days'} onSelect={() => setDurationUnit('days')}>
                  days
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </Box>
      </Box>
    </>
  )
}

export function OverlayProps(): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const inputRef = React.createRef<HTMLInputElement>()

  return (
    <>
      <h1>OverlayProps</h1>
      <p>
        Disable `onClickOutside` and `onEscape`. Only way to close is to select an action which takes focus on a
        TextInput
      </p>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <ActionMenu open={open} onOpenChange={setOpen}>
          <ActionMenu.Button>Menu</ActionMenu.Button>
          <ActionMenu.Overlay
            width="large"
            align="center"
            onClickOutside={() => {
              /* do nothing, keep it open*/
            }}
            onEscape={() => {
              /* do nothing, keep it open*/
            }}
            returnFocusRef={inputRef}
          >
            <ActionList>
              <ActionList.Item>Option 1</ActionList.Item>
              <ActionList.Item>Option 2</ActionList.Item>
              <ActionList.Item>Option 2</ActionList.Item>
              <ActionList.Item>Option 2</ActionList.Item>
              <ActionList.Item>Option 2</ActionList.Item>
              <ActionList.Item>Option 2</ActionList.Item>
              <ActionList.Item>Option 2</ActionList.Item>
              <ActionList.Item>Option 2</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Box>
      <br />
      <br />
      <TextInput type="text" ref={inputRef} placeholder="Random input to return focus to" sx={{width: 280}} />
    </>
  )
}

export function TypeaheadTest(): JSX.Element {
  return (
    <>
      <h1>Story to test typeahead</h1>

      <ActionMenu>
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Group title="Sorting">
              <ActionList.Item>Sort by A</ActionList.Item>
              <ActionList.Item>Sort by B</ActionList.Item>
              <ActionList.Item>Sort by C</ActionList.Item>
            </ActionList.Group>
            <ActionList.Item>Order</ActionList.Item>
            <ActionList.Item>Group</ActionList.Item>
            <ActionList.Item disabled>Disabled</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}
