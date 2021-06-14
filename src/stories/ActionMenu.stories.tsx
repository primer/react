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
  ArrowRightIcon
} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import React, {useCallback, useState, useRef} from 'react'
import styled from 'styled-components'
import {ThemeProvider} from '..'
import {ActionMenu} from '../ActionMenu'
import Link, {LinkProps} from '../Link'
import Button from '../Button'
import {ActionList, ItemProps} from '../ActionList'
import BaseStyles from '../BaseStyles'

const meta: Meta = {
  title: 'Composite components/ActionMenu',
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

const ErsatzOverlay = styled.div`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(149, 157, 165, 0.2);
  padding: 8px;
`

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
              trailingText: '⌘O'
            },
            {
              leadingVisual: PlusCircleIcon,
              text: 'Create new Codespace',
              description: 'Create a brand new Codespace with a fresh image and checkout this branch.',
              descriptionVariant: 'block',
              trailingText: '⌘C'
            }
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
            onMouseDown: (e: React.MouseEvent) =>
              // eslint-disable-next-line no-console
              console.log('onMouseDown in the internal Overlay can be useful for controlling event interactions', e)
          }}
          items={[
            {text: 'New file', trailingText: '⌘O', disabled: true, leadingVisual: ProjectIcon},
            ActionList.Divider,
            {text: 'Copy link', trailingText: 'ctrl+C'},
            {text: 'Edit file', trailingText: '⌘E'},
            {
              text: 'Delete file',
              variant: 'danger',
              trailingText: '⌘D'
            }
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
              trailingText: '⌘D'
            }
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ExternalOpenState.storyName = 'External Open State'

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
            {groupId: '3', renderItem: props => <ActionList.Item style={{fontWeight: 'bold'}} {...props} />},
            {groupId: '4'}
          ]}
          items={[
            {leadingVisual: TypographyIcon, text: 'Rename', groupId: '0'},
            {leadingVisual: VersionsIcon, text: 'Duplicate', groupId: '0'},
            {
              leadingVisual: SearchIcon,
              text: 'repo:github/github',
              groupId: '1',
              renderItem: props => <ActionList.Item style={{color: 'rebeccapurple'}} {...props} />,
              trailingText: '⌘S',
              trailingIcon: ArrowRightIcon
            },
            {
              leadingVisual: NoteIcon,
              text: 'Table',
              description: 'Information-dense table optimized for operations across teams',
              descriptionVariant: 'block',
              groupId: '2'
            },
            {
              leadingVisual: ProjectIcon,
              text: 'Board',
              description: 'Kanban-style board focused on visual states',
              descriptionVariant: 'block',
              groupId: '2'
            },
            {
              leadingVisual: FilterIcon,
              text: 'Save sort and filters to current view',
              groupId: '3'
            },
            {leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '3'},
            {leadingVisual: GearIcon, text: 'View settings', groupId: '4'}
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ComplexListStory.storyName = 'Complex List'

export function CustomTrigger(): JSX.Element {
  const customAnchor = (props: LinkProps) => <Link {...props} sx={{cursor: 'pointer'}} />
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
            {text: 'Delete file', variant: 'danger'}
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
CustomTrigger.storyName = 'Custom Trigger'

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
          {text: 'Delete file', variant: 'danger'}
        ]}
      />
    </>
  )
}
