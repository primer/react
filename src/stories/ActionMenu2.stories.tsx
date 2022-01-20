import React from 'react'
import {Meta} from '@storybook/react'
import {ThemeProvider} from '..'
import BaseStyles from '../BaseStyles'
import {ActionMenu} from '../ActionMenu2'
import {ActionList} from '../ActionList2'
import {Button} from '../Button2'
import {IconButton} from '../Button2/IconButton'
import Box from '../Box'
import Text from '../Text'
import TextInput from '../TextInput'
import StyledOcticon from '../StyledOcticon'
import FormGroup from '../FormGroup'
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
  IconProps
} from '@primer/octicons-react'

const meta: Meta = {
  title: 'Composite components/ActionMenu2',
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

export function SimpleListStory(): JSX.Element {
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
SimpleListStory.storyName = 'Simple Menu'

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
ActionsStory.storyName = 'Actions'

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
ExternalAnchor.storyName = 'External Anchor'

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
ControlledMenu.storyName = 'Controlled Menu'

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
CustomAnchor.storyName = 'Custom Anchor'

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
MemexTableMenu.storyName = 'Memex Table Menu'

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
    <FormGroup
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
      <FormGroup.Label
        htmlFor="layout-selector"
        sx={{fontWeight: 'normal', cursor: 'pointer', px: 3, py: 2, mb: 0}}
        {...props}
      >
        <Box sx={{textAlign: 'center', flexDirection: 'column', m: 'auto', alignItems: 'center', display: 'flex'}}>
          <Icon size="medium" />
          <Text sx={{color: selected ? 'fg.default' : 'fg.muted', fontSize: 0}}>{children}</Text>
        </Box>
      </FormGroup.Label>
    </FormGroup>
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
          <ActionMenu.Button
            aria-label="Open View options menu"
            sx={{
              p: 0,
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TriangleDownIcon />
          </ActionMenu.Button>

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
MemexViewOptionsMenu.storyName = 'Memex View Options Menu'

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
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionMenu.Overlay
          width="large"
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
      <br />
      <br />
      <TextInput type="text" ref={inputRef} placeholder="random input to return focus to" />
    </>
  )
}
OverlayProps.storyName = 'Overlay Props'

export function UnexpectedSelectionVariant(): JSX.Element {
  return (
    <>
      <h1>Expect error if selectionVariant is passed</h1>

      <ActionMenu>
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList selectionVariant="multiple">
            <ActionList.Item>Copy link</ActionList.Item>
            <ActionList.Item>Quote reply</ActionList.Item>
            <ActionList.Item>Edit comment</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item variant="danger">Delete file</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}
UnexpectedSelectionVariant.storyName = 'Unexpected selectionVariant'
