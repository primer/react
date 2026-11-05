import type {Meta, StoryObj} from '@storybook/react-vite'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {Heading} from '../Heading'
import {AnchoredOverlay} from './AnchoredOverlay'

const meta = {
  title: 'React Tailwind/Components/AnchoredOverlay/Features',
  component: AnchoredOverlay,
} satisfies Meta<typeof AnchoredOverlay>

export default meta
type Story = StoryObj<typeof meta>

type FixtureProps = {
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  modal?: boolean | 'trap-focus'
  className?: string
  long?: boolean
  triggerBlock?: boolean
  triggerLabel?: string
}

const Fixture = ({
  align = 'start',
  side = 'bottom',
  modal,
  className,
  long,
  triggerBlock,
  triggerLabel = 'Button',
}: FixtureProps) => (
  <AnchoredOverlay modal={modal}>
    <AnchoredOverlay.Trigger render={<Button block={triggerBlock}>{triggerLabel}</Button>} />
    <AnchoredOverlay.Content align={align} side={side} className={className} role="dialog">
      <AnchoredOverlay.Title>Overlay title</AnchoredOverlay.Title>
      <AnchoredOverlay.Description>
        {long
          ? 'Long content remains readable while the anchored surface scrolls within the viewport. '.repeat(12)
          : 'Anchored overlay content.'}
      </AnchoredOverlay.Description>
      <div className="mt-4 flex gap-2">
        <button type="button">First action</button>
        <AnchoredOverlay.Close>Close overlay</AnchoredOverlay.Close>
      </div>
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
                      <Fixture />
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
  render: () => <Fixture />,
}
export const Height: Story = {
  render: () => <Fixture className="max-h-48 overflow-auto" />,
}
export const Width: Story = {
  render: () => <Fixture className="w-96" />,
}
export const AnchorAlignment: Story = {
  render: () => <Fixture align="center" triggerBlock />,
}
export const AnchorSide: Story = {
  render: () => <Fixture side="right" />,
}
export const OffsetPositionFromAnchor: Story = {
  render: () => <Fixture side="top" />,
}
export const OffsetAlignmentFromAnchor: Story = {
  render: () => <Fixture align="end" />,
}
export const FocusTrapOverrides: Story = {
  render: () => <Fixture modal="trap-focus" />,
}
export const FocusZoneOverrides: Story = {
  render: () => (
    <AnchoredOverlay modal="trap-focus">
      <AnchoredOverlay.Trigger render={<Button>Button</Button>} />
      <AnchoredOverlay.Content role="dialog">
        <AnchoredOverlay.Title>Overlay title</AnchoredOverlay.Title>
        <button type="button">First</button>
        <button type="button">Second</button>
        <button type="button">Third</button>
      </AnchoredOverlay.Content>
    </AnchoredOverlay>
  ),
}
export const OverlayPropsOverrides: Story = {
  render: () => <Fixture className="max-h-32 overflow-auto" />,
}
export const FullscreenVariant: Story = {
  render: () => <Fixture long triggerLabel="Open Fullscreen on Narrow" />,
}
export const CenteredOnPage: Story = {
  render: () => (
    <div className="flex min-h-[300vh] min-w-[300vw] items-center justify-center">
      <Fixture align="center" triggerLabel="Open Overlay" />
    </div>
  ),
}
export const AnchorPositionGrid: Story = {
  render: () => (
    <div className="h-screen w-screen overflow-auto">
      <div className="flex min-h-[200vh] min-w-[200vw] items-center justify-center">
        <div className="grid h-1/2 w-1/2 grid-cols-3 grid-rows-3">
          {[
            ['start', 'start'],
            ['start', 'center'],
            ['start', 'end'],
            ['center', 'start'],
            ['center', 'center'],
            ['center', 'end'],
            ['end', 'start'],
            ['end', 'center'],
            ['end', 'end'],
          ].map(([row, column]) => (
            <div
              key={`${row}-${column}`}
              className="relative flex h-[200px] items-center justify-center border border-default p-4"
            >
              <span className="absolute left-2 top-2 text-xs leading-[18px] text-muted">
                {row} / {column}
              </span>
              {row === 'center' && column === 'center' ? <Fixture triggerLabel="Anchor" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}
export const ScrollWithAnchor: Story = {
  render: () => (
    <div className="relative h-[400px] overflow-auto rounded-md border border-default">
      <div className="flex h-[1200px] items-center justify-center p-4">
        <Fixture triggerLabel="Open Overlay" />
      </div>
    </div>
  ),
}
export const WithinDialog: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Dialog with Anchored Overlay</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body className="h-[2000px]">
          <p className="mb-4">The overlay below uses CSS anchor positioning within a dialog.</p>
          <Fixture triggerLabel="Open Overlay" />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  ),
}
export const WithinNestedDialog: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Outer Dialog</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-4">This is the outer dialog. Open the inner dialog to test nested anchor positioning.</p>
          <Dialog>
            <Dialog.Trigger render={<Button>Open Inner Dialog</Button>} />
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Inner Dialog</Dialog.Title>
                <Dialog.CloseButton />
              </Dialog.Header>
              <Dialog.Body className="h-[2000px]">
                <p className="mb-4">The overlay below uses CSS anchor positioning inside a nested dialog.</p>
                <Fixture triggerLabel="Open Overlay" />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  ),
}
export const WithinDialogOverflowing: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button>Open Dialog</Button>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Overflow Test</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body className="flex h-[2000px] justify-end">
          <p className="mb-4">
            The anchor is positioned near the edge. The overlay should flip when it would overflow the viewport.
          </p>
          <Fixture side="left" triggerLabel="Open Overlay" />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  ),
}
export const MultipleOverlays: Story = {
  render: () => (
    <div className="flex items-start gap-4 p-4">
      <Fixture triggerLabel="renderAnchor 1" />
      <Fixture triggerLabel="External anchor 1" />
      <Fixture triggerLabel="renderAnchor 2" />
      <Fixture triggerLabel="External anchor 2" />
    </div>
  ),
}
export const WithinStickyElement: Story = {
  render: () => (
    <div className="relative h-[400px] overflow-auto rounded-md border border-default">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-default bg-default px-4 py-2">
        <Heading as="h3">Sticky Header</Heading>
        <Fixture triggerLabel="Open Overlay" />
      </div>
      <div className="h-[1200px] p-4">
        <p>Scroll down to test that the overlay stays anchored to the button in the sticky header.</p>
      </div>
    </div>
  ),
}
