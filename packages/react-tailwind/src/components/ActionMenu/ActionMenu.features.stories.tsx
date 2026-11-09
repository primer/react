import React from 'react'
import {ArchiveIcon, CopyIcon, GearIcon, SparkleFillIcon, WorkflowIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {BaseStyles} from '../../BaseStyles'
import {ActionList} from '../ActionList'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {IconButton} from '../IconButton'
import {Tooltip} from '../Tooltip'
import {ActionMenu, type ActionMenuContentProps} from './ActionMenu'
import {GitHubProjectsGroup, ProjectActions} from './ActionMenu.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/ActionMenu/Features',
  component: ActionMenu,
} satisfies Meta<typeof ActionMenu>

export default meta
type Story = StoryObj<typeof meta>

const notifyClicked = (name: string) => alert(`${name} clicked`)

export const LinksAndActions: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto">
        <ProjectActions />
        <GitHubProjectsGroup heading="GitHub projects" />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const TooltipTrigger: Story = {
  render: () => (
    <ActionMenu>
      <Tooltip>
        <Tooltip.Trigger render={<ActionMenu.Trigger render={<Button />}>Branches</ActionMenu.Trigger>} />
        <Tooltip.Content>Switch branches</Tooltip.Content>
      </Tooltip>
      <ActionMenu.Content>
        <ActionMenu.Item>main</ActionMenu.Item>
        <ActionMenu.Item>feature</ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  ),
  play: async ({canvas}) => {
    const trigger = canvas.getByRole('button', {name: 'Branches'})
    await userEvent.click(trigger)
    const item = await within(document.body).findByRole('menuitem', {name: 'main'})
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveFocus()
    await expect(item).not.toBeVisible()
  },
}

export const CustomTriggers: Story = {
  render: function CustomTriggersStory() {
    const tooltipId = React.useId()
    const tooltipRef = React.useRef<HTMLElement>(null)
    const menuRef = React.useRef<HTMLButtonElement>(null)
    const iconRef = React.useRef<HTMLElement>(null)
    const [refsConnected, setRefsConnected] = React.useState(false)

    return (
      <div className="flex flex-wrap items-center gap-3">
        <ActionMenu>
          <Tooltip id={tooltipId} type="label">
            <Tooltip.Trigger
              ref={tooltipRef}
              aria-labelledby={tooltipId}
              render={
                <ActionMenu.Trigger
                  ref={menuRef}
                  render={
                    <IconButton
                      ref={iconRef}
                      aria-labelledby={tooltipId}
                      icon={<GearIcon data-testid="rendered-menu-icon" />}
                      onFocus={event =>
                        setRefsConnected(
                          [tooltipRef.current, menuRef.current, iconRef.current].every(
                            ref => ref === event.currentTarget,
                          ),
                        )
                      }
                    />
                  }
                />
              }
            />
            <Tooltip.Content>Repository actions</Tooltip.Content>
          </Tooltip>
          <ActionMenu.Content aria-labelledby={tooltipId}>
            <ActionMenu.Item>Copy</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Trigger render={<IconButton aria-label="Component actions" icon={GearIcon} />} />
          <ActionMenu.Content>
            <ActionMenu.Item>Archive</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Button>Default chevron</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item>Copy</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Button trailingAction={null}>No chevron</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item>Copy</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Button trailingAction={<GearIcon data-testid="custom-trailing-action" />}>
            Custom chevron
          </ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item>Copy</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <span data-testid="trigger-refs">Refs: {refsConnected ? 'connected' : 'pending'}</span>
      </div>
    )
  },
  play: async ({canvas}) => {
    const trigger = canvas.getByRole('button', {name: 'Repository actions'})
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(within(document.body).getByRole('menuitem', {name: 'Copy'})).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveFocus()
  },
}

const mergeOptions = ['Fast forward', 'Recursive', 'Ours', 'Octopus', 'Resolve', 'Subtree']

export const SingleSelect: Story = {
  render: function SingleSelectExample() {
    const [selected, setSelected] = React.useState(mergeOptions[0])
    return (
      <ActionMenu>
        <ActionMenu.Button>
          <span className="inline-block text-muted">Options:</span> {selected}
        </ActionMenu.Button>
        <ActionMenu.Content width="auto">
          <ActionMenu.RadioGroup value={selected} onValueChange={setSelected}>
            {mergeOptions.map(option => (
              <ActionMenu.RadioItem key={option} value={option}>
                {option}
              </ActionMenu.RadioItem>
            ))}
          </ActionMenu.RadioGroup>
        </ActionMenu.Content>
      </ActionMenu>
    )
  },
}

const displayOptions = ['Show code folding buttons', 'Wrap lines', 'Center content']

export const MultiSelect: Story = {
  render: function MultiSelectExample() {
    const [selected, setSelected] = React.useState<ReadonlySet<string>>(() => new Set([displayOptions[0]]))
    const toggle = (option: string, checked: boolean) =>
      setSelected(current => {
        const next = new Set(current)
        if (checked) next.add(option)
        else next.delete(option)
        return next
      })
    return (
      <ActionMenu>
        <ActionMenu.Button>Display</ActionMenu.Button>
        <ActionMenu.Content width="auto">
          {displayOptions.map(option => (
            <ActionMenu.CheckboxItem
              key={option}
              checked={selected.has(option)}
              onCheckedChange={checked => toggle(option, checked)}
            >
              {option}
            </ActionMenu.CheckboxItem>
          ))}
        </ActionMenu.Content>
      </ActionMenu>
    )
  },
}

export const ItemDescriptions: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Repository actions</ActionMenu.Button>
      <ActionMenu.Content width="medium">
        <ActionMenu.Item closeOnClick={false}>
          Archive
          <ActionMenu.Description variant="block">Move the repository out of active lists</ActionMenu.Description>
          <ActionMenu.TrailingVisual>Ctrl+A</ActionMenu.TrailingVisual>
        </ActionMenu.Item>
        <ActionMenu.CheckboxItem closeOnClick={false}>
          Watch
          <ActionMenu.Description variant="block">Receive notifications</ActionMenu.Description>
        </ActionMenu.CheckboxItem>
        <ActionMenu.RadioGroup defaultValue="month">
          <ActionMenu.RadioItem closeOnClick={false} value="month">
            Current month
            <ActionMenu.Description variant="block">June 2025</ActionMenu.Description>
          </ActionMenu.RadioItem>
        </ActionMenu.RadioGroup>
        <ActionMenu.LinkItem closeOnClick={false} href="#settings">
          Settings
          <ActionMenu.Description variant="block">Manage repository settings</ActionMenu.Description>
        </ActionMenu.LinkItem>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

interface RouterLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  onNavigate: (path: string) => void
  onObservedEvent: (message: string) => void
  to: string
}

const RouterLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function RouterLink(
  {children, onAuxClick, onClick, onNavigate, onObservedEvent, to, ...props},
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      href={to}
      onClick={event => {
        onClick?.(event)
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
        onObservedEvent(`click: button=${event.button}, modified=${modified}, prevented=${event.defaultPrevented}`)
        if (!event.defaultPrevented && !modified && event.button === 0) onNavigate(to)
        event.preventDefault()
      }}
      onAuxClick={event => {
        onAuxClick?.(event)
        onObservedEvent(`auxclick: button=${event.button}, prevented=${event.defaultPrevented}`)
        event.preventDefault()
      }}
    >
      {children}
    </a>
  )
})

export const RouterLinkComposition: Story = {
  render: function RouterLinkCompositionStory() {
    const ref = React.useRef<HTMLAnchorElement>(null)
    const [path, setPath] = React.useState('/')
    const [observed, setObserved] = React.useState('none')
    const [refForwarded, setRefForwarded] = React.useState(false)
    return (
      <>
        <ActionMenu>
          <ActionMenu.Button>Project menu</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.LinkItem
              closeOnClick={false}
              onFocus={event => setRefForwarded(ref.current === event.currentTarget)}
              ref={ref}
              render={<RouterLink onNavigate={setPath} onObservedEvent={setObserved} to="/projects" />}
            >
              Browse projects
              <ActionMenu.Description>View all projects</ActionMenu.Description>
            </ActionMenu.LinkItem>
          </ActionMenu.Content>
        </ActionMenu>
        <p data-testid="router-path">Path: {path}</p>
        <p data-testid="router-event">Last event: {observed}</p>
        <p data-testid="router-ref">Ref: {refForwarded ? 'forwarded' : 'pending'}</p>
      </>
    )
  },
}

export const InactiveRouterLinks: Story = {
  render: function InactiveRouterLinksStory() {
    const listRef = React.useRef<HTMLAnchorElement>(null)
    const listRouterRef = React.useRef<HTMLAnchorElement>(null)
    const menuRef = React.useRef<HTMLAnchorElement>(null)
    const menuRouterRef = React.useRef<HTMLAnchorElement>(null)
    const [inactive, setInactive] = React.useState(true)
    const [listRefStatus, setListRefStatus] = React.useState('pending')
    const [menuRefStatus, setMenuRefStatus] = React.useState('pending')
    const [path, setPath] = React.useState('/')
    const [captures, setCaptures] = React.useState(0)
    return (
      <>
        <ActionList.Listbox aria-label="Project links" selectionVariant="single">
          <ActionList.LinkItem
            inactiveText={inactive ? 'Requires access' : undefined}
            onClickCapture={() => setCaptures(count => count + 1)}
            onFocus={event =>
              setListRefStatus(
                listRef.current !== event.currentTarget
                  ? 'mismatch'
                  : listRouterRef.current === event.currentTarget
                    ? 'router'
                    : 'placeholder',
              )
            }
            ref={listRef}
            render={
              <RouterLink
                data-router-link="list"
                onNavigate={setPath}
                onObservedEvent={() => {}}
                ref={listRouterRef}
                to="#list-project"
              />
            }
          >
            List project
          </ActionList.LinkItem>
          <ActionList.Item>Other option</ActionList.Item>
        </ActionList.Listbox>
        <ActionMenu>
          <ActionMenu.Button>Project link menu</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.LinkItem
              closeOnClick={false}
              inactiveText={inactive ? 'Requires access' : undefined}
              onClickCapture={() => setCaptures(count => count + 1)}
              onFocus={event =>
                setMenuRefStatus(
                  menuRef.current !== event.currentTarget
                    ? 'mismatch'
                    : menuRouterRef.current === event.currentTarget
                      ? 'router'
                      : 'placeholder',
                )
              }
              ref={menuRef}
              render={
                <RouterLink
                  data-router-link="menu"
                  onNavigate={setPath}
                  onObservedEvent={() => {}}
                  ref={menuRouterRef}
                  to="#menu-project"
                />
              }
            >
              Menu project
            </ActionMenu.LinkItem>
            <ActionMenu.Item>Other action</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <Button onClick={() => setInactive(value => !value)}>{inactive ? 'Make available' : 'Make inactive'}</Button>
        <p data-testid="list-ref">List ref: {listRefStatus}</p>
        <p data-testid="menu-ref">Menu ref: {menuRefStatus}</p>
        <p data-testid="link-captures">Activation captures: {captures}</p>
        <p role="status">Current path: {path}</p>
      </>
    )
  },
}

const insidePlacementOptions = ['inside-top', 'inside-bottom', 'inside-left', 'inside-right', 'inside-center'] as const
type InsidePlacement = (typeof insidePlacementOptions)[number]

const insidePlacements: Record<
  InsidePlacement,
  Pick<ActionMenuContentProps, 'align' | 'alignOffset' | 'side' | 'sideOffset'>
> = {
  'inside-top': {align: 'start', side: 'bottom', sideOffset: ({anchor}) => -anchor.height + 8},
  'inside-bottom': {align: 'start', side: 'bottom', sideOffset: ({positioner}) => -positioner.height - 8},
  'inside-left': {align: 'start', side: 'right', sideOffset: ({anchor}) => -anchor.width + 8},
  'inside-right': {align: 'start', side: 'right', sideOffset: ({positioner}) => -positioner.width - 8},
  'inside-center': {
    align: 'start',
    alignOffset: ({anchor, positioner}) => (anchor.width - positioner.width) / 2,
    side: 'bottom',
    sideOffset: ({anchor, positioner}) => -(anchor.height + positioner.height) / 2,
  },
}

export const InsideAnchorPlacement: Story = {
  render: function InsideAnchorPlacementExample() {
    const anchor = React.useRef<HTMLDivElement>(null)
    const [placement, setPlacement] = React.useState<InsidePlacement>('inside-top')

    return (
      <div className="space-y-4 p-4">
        <label className="block">
          Placement{' '}
          <select
            value={placement}
            onChange={event => {
              const next = insidePlacementOptions.find(value => value === event.target.value)
              if (!next) throw new Error(`Unknown placement: ${event.target.value}`)
              setPlacement(next)
            }}
          >
            {insidePlacementOptions.map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <ActionMenu>
          <ActionMenu.Button>Open anchored menu</ActionMenu.Button>
          <ActionMenu.Content
            {...insidePlacements[placement]}
            anchor={anchor}
            collisionAvoidance={{side: 'none', align: 'none'}}
            width="small"
          >
            <ActionMenu.Item>Copy link</ActionMenu.Item>
            <ActionMenu.Item>Share</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <div
          ref={anchor}
          className="h-64 w-[400px] max-w-full rounded-md border-thin border-default"
          data-testid="menu-anchor"
        />
      </div>
    )
  },
}

export const CollisionBoundary: Story = {
  render: function CollisionBoundaryExample() {
    const [boundary, setBoundary] = React.useState<HTMLDivElement | null>(null)
    const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null)
    const [useViewport, setUseViewport] = React.useState(false)

    return (
      <div className="space-y-4 p-4">
        <label className="block">
          <input checked={useViewport} onChange={event => setUseViewport(event.target.checked)} type="checkbox" /> Use
          viewport boundary
        </label>
        <div
          ref={setBoundary}
          className="relative h-52 w-80 max-w-full overflow-hidden rounded-md border-thin border-default"
          data-testid="menu-boundary"
        >
          <div className="absolute bottom-2 left-2">
            <ActionMenu>
              <ActionMenu.Button>Open positioned menu</ActionMenu.Button>
              <ActionMenu.Content
                collisionBoundary={useViewport ? [] : (boundary ?? [])}
                collisionPadding={8}
                container={portalContainer}
                positionMethod="fixed"
                side="bottom"
              >
                <ActionMenu.Item>Copy link</ActionMenu.Item>
                <ActionMenu.Item>Share</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu>
          </div>
        </div>
        <div ref={setPortalContainer} data-testid="menu-portal" />
      </div>
    )
  },
}

function NestedMenuDialogExample({portalInsideDialog = false}: {portalInsideDialog?: boolean}) {
  const [portalContainer, setPortalContainer] = React.useState<HTMLElement | null>(null)

  return (
    <BaseStyles ref={portalInsideDialog ? undefined : setPortalContainer} data-testid="dialog-portal-root">
      <Dialog disablePointerDismissal={portalInsideDialog}>
        <Dialog.Trigger render={<Button>Open settings</Button>} />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Repository settings</Dialog.Title>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            {portalInsideDialog ? <div ref={setPortalContainer} data-testid="dialog-menu-portal" /> : null}
            <ActionMenu>
              <ActionMenu.Button>Repository actions</ActionMenu.Button>
              <ActionMenu.Content container={portalContainer}>
                <ActionMenu.Item>Rename</ActionMenu.Item>
                <ActionMenu.Submenu>
                  <ActionMenu.SubmenuTrigger>Models</ActionMenu.SubmenuTrigger>
                  <ActionMenu.Content collisionBoundary={[]} container={portalContainer}>
                    <ActionMenu.Item>Fast model</ActionMenu.Item>
                    <ActionMenu.Item>Detailed model</ActionMenu.Item>
                  </ActionMenu.Content>
                </ActionMenu.Submenu>
              </ActionMenu.Content>
            </ActionMenu>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>
    </BaseStyles>
  )
}

export const NestedMenuInDialog: Story = {
  render: () => <NestedMenuDialogExample />,
}

export const NestedMenuInDialogPortal: Story = {
  render: () => <NestedMenuDialogExample portalInsideDialog />,
}

function CurrentModelSubmenuExample({variant = 'anchored'}: Pick<ActionMenuContentProps, 'variant'>) {
  const [model, setModel] = React.useState('Manual')
  const [tier, setTier] = React.useState('Balanced')
  const [unavailable, setUnavailable] = React.useState<'available' | 'inactive' | 'loading'>('available')
  const selected = model === 'Auto'
  return (
    <>
      <p role="status">
        Current model: {model}; tier: {tier}
      </p>
      <div className="mb-4 flex gap-2">
        <Button onClick={() => setUnavailable('available')}>Make available</Button>
        <Button onClick={() => setUnavailable('inactive')}>Make inactive</Button>
        <Button onClick={() => setUnavailable('loading')}>Load tiers</Button>
      </div>
      <ActionMenu defaultOpen>
        <ActionMenu.Button>Models</ActionMenu.Button>
        <ActionMenu.Content variant={variant}>
          <ActionMenu.Item
            role="menuitemradio"
            aria-checked={!selected}
            selected={!selected}
            onClick={() => setModel('Manual')}
          >
            Manual
          </ActionMenu.Item>
          <ActionMenu.Submenu>
            <ActionMenu.SubmenuTrigger
              role="menuitemradio"
              aria-checked={selected}
              selected={selected}
              inactiveText={unavailable === 'inactive' ? 'Requires model access' : undefined}
              loading={unavailable === 'loading'}
              loadingText="Loading model tiers"
            >
              <ActionMenu.LeadingVisual>
                <SparkleFillIcon />
              </ActionMenu.LeadingVisual>
              Auto
              <ActionMenu.Description variant="block">Optimized for your task</ActionMenu.Description>
              <ActionMenu.TrailingVisual>Recommended</ActionMenu.TrailingVisual>
            </ActionMenu.SubmenuTrigger>
            <ActionMenu.Content aria-label="Optimization" variant={variant}>
              <ActionMenu.RadioGroup
                value={tier}
                onValueChange={nextTier => {
                  setTier(nextTier)
                  setModel('Auto')
                }}
              >
                <ActionMenu.RadioItem value="Balanced">Balanced</ActionMenu.RadioItem>
                <ActionMenu.RadioItem value="Fast">Fast</ActionMenu.RadioItem>
              </ActionMenu.RadioGroup>
            </ActionMenu.Content>
          </ActionMenu.Submenu>
        </ActionMenu.Content>
      </ActionMenu>
    </>
  )
}

export const CurrentModelSubmenu: Story = {
  render: () => <CurrentModelSubmenuExample />,
  play: async ({canvasElement}) => {
    const document = within(canvasElement.ownerDocument.body)
    const trigger = await document.findByRole('menuitemradio', {name: 'Auto Recommended'})
    trigger.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(await document.findByRole('menuitemradio', {name: 'Fast'})).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-checked', 'false')
    await expect(document.getByRole('status')).toHaveTextContent('Current model: Manual')
    await userEvent.click(document.getByRole('menuitemradio', {name: 'Fast'}))
    await expect(document.getByRole('status')).toHaveTextContent('Current model: Auto; tier: Fast')
  },
}

export const FullscreenCurrentModelSubmenu: Story = {
  render: () => <CurrentModelSubmenuExample variant={{narrow: 'fullscreen'}} />,
}

export const InactiveItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto">
        <ProjectActions inactiveText="Unavailable due to an outage" />
        <GitHubProjectsGroup heading="Github projects" />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

const InternallyHandledButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & {onAttempt: () => void}
>(function InternallyHandledButton({onAttempt, onAuxClick, onClick, onKeyDown, onKeyUp, ...props}, ref) {
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      onAuxClick={event => {
        onAuxClick?.(event)
        onAttempt()
      }}
      onClick={event => {
        onClick?.(event)
        onAttempt()
      }}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (event.key === 'Enter' || event.key === ' ') onAttempt()
      }}
      onKeyUp={event => {
        onKeyUp?.(event)
        if (event.key === 'Enter' || event.key === ' ') onAttempt()
      }}
    />
  )
})

export const DisabledCustomRender: Story = {
  render: function DisabledCustomRenderStory() {
    const [inactive, setInactive] = React.useState(true)
    const [attempts, setAttempts] = React.useState(0)
    const [activationCaptures, setActivationCaptures] = React.useState(0)
    const [otherCaptures, setOtherCaptures] = React.useState(0)
    const onAttempt = () => setAttempts(current => current + 1)
    const onActivationCapture = () => setActivationCaptures(current => current + 1)
    const captureHandlers = {
      onAuxClickCapture: onActivationCapture,
      onClickCapture: onActivationCapture,
      onKeyDownCapture: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') onActivationCapture()
        if (event.key === 'ArrowDown') setOtherCaptures(current => current + 1)
      },
      onKeyUpCapture: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') onActivationCapture()
        if (event.key === 'Shift') setOtherCaptures(current => current + 1)
      },
    }

    return (
      <>
        <ActionList.Listbox aria-label="Projects" selectionVariant="single">
          <ActionList.Item
            inactiveText={inactive ? 'Requires access' : undefined}
            render={<InternallyHandledButton onAttempt={onAttempt} />}
          >
            Transfer selection
          </ActionList.Item>
          <ActionList.Item>Available selection</ActionList.Item>
          <ActionList.Item
            inactiveText={inactive ? 'Requires access' : undefined}
            render={<button {...captureHandlers} type="button" />}
          >
            Capture selection
          </ActionList.Item>
        </ActionList.Listbox>
        <ActionMenu>
          <ActionMenu.Button>Project actions</ActionMenu.Button>
          <ActionMenu.Content>
            <ActionMenu.Item
              closeOnClick={false}
              inactiveText={inactive ? 'Requires access' : undefined}
              nativeButton
              render={<InternallyHandledButton onAttempt={onAttempt} />}
            >
              Transfer action
            </ActionMenu.Item>
            <ActionMenu.Item>Available action</ActionMenu.Item>
            <ActionMenu.Item
              closeOnClick={false}
              inactiveText={inactive ? 'Requires access' : undefined}
              nativeButton
              render={props => <button {...props} {...captureHandlers} type="button" />}
            >
              Capture action
            </ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu>
        <Button onClick={() => setInactive(current => !current)}>
          {inactive ? 'Make available' : 'Make inactive'}
        </Button>
        <p role="status">Internal activations: {attempts}</p>
        <p data-testid="capture-status">
          Activation captures: {activationCaptures}; other captures: {otherCaptures}
        </p>
      </>
    )
  },
}

export const LoadingItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto">
        <ActionMenu.Item loading onClick={() => notifyClicked('Workflows')}>
          <ActionMenu.LeadingVisual>
            <WorkflowIcon />
          </ActionMenu.LeadingVisual>
          Workflows
        </ActionMenu.Item>
        <ActionMenu.Item loading onClick={() => notifyClicked('Archived items')}>
          <ActionMenu.LeadingVisual>
            <ArchiveIcon />
          </ActionMenu.LeadingVisual>
          Archived items
        </ActionMenu.Item>
        <ActionMenu.Item loading onClick={() => notifyClicked('Make a copy')}>
          <ActionMenu.LeadingVisual>
            <CopyIcon />
          </ActionMenu.LeadingVisual>
          Make a copy
        </ActionMenu.Item>
        <GitHubProjectsGroup heading="Github projects" />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const Submenus: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Edit</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item>Cut</ActionMenu.Item>
        <ActionMenu.Item>Copy</ActionMenu.Item>
        <ActionMenu.Item>Paste</ActionMenu.Item>
        <ActionMenu.Submenu>
          <ActionMenu.SubmenuTrigger>
            <ActionMenu.LeadingVisual>
              <SparkleFillIcon />
            </ActionMenu.LeadingVisual>
            Paste special
          </ActionMenu.SubmenuTrigger>
          <ActionMenu.Content>
            <ActionMenu.Item>Paste plain text</ActionMenu.Item>
            <ActionMenu.Item>Paste formulas</ActionMenu.Item>
            <ActionMenu.Item>Paste with formatting</ActionMenu.Item>
            <ActionMenu.Submenu>
              <ActionMenu.SubmenuTrigger>Paste from</ActionMenu.SubmenuTrigger>
              <ActionMenu.Content>
                <ActionMenu.Item>Current clipboard</ActionMenu.Item>
                <ActionMenu.Item>History</ActionMenu.Item>
                <ActionMenu.Item>Another device</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu.Submenu>
          </ActionMenu.Content>
        </ActionMenu.Submenu>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const InlineSubmenu: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Edit</ActionMenu.Button>
      <ActionMenu.Content>
        <ActionMenu.Item>Copy</ActionMenu.Item>
        <ActionMenu.Submenu>
          <ActionMenu.SubmenuTrigger nativeButton render={<button type="button" />}>
            Paste special
          </ActionMenu.SubmenuTrigger>
          <ActionMenu.Content portal={false}>
            <ActionMenu.Item>Paste plain text</ActionMenu.Item>
            <ActionMenu.Submenu>
              <ActionMenu.SubmenuTrigger>Paste from</ActionMenu.SubmenuTrigger>
              <ActionMenu.Content portal={false}>
                <ActionMenu.Item>Current clipboard</ActionMenu.Item>
                <ActionMenu.Item>History</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu.Submenu>
          </ActionMenu.Content>
        </ActionMenu.Submenu>
      </ActionMenu.Content>
    </ActionMenu>
  ),
}

export const DisabledItems: Story = {
  render: () => (
    <ActionMenu>
      <ActionMenu.Button>Open menu</ActionMenu.Button>
      <ActionMenu.Content width="auto">
        <ActionMenu.Item disabled>
          <ActionMenu.LeadingVisual>
            <WorkflowIcon />
          </ActionMenu.LeadingVisual>
          Workflows
        </ActionMenu.Item>
        <ActionMenu.Item>
          <ActionMenu.LeadingVisual>
            <ArchiveIcon />
          </ActionMenu.LeadingVisual>
          Archived items
        </ActionMenu.Item>
        <ActionMenu.LinkItem href="/">
          <ActionMenu.LeadingVisual>
            <GearIcon />
          </ActionMenu.LeadingVisual>
          Settings
        </ActionMenu.LinkItem>
        <ActionMenu.Item disabled>
          <ActionMenu.LeadingVisual>
            <CopyIcon />
          </ActionMenu.LeadingVisual>
          Make a copy
        </ActionMenu.Item>
        <GitHubProjectsGroup heading="Github projects" />
      </ActionMenu.Content>
    </ActionMenu>
  ),
}
