import type React from 'react'
import {useEffect, useRef, useState, type JSX} from 'react'
import type {Args, Meta} from '@storybook/react-vite'
import {FocusKeys} from '@primer/behaviors'
import {Avatar, Dialog, Link, Text} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import Heading from '../Heading'
import Octicon from '../Octicon'
import {Button} from '../Button'
import {registerPortalRoot} from '../Portal'
import {Playground} from './AnchoredOverlay.stories'
import {LocationIcon, RepoIcon} from '@primer/octicons-react'
import {Stack} from '../Stack/Stack'
import classes from './AnchoredOverlay.features.stories.module.css'

export default {
  title: 'Components/AnchoredOverlay/Features',
  component: AnchoredOverlay,
} as Meta

const hoverCard = (
  <Stack gap="condensed" style={{padding: '16px'}}>
    <Stack direction="horizontal" gap="condensed" justify="space-between">
      <Avatar src="https://avatars.githubusercontent.com/u/7143434?v=4" size={48} />
      <Button size="small">Follow</Button>
    </Stack>
    <Stack direction="horizontal" gap="none">
      <span className={classes.UserName}>monalisa</span>
      <span className={classes.UserMeta}>
        <Link inline muted href="#">
          Monalisa Octocat
        </Link>
      </span>
    </Stack>
    <span className={classes.Bio}>
      Former beach cat and champion swimmer. Now your friendly octopus with a normal face.
    </span>
    <Stack direction="horizontal" gap="none">
      <Octicon className={classes.Icon} icon={LocationIcon} />
      <span className={classes.MetaMuted}>Interwebs</span>
    </Stack>
    <Stack direction="horizontal" gap="none">
      <Octicon className={classes.Icon} icon={RepoIcon} />
      <span className={classes.MetaMuted}>Owns this repository</span>
    </Stack>
  </Stack>
)

const HeaderAndLayout = ({children}: {children: JSX.Element}) => {
  const scrollingElementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollingElementRef.current) {
      registerPortalRoot(scrollingElementRef.current, 'scrollingPortal')
    }
  }, [scrollingElementRef])
  return (
    <div className={classes.HeaderAndLayout}>
      <Heading>Header or some such</Heading>
      <div className={classes.ScrollingRegion}>
        {children}
        <div ref={scrollingElementRef} className={classes.PortalRootRegion} />
      </div>
    </div>
  )
}

export const PortalInsideScrollingElement = (args: Args) => {
  const rows = 20
  const columns = 10
  return (
    <HeaderAndLayout>
      <table>
        <tbody>
          {Array(rows)
            .fill(null)
            .map((_, i) => (
              <tr key={i}>
                {Array(columns)
                  .fill(null)
                  .map((_1, j) => (
                    <td key={`${i}${j}`}>
                      <div className={classes.PlaygroundCell}>
                        <Playground {...{...args, portalContainerName: 'scrollingPortal'}} />
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </HeaderAndLayout>
  )
}

export const CustomAnchorId = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      anchorId="my-custom-anchor-id"
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const Height = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      height="large"
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const Width = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      width="large"
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const AnchorAlignment = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => (
        <Button {...props} block>
          Button
        </Button>
      )}
      align="center"
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const AnchorSide = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      side="outside-right"
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const OffsetPositionFromAnchor = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      anchorOffset={100}
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const OffsetAlignmentFromAnchor = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      alignmentOffset={100}
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const FocusTrapOverrides = () => {
  const initialFocusRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      focusTrapSettings={{initialFocusRef}}
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'Focus Trap Demo Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <Button>First button</Button>
      <Button ref={initialFocusRef}>Initial focus</Button>
    </AnchoredOverlay>
  )
}

export const FocusZoneOverrides = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      focusZoneSettings={{bindKeys: FocusKeys.JK}}
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'Focus Zone Demo Overlay',
        className: classes.Overlay,
      }}
      preventOverflow={false}
    >
      <p>
        Use <kbd>J</kbd> and <kbd>K</kbd> keys to move focus.
      </p>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </AnchoredOverlay>
  )
}

export const OverlayPropsOverrides = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Button</Button>}
      overlayProps={{
        overflow: 'auto',
        maxHeight: 'xsmall',
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'User Card Overlay',
        className: classes.Overlay,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
    >
      <div>Overlay props have been overridden to set: </div>
      <pre>
        <li>overflow: `auto`</li>
        <li>maxHeight: `xsmall`</li>
      </pre>
      <div className={classes.FlexColFill}>{hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const FullscreenVariant = () => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Open Fullscreen on Narrow</Button>}
      variant={{narrow: 'fullscreen', regular: 'anchored'}}
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': 'Fullscreen Overlay Demo',
        className: classes.Overlay,
        overflow: 'auto',
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
      width="large"
    >
      <div className={classes.FlexColFill}>
        <Stack gap="normal" style={{padding: '16px'}}>
          <Heading>Fullscreen Overlay Demo</Heading>
          <div>
            This overlay will appear fullscreen on narrow viewports (less than 768px) and as a regular anchored overlay
            on wider screens.
          </div>
          <div>
            Try resizing your browser window to see the responsive behavior in action. The overlay includes a close
            button when in fullscreen mode.
          </div>
          {hoverCard}
        </Stack>
      </div>
    </AnchoredOverlay>
  )
}

export const CenteredOnPage = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className={classes.CenteredTrigger}>
      <AnchoredOverlay
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderAnchor={props => <Button {...props}>Open Overlay</Button>}
        overlayProps={{
          role: 'dialog',
          'aria-modal': true,
          'aria-label': 'Centered Overlay Demo',
        }}
        focusZoneSettings={{disabled: true}}
        preventOverflow={false}
        preventAnchorPositioning={true}
        preventPortal={true}
      >
        <div className={classes.FlexColFill}>{hoverCard}</div>
      </AnchoredOverlay>
    </div>
  )
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

export const AnchorPositionGrid = () => {
  const [openCell, setOpenCell] = useState<string | null>(null)

  return (
    <div className={classes.AnchorGridContainer}>
      <div className={classes.AnchorGrid}>
        <div className={classes.AnchorGridInner}>
          {gridPositions.map(({row, col}) => {
            const key = `${row}-${col}`
            const isCenter = row === 'center' && col === 'center'

            return (
              <div key={key} className={classes.AnchorGridCell}>
                <span className={classes.AnchorGridLabel}>
                  {row} / {col}
                </span>
                {isCenter ? (
                  <AnchoredOverlay
                    open={openCell === key}
                    onOpen={() => setOpenCell(key)}
                    onClose={() => setOpenCell(null)}
                    renderAnchor={props => (
                      <Button popoverTarget="popover_1" {...props}>
                        Anchor
                      </Button>
                    )}
                    overlayProps={{
                      role: 'dialog',
                      'aria-modal': true,
                      'aria-label': 'Anchor Position Grid Demo',
                    }}
                    focusZoneSettings={{disabled: true}}
                    preventOverflow={false}
                    preventAnchorPositioning={true}
                    preventPortal={true}
                    popover
                  >
                    <div className={classes.FlexColFill}>{hoverCard}</div>
                  </AnchoredOverlay>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const AnchorPositionOverlay = ({
  children,
  label = 'CSS Anchor Position Demo',
}: {
  children?: React.ReactNode
  label?: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderAnchor={props => <Button {...props}>Open Overlay</Button>}
      overlayProps={{
        role: 'dialog',
        'aria-modal': true,
        'aria-label': label,
      }}
      focusZoneSettings={{disabled: true}}
      preventOverflow={false}
      preventAnchorPositioning={true}
      preventPortal={true}
    >
      <div className={classes.FlexColFill}>{children ?? hoverCard}</div>
    </AnchoredOverlay>
  )
}

export const ScrollWithAnchor = () => {
  return (
    <div className={classes.ScrollContainer}>
      <div className={classes.ScrollContent}>
        <AnchorPositionOverlay label="Scroll With Anchor Demo" />
      </div>
    </div>
  )
}

export const WithinDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
      {isDialogOpen && (
        <Dialog title="Dialog with Anchored Overlay" onClose={() => setIsDialogOpen(false)} width="large">
          <div className={classes.DialogBody}>
            <Text as="p" style={{marginBottom: '16px'}}>
              The overlay below uses CSS anchor positioning within a dialog.
            </Text>
            <AnchorPositionOverlay label="Within Dialog Demo" />
          </div>
        </Dialog>
      )}
    </div>
  )
}

export const WithinNestedDialog = () => {
  const [isOuterOpen, setIsOuterOpen] = useState(false)
  const [isInnerOpen, setIsInnerOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsOuterOpen(true)}>Open Dialog</Button>
      {isOuterOpen && (
        <Dialog title="Outer Dialog" onClose={() => setIsOuterOpen(false)} width="large">
          <div className={classes.DialogBody}>
            <Text as="p" style={{marginBottom: '16px'}}>
              This is the outer dialog. Open the inner dialog to test nested anchor positioning.
            </Text>
            <Button onClick={() => setIsInnerOpen(true)}>Open Inner Dialog</Button>
            {isInnerOpen && (
              <Dialog title="Inner Dialog" onClose={() => setIsInnerOpen(false)} width="medium">
                <div className={classes.DialogBody}>
                  <Text as="p" style={{marginBottom: '16px'}}>
                    The overlay below uses CSS anchor positioning inside a nested dialog.
                  </Text>
                  <AnchorPositionOverlay label="Nested Dialog Demo" />
                </div>
              </Dialog>
            )}
          </div>
        </Dialog>
      )}
    </div>
  )
}

export const WithinDialogOverflowing = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
      {isDialogOpen && (
        <Dialog title="Overflow Test" onClose={() => setIsDialogOpen(false)} width="small">
          <div className={classes.DialogBody} style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Text as="p" style={{marginBottom: '16px'}}>
              The anchor is positioned near the edge. The overlay should flip via position-try-fallbacks when it would
              overflow the viewport.
            </Text>
            <AnchorPositionOverlay label="Dialog Overflow Demo" />
          </div>
        </Dialog>
      )}
    </div>
  )
}

export const WithinStickyElement = () => {
  return (
    <div className={classes.ScrollContainer}>
      <div className={classes.StickyHeader}>
        <Heading as="h3">Sticky Header</Heading>
        <AnchorPositionOverlay label="Sticky Element Demo" />
      </div>
      <div className={classes.StickyScrollArea}>
        <Text as="p">Scroll down to test that the overlay stays anchored to the button in the sticky header.</Text>
      </div>
    </div>
  )
}
