import type {Meta, StoryObj} from '@storybook/react-vite'
import {Popover as BasePopover} from '@base-ui/react/popover'
import React from 'react'
import {ActionBar} from '../ActionBar'
import {ActionMenu} from '../ActionMenu'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {Heading} from '../Heading'
import {Stack} from '../Stack'
import {AnchoredOverlay, type AnchoredOverlayContentProps} from './AnchoredOverlay'
import {HoverCard} from './AnchoredOverlay.storyHelpers'

const meta = {
  title: 'React Tailwind/Components/AnchoredOverlay/Features',
  component: AnchoredOverlay,
} satisfies Meta<typeof AnchoredOverlay>

export default meta
type Story = StoryObj<typeof meta>

type HoverCardOverlayProps = Pick<
  AnchoredOverlayContentProps,
  'align' | 'alignOffset' | 'height' | 'portal' | 'side' | 'sideOffset' | 'width'
> & {
  triggerBlock?: boolean
  triggerId?: string
}

/** Upstream's feature stories open the user hover card from a single button. */
const HoverCardOverlay = ({triggerBlock, triggerId, ...contentProps}: HoverCardOverlayProps) => (
  <AnchoredOverlay>
    <AnchoredOverlay.Trigger
      render={
        <Button block={triggerBlock} id={triggerId}>
          Button
        </Button>
      }
    />
    <AnchoredOverlay.Content {...contentProps} aria-label="User Card Overlay" className="min-w-80" role="dialog">
      <HoverCard />
    </AnchoredOverlay.Content>
  </AnchoredOverlay>
)

/** The hover card stretched to fill the overlay, as upstream's positioning stories render it. */
const FillHoverCard = () => (
  <div className="flex size-full flex-col">
    <HoverCard />
  </div>
)

type AnchorPositionOverlayProps = {
  label: string
  triggerLabel?: string
}

/** Upstream's positioning stories open the filling hover card from an "Open Overlay" button. */
const AnchorPositionOverlay = ({label, triggerLabel = 'Open Overlay'}: AnchorPositionOverlayProps) => (
  <AnchoredOverlay>
    <AnchoredOverlay.Trigger render={<Button>{triggerLabel}</Button>} />
    <AnchoredOverlay.Content aria-label={label} role="dialog">
      <FillHoverCard />
    </AnchoredOverlay.Content>
  </AnchoredOverlay>
)

export const PortalInsideScrollingElement: Story = {
  render: () => (
    <div className="absolute inset-0 w-full p-6">
      <Heading>Header or some such</Heading>
      {/* lint-tailwind-disable-next-line -- matches the upstream fixture's `powderblue` scroll region */}
      <div className="absolute inset-x-6 bottom-6 top-24 overflow-scroll bg-[#b0e0e6]">
        <table>
          <tbody>
            {Array.from({length: 20}, (_, row) => (
              <tr key={row}>
                {Array.from({length: 10}, (_, column) => (
                  <td key={column}>
                    <div className="m-2">
                      <HoverCardOverlay portal={false} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
}
export const CustomAnchorId: Story = {
  render: () => <HoverCardOverlay triggerId="my-custom-anchor-id" />,
}
export const Height: Story = {
  render: () => <HoverCardOverlay height="large" />,
}
export const Width: Story = {
  render: () => <HoverCardOverlay width="large" />,
}
export const AnchorAlignment: Story = {
  render: () => <HoverCardOverlay align="center" triggerBlock />,
}
export const AnchorSide: Story = {
  render: () => <HoverCardOverlay side="right" />,
}
export const OffsetPositionFromAnchor: Story = {
  render: () => <HoverCardOverlay sideOffset={100} />,
}
export const OffsetAlignmentFromAnchor: Story = {
  render: () => <HoverCardOverlay alignOffset={100} />,
}

function FocusTrapOverridesExample() {
  const initialFocusRef = React.useRef<HTMLButtonElement>(null)
  return (
    <AnchoredOverlay modal="trap-focus">
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content
        aria-label="Focus Trap Demo Overlay"
        className="min-w-80"
        initialFocus={initialFocusRef}
        role="dialog"
      >
        <Button>First button</Button>
        <Button ref={initialFocusRef}>Initial focus</Button>
        {/* Base UI traps focus only when the popup has a Close part, so screen reader users can always exit. */}
        <AnchoredOverlay.Close render={<Button />}>Close</AnchoredOverlay.Close>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  )
}

export const FocusTrapOverrides: Story = {
  render: () => <FocusTrapOverridesExample />,
}

/** Roving focus comes from composing a toolbar inside the content rather than from overlay settings. */
export const FocusZoneOverrides: Story = {
  render: () => (
    <AnchoredOverlay modal="trap-focus">
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content aria-label="Focus Zone Demo Overlay" className="min-w-80" role="dialog">
        <p>
          Use <kbd>←</kbd> and <kbd>→</kbd> keys to move focus.
        </p>
        <ActionBar aria-label="Focus zone demo">
          <ActionBar.Button>First</ActionBar.Button>
          <ActionBar.Button>Second</ActionBar.Button>
          <ActionBar.Button>Third</ActionBar.Button>
        </ActionBar>
        <AnchoredOverlay.Close render={<Button />}>Close</AnchoredOverlay.Close>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}

function NestedMenuFocusExample({separate}: {separate?: boolean}) {
  const [separatePortal, setSeparatePortal] = React.useState<HTMLDivElement | null>(null)
  return (
    <>
      {separate ? (
        <>
          <p>Known Base UI focus issue: a menu in a separate portal can leave its trigger out of the tab order.</p>
          <div ref={setSeparatePortal} data-testid="separate-menu-portal" />
        </>
      ) : null}
      <AnchoredOverlay>
        <AnchoredOverlay.Trigger render={<Button>Open overlay</Button>} />
        <AnchoredOverlay.Content aria-label="Overlay actions" role="dialog">
          <Stack gap="normal" padding="normal">
            <Button>Before menu</Button>
            <ActionMenu>
              <ActionMenu.Button>More actions</ActionMenu.Button>
              <ActionMenu.Content container={separate ? separatePortal : undefined}>
                <ActionMenu.Item>Copy</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu>
            <Button>After menu</Button>
          </Stack>
        </AnchoredOverlay.Content>
      </AnchoredOverlay>
    </>
  )
}

export const NestedMenuFocus: Story = {
  render: () => <NestedMenuFocusExample />,
}

export const SeparatePortalFocusReproduction: Story = {
  tags: ['!autodocs'],
  render: () => <NestedMenuFocusExample separate />,
}

export const MenuInsideBaseUiPortal: Story = {
  render: function MenuInsideBaseUiPortalExample() {
    const [overlayRoot, setOverlayRoot] = React.useState<HTMLDivElement | null>(null)
    const [overlayPortal, setOverlayPortal] = React.useState<HTMLDivElement | null>(null)
    return (
      <>
        <div ref={setOverlayRoot} data-testid="base-ui-overlay-root" />
        <BasePopover.Root modal={false}>
          <BasePopover.Trigger render={<Button>Open Base UI overlay</Button>} />
          <BasePopover.Portal container={overlayRoot} ref={setOverlayPortal}>
            <BasePopover.Positioner sideOffset={4}>
              <BasePopover.Popup
                aria-label="Base UI overlay actions"
                className="rounded-lg bg-default p-3 shadow-floating-sm"
                role="dialog"
              >
                <Stack gap="normal">
                  <Button>Before menu</Button>
                  <ActionMenu>
                    <ActionMenu.Button>More actions</ActionMenu.Button>
                    <ActionMenu.Content container={overlayPortal}>
                      <ActionMenu.Item>Copy</ActionMenu.Item>
                    </ActionMenu.Content>
                  </ActionMenu>
                  <Button>After menu</Button>
                </Stack>
              </BasePopover.Popup>
            </BasePopover.Positioner>
          </BasePopover.Portal>
        </BasePopover.Root>
      </>
    )
  },
}

export const OverlayPropsOverrides: Story = {
  render: () => (
    <AnchoredOverlay>
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content
        aria-label="User Card Overlay"
        className="min-w-80 overflow-auto"
        maxHeight="xsmall"
        role="dialog"
      >
        <div>Overlay props have been overridden to set: </div>
        <ul className="font-mono">
          <li>overflow: `auto`</li>
          <li>maxHeight: `xsmall`</li>
        </ul>
        <HoverCard />
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const FullscreenVariant: Story = {
  render: () => (
    <AnchoredOverlay modal>
      <AnchoredOverlay.Trigger render={<Button>Open Fullscreen on Narrow</Button>} />
      <AnchoredOverlay.Content
        aria-label="Fullscreen Overlay Demo"
        className="min-w-80"
        role="dialog"
        variant={{narrow: 'fullscreen', regular: 'anchored'}}
        width="large"
      >
        <Stack gap="normal" padding="normal">
          <Heading>Fullscreen Overlay Demo</Heading>
          <div>
            This overlay will appear fullscreen on narrow viewports (less than 768px) and as a regular anchored overlay
            on wider screens.
          </div>
          <div>
            Try resizing your browser window to see the responsive behavior in action. The overlay includes a close
            button when in fullscreen mode.
          </div>
          <HoverCard />
        </Stack>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const CenteredOnPage: Story = {
  render: () => (
    <div className="flex min-h-[300vh] min-w-[300vw] items-center justify-center">
      <AnchorPositionOverlay label="Centered Overlay Demo" />
    </div>
  ),
}

const gridPositions = [
  {row: 'start', col: 'start'},
  {row: 'start', col: 'center'},
  {row: 'start', col: 'end'},
  {row: 'center', col: 'start'},
  {row: 'center', col: 'center'},
  {row: 'center', col: 'end'},
  {row: 'end', col: 'start'},
  {row: 'end', col: 'center'},
  {row: 'end', col: 'end'},
]

export const AnchorPositionGrid: Story = {
  render: () => (
    <div className="h-screen w-screen overflow-auto">
      <div className="flex min-h-[200vh] min-w-[200vw] items-center justify-center">
        <div className="grid h-1/2 w-1/2 grid-cols-3 grid-rows-3">
          {gridPositions.map(({row, col}) => (
            <div
              key={`${row}-${col}`}
              className="relative flex h-[200px] items-center justify-center border-thin border-default p-4"
            >
              <span className="absolute left-2 top-2 text-body-small text-muted">
                {row} / {col}
              </span>
              {row === 'center' && col === 'center' ? (
                <AnchorPositionOverlay label="Anchor Position Grid Demo" triggerLabel="Anchor" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}
export const ScrollWithAnchor: Story = {
  render: () => (
    <div className="relative h-[400px] overflow-auto rounded-md border-thin border-default">
      <div className="flex h-[1200px] items-center justify-center p-4">
        <AnchorPositionOverlay label="Scroll With Anchor Demo" />
      </div>
    </div>
  ),
}
export const WithinDialog: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog.Content width="large">
        <Dialog.Header>
          <Dialog.Title>Dialog with Anchored Overlay</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <div className="h-[2000px] p-4">
            <p className="mb-4">The overlay below is anchor-positioned within a dialog.</p>
            <AnchorPositionOverlay label="Within Dialog Demo" />
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  ),
}
export const WithinNestedDialog: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog.Content width="large">
        <Dialog.Header>
          <Dialog.Title>Outer Dialog</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <div className="h-[2000px] p-4">
            <p className="mb-4">This is the outer dialog. Open the inner dialog to test nested anchor positioning.</p>
            <Dialog>
              <Dialog.Trigger render={<Button>Open Inner Dialog</Button>} />
              <Dialog.Content width="medium">
                <Dialog.Header>
                  <Dialog.Title>Inner Dialog</Dialog.Title>
                  <Dialog.CloseButton />
                </Dialog.Header>
                <Dialog.Body>
                  <div className="h-[2000px] p-4">
                    <p className="mb-4">The overlay below is anchor-positioned inside a nested dialog.</p>
                    <AnchorPositionOverlay label="Nested Dialog Demo" />
                  </div>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog>
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  ),
}
export const WithinDialogOverflowing: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog.Content width="small">
        <Dialog.Header>
          <Dialog.Title>Overflow Test</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex h-[2000px] justify-end p-4">
            <p className="mb-4">
              The anchor is positioned near the edge. The overlay should flip when it would overflow the viewport.
            </p>
            <AnchorPositionOverlay label="Dialog Overflow Demo" />
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  ),
}

/** External anchors toggle their overlay themselves, since no trigger part is registered for them. */
function MultipleOverlaysExample() {
  const [openOverlay, setOpenOverlay] = React.useState<string | null>(null)
  const externalAnchorRefA = React.useRef<HTMLButtonElement>(null)
  const externalAnchorRefB = React.useRef<HTMLButtonElement>(null)

  const handleOpenChange = (key: string) => (nextOpen: boolean) =>
    setOpenOverlay(current => (nextOpen ? key : current === key ? null : current))
  const toggle = (key: string) => () => setOpenOverlay(openOverlay === key ? null : key)

  return (
    <Stack direction="horizontal" gap="normal" align="start" padding="normal">
      <AnchoredOverlay open={openOverlay === 'render-1'} onOpenChange={handleOpenChange('render-1')}>
        <AnchoredOverlay.Trigger render={<Button>renderAnchor 1</Button>} />
        <AnchoredOverlay.Content aria-label="Overlay 1" role="dialog">
          <FillHoverCard />
        </AnchoredOverlay.Content>
      </AnchoredOverlay>

      <Button ref={externalAnchorRefA} onClick={toggle('external-1')}>
        External anchor 1
      </Button>
      <AnchoredOverlay open={openOverlay === 'external-1'} onOpenChange={handleOpenChange('external-1')}>
        <AnchoredOverlay.Content
          anchor={externalAnchorRefA}
          aria-label="Overlay 2"
          finalFocus={externalAnchorRefA}
          role="dialog"
        >
          <FillHoverCard />
        </AnchoredOverlay.Content>
      </AnchoredOverlay>

      <AnchoredOverlay open={openOverlay === 'render-2'} onOpenChange={handleOpenChange('render-2')}>
        <AnchoredOverlay.Trigger render={<Button>renderAnchor 2</Button>} />
        <AnchoredOverlay.Content aria-label="Overlay 3" role="dialog">
          <FillHoverCard />
        </AnchoredOverlay.Content>
      </AnchoredOverlay>

      <Button ref={externalAnchorRefB} onClick={toggle('external-2')}>
        External anchor 2
      </Button>
      <AnchoredOverlay open={openOverlay === 'external-2'} onOpenChange={handleOpenChange('external-2')}>
        <AnchoredOverlay.Content
          anchor={externalAnchorRefB}
          aria-label="Overlay 4"
          finalFocus={externalAnchorRefB}
          role="dialog"
        >
          <FillHoverCard />
        </AnchoredOverlay.Content>
      </AnchoredOverlay>
    </Stack>
  )
}

export const MultipleOverlays: Story = {
  render: () => <MultipleOverlaysExample />,
}
export const WithinStickyElement: Story = {
  render: () => (
    <div className="relative h-[400px] overflow-auto rounded-md border-thin border-default">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-default bg-default px-4 py-2">
        <Heading as="h3">Sticky Header</Heading>
        <AnchorPositionOverlay label="Sticky Element Demo" />
      </div>
      <div className="h-[1200px] p-4">
        <p>Scroll down to test that the overlay stays anchored to the button in the sticky header.</p>
      </div>
    </div>
  ),
}
