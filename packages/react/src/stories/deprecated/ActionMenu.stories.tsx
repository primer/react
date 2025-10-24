import {
  ServerIcon,
  PlusCircleIcon,
  TypographyIcon,
  VersionsIcon,
  SearchIcon,
  NoteIcon,
  ProjectIcon,
  FilterIcon,
  GearIcon,
  ArrowRightIcon,
  TriangleDownIcon,
} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import {useCallback, useState, useRef} from 'react'
import type {ActionMenuProps} from '../../deprecated'
import {ActionMenu, ActionList} from '../../deprecated'
import type {ItemProps} from '../../deprecated/ActionList'
import {Button, type ButtonProps} from '../../Button'
import classes from './ActionMenuStories.module.css'

const meta: Meta = {
  title: 'Deprecated/Components/ActionMenu',
  component: ActionMenu,
  parameters: {
    controls: {
      disable: true,
    },
  },
}
export default meta

const ErsatzOverlay = ({children, ...props}: {children: React.ReactNode}) => (
  <div {...props} className={classes.ErsatzOverlay}>
    {children}
  </div>
)

export function ActionsStory(): JSX.Element {
  const [option, setOption] = useState('Select an option')
  const onAction = (itemProps: ItemProps) => {
    setOption(itemProps.text ?? '')
  }
  return (
    <>
      <h1>Actions</h1>
      <h2>Last option activated: {option}</h2>
      <ErsatzOverlay>
        <ActionMenu
          onAction={onAction}
          anchorContent={<ServerIcon />}
          items={[
            {
              leadingVisual: ServerIcon,
              text: 'Open current Codespace',
              description:
                "Your existing Codespace will be opened to its previous state, and you'll be asked to manually switch to new-branch.",
              descriptionVariant: 'block',
              trailingText: '⌘O',
            },
            {
              leadingVisual: PlusCircleIcon,
              text: 'Create new Codespace',
              description: 'Create a brand new Codespace with a fresh image and checkout this branch.',
              descriptionVariant: 'block',
              trailingText: '⌘C',
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ActionsStory.storyName = 'Actions'

export function SimpleListStory(): JSX.Element {
  const [option, setOption] = useState('Select an option')
  const onAction = (itemProps: ItemProps) => {
    setOption(itemProps.text || '')
  }
  return (
    <>
      <h1>Simple List</h1>
      <h2>Last option activated: {option}</h2>
      <ErsatzOverlay>
        <ActionMenu
          onAction={onAction}
          anchorContent="Menu"
          overlayProps={{
            'data-test-id': 'some_test_id',
          }}
          items={[
            {text: 'New file', trailingText: '⌘O', disabled: true, leadingVisual: ProjectIcon},
            ActionList.Divider,
            {text: 'Copy link', trailingText: 'ctrl+C'},
            {text: 'Edit file', trailingText: '⌘E'},
            {
              text: 'Delete file',
              variant: 'danger',
              trailingText: '⌘D',
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
SimpleListStory.storyName = 'Simple List'

export function ExternalOpenState(): JSX.Element {
  const [option, setOption] = useState('Select an option')
  const [open, setOpen] = useState(false)
  const onAction = (itemProps: ItemProps) => {
    setOption(itemProps.text as string)
  }
  return (
    <>
      <h1>Simple List</h1>
      <h2>Last option activated: {option}</h2>
      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <div>
        <Button onClick={() => setOpen(!open)}>Toggle External State</Button>
      </div>
      <br />
      <ErsatzOverlay>
        <ActionMenu
          onAction={onAction}
          anchorContent="Menu"
          open={open}
          setOpen={setOpen}
          items={[
            {text: 'New file', trailingText: '⌘O', disabled: true, leadingVisual: ProjectIcon},
            ActionList.Divider,
            {text: 'Copy link', trailingText: 'ctrl+C'},
            {text: 'Edit file', trailingText: '⌘E'},
            {
              text: 'Delete file',
              variant: 'danger',
              trailingVisual: '⌘D',
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}

export function ComplexListStory(): JSX.Element {
  const [option, setOption] = useState('Select an option')
  const onAction = (itemProps: ItemProps) => {
    setOption(itemProps.text || '')
  }
  return (
    <>
      <h1>Complex List</h1>
      <h2>Last option activated: {option}</h2>
      <ErsatzOverlay>
        <ActionMenu
          onAction={onAction}
          anchorContent="Menu"
          groupMetadata={[
            {groupId: '0'},
            {groupId: '1', header: {title: 'Live query', variant: 'subtle'}},
            {groupId: '2', header: {title: 'Layout', variant: 'subtle'}},
            {groupId: '3', renderItem: props => <ActionList.Item {...props} style={{fontWeight: 'bold'}} />},
            {groupId: '4'},
          ]}
          items={[
            {leadingVisual: TypographyIcon, text: 'Rename', groupId: '0'},
            {leadingVisual: VersionsIcon, text: 'Duplicate', groupId: '0'},
            {
              leadingVisual: SearchIcon,
              text: 'repo:github/github',
              groupId: '1',
              renderItem: props => <ActionList.Item {...props} style={{color: 'rebeccapurple'}} />,
              trailingVisual: (
                <>
                  ⌘S
                  <ArrowRightIcon />
                </>
              ),
            },
            {
              leadingVisual: SearchIcon,
              text: 'repo:github/github',
              groupId: '1',
              renderItem: props => <ActionList.Item {...props} style={{color: 'rebeccapurple'}} />,
              trailingText: '⌘S', // backward compatible
              trailingVisual: ArrowRightIcon, // backward compatible
            },
            {
              leadingVisual: NoteIcon,
              text: 'Table',
              description: 'Information-dense table optimized for operations across teams',
              descriptionVariant: 'block',
              groupId: '2',
            },
            {
              leadingVisual: ProjectIcon,
              text: 'Board',
              description: 'Kanban-style board focused on visual states',
              descriptionVariant: 'block',
              groupId: '2',
            },
            {
              leadingVisual: FilterIcon,
              text: 'Save sort and filters to current view',
              groupId: '3',
            },
            {leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '3'},
            {leadingVisual: GearIcon, text: 'View settings', groupId: '4'},
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ComplexListStory.storyName = 'Complex List'

export function CustomTrigger(): JSX.Element {
  const customAnchor = (props: ButtonProps) => <Button {...props} style={{cursor: 'pointer'}} />
  const [option, setOption] = useState('Select an option')
  const onAction = useCallback((itemProps: ItemProps) => {
    setOption(itemProps.text || '')
  }, [])
  return (
    <>
      <h1>Custom Trigger</h1>
      <h2>Last option activated: {option}</h2>
      <ErsatzOverlay>
        <ActionMenu
          onAction={onAction}
          anchorContent="Menu"
          renderAnchor={customAnchor}
          items={[
            {text: 'New file'},
            ActionList.Divider,
            {text: 'Copy link'},
            {text: 'Edit file'},
            {text: 'Delete file', variant: 'danger'},
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}

export function ActionMenuWithExternalAnchor(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Menu
      </Button>
      <ActionMenu
        renderAnchor={null}
        anchorRef={buttonRef}
        open={isOpen}
        setOpen={setIsOpen}
        items={[
          {text: 'New file'},
          ActionList.Divider,
          {text: 'Copy link'},
          {text: 'Edit file'},
          {text: 'Delete file', variant: 'danger'},
        ]}
      />
    </>
  )
}

const DoubleClickableAnchor: Exclude<ActionMenuProps['renderAnchor'], null | undefined> = ({
  onClick: callback,
  children,
  ...rest
}) => {
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 2) {
        event.preventDefault()
      }
      callback?.(event)
    },
    [callback],
  )
  return (
    <Button {...rest} trailingAction={TriangleDownIcon} onClick={onClick}>
      {children}
    </Button>
  )
}
export function ActionMenuWithDoubleClickStory(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>
      <ErsatzOverlay>
        <ActionMenu
          renderAnchor={DoubleClickableAnchor}
          anchorContent={<ServerIcon />}
          items={[
            {
              leadingVisual: ServerIcon,
              text: 'Open current Codespace',
              description:
                "Your existing Codespace will be opened to its previous state, and you'll be asked to manually switch to new-branch.",
              descriptionVariant: 'block',
              trailingText: '⌘O',
            },
            {
              leadingVisual: PlusCircleIcon,
              text: 'Create new Codespace',
              description: 'Create a brand new Codespace with a fresh image and checkout this branch.',
              descriptionVariant: 'block',
              trailingText: '⌘C',
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ActionMenuWithDoubleClickStory.storyName = 'ActionMenu with double-clickable anchor'
