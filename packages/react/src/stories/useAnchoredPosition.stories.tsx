import React from 'react'
import type {Meta} from '@storybook/react-vite'
import {BaseStyles, ThemeProvider} from '..'
import {useAnchoredPosition} from '../hooks'
import type {AnchorSide} from '@primer/behaviors'
import Portal, {registerPortalRoot} from '../Portal'
import {Button} from '../Button'
import {clsx} from 'clsx'
import classes from './AnchoredPositionStories.module.css'

export default {
  title: 'Hooks/useAnchoredPosition',
  decorators: [
    // Note: For some reason, if you use <BaseStyles><Story /></BaseStyles>,
    // the component gets unmounted from the root every time a control changes!
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>{Story()}</BaseStyles>
        </ThemeProvider>
      )
    },
  ],
  argTypes: {
    anchorX: {
      control: {type: 'range', min: 0, max: 500},
    },
    anchorY: {
      control: {type: 'range', min: 0, max: 500},
    },
    anchorWidth: {
      control: {type: 'range', min: 50, max: 500},
    },
    anchorHeight: {
      control: {type: 'range', min: 50, max: 500},
    },
    floatWidth: {
      control: {type: 'range', min: 50, max: 500},
    },
    floatHeight: {
      control: {type: 'range', min: 50, max: 500},
    },
    anchorPosition: {
      control: {type: 'inline-radio'},
      options: ['inside', 'outside'],
    },
    anchorSide: {
      control: {type: 'inline-radio'},
      options: ['top', 'bottom', 'left', 'right', 'center'],
      description: 'note',
    },
    anchorAlignment: {
      control: {type: 'inline-radio'},
      options: ['start', 'center', 'end'],
    },
    anchorOffset: {
      control: {type: 'range', min: -100, max: 100},
    },
    alignmentOffset: {
      control: {type: 'range', min: -100, max: 100},
    },
    allowOutOfBounds: {
      control: {type: 'boolean'},
    },
  },
} as Meta

const Float = ({
  children,
  style,
  top,
  left,
  width,
  height,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  top?: number
  left?: number
  width?: number
  height?: number
}) => (
  <div
    className={clsx(classes.Float, props.className)}
    style={{
      ...style,
      ...(top !== undefined && {top: `${top}px`}),
      ...(left !== undefined && {left: `${left}px`}),
      ...(width !== undefined && {width: `${width}px`}),
      ...(height !== undefined && {height: `${height}px`}),
    }}
    {...props}
  >
    {children}
  </div>
)

const Anchor = ({
  children,
  style,
  top,
  left,
  width,
  height,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  top?: number
  left?: number
  width?: number
  height?: number
}) => (
  <div
    className={clsx(classes.Anchor, props.className)}
    style={{
      ...style,
      ...(top !== undefined && {top: `${top}px`}),
      ...(left !== undefined && {left: `${left}px`}),
      ...(width !== undefined && {width: `${width}px`}),
      ...(height !== undefined && {height: `${height}px`}),
    }}
    {...props}
  >
    {children}
  </div>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UseAnchoredPosition = (args: any) => {
  const {floatingElementRef, anchorElementRef, position} = useAnchoredPosition(
    {
      side: `${args.anchorPosition ?? 'outside'}-${args.anchorSide ?? 'bottom'}` as AnchorSide,
      align: args.anchorAlignment ?? 'start',
      anchorOffset: args.anchorOffset && parseInt(args.anchorOffset, 10),
      alignmentOffset: args.alignmentOffset && parseInt(args.alignmentOffset, 10),
      allowOutOfBounds: args.allowOutOfBounds ?? undefined,
    },
    [
      args.anchorY,
      args.anchorX,
      args.anchorPosition,
      args.anchorSide,
      args.anchorAlignment,
      args.anchorOffset,
      args.alignmentOffset,
      args.allowOutOfBounds,
      args.floatHeight,
      args.floatWidth,
    ],
  )

  return (
    <div className={classes.RelativeContainer}>
      <Anchor
        top={args.anchorY ?? 0}
        left={args.anchorX ?? 0}
        width={args.anchorWidth}
        height={args.anchorHeight}
        ref={anchorElementRef as React.RefObject<HTMLDivElement>}
      >
        Anchor Element
      </Anchor>
      <Float
        top={position?.top ?? 0}
        left={position?.left ?? 0}
        width={args.floatWidth ?? 150}
        height={args.floatHeight ?? 150}
        ref={floatingElementRef as React.RefObject<HTMLDivElement>}
      >
        Floating element
      </Float>
    </div>
  )
}
export const CenteredOnScreen = () => {
  const {floatingElementRef, anchorElementRef, position} = useAnchoredPosition({
    side: 'inside-center',
    align: 'center',
  })
  // The outer Position element simply fills all available space
  return (
    <div ref={anchorElementRef as React.RefObject<HTMLDivElement>} className={classes.AbsoluteContainer}>
      <Float
        ref={floatingElementRef as React.RefObject<HTMLDivElement>}
        top={position?.top ?? 0}
        left={position?.left ?? 0}
      >
        <p>Screen-Centered Floating Element </p>
        <p>
          <small>
            <em>(Controls are ignored for this story)</em>
          </small>
        </p>
      </Float>
    </div>
  )
}

export const ComplexAncestry = () => {
  const [recalculateSignal, setRecalculateSignal] = React.useState(0)
  const {floatingElementRef, anchorElementRef, position} = useAnchoredPosition(
    {
      side: 'outside-bottom',
      align: 'start',
    },
    [recalculateSignal],
  )
  const onRecalculateClick = React.useCallback(() => {
    setRecalculateSignal(recalculateSignal + 1)
  }, [recalculateSignal])

  // The outer Position element simply fills all available space
  return (
    <>
      <div className={classes.ClippingContainer} tabIndex={0}>
        Clipping container - this element has <code>overflow</code> set to something other than <code>visible</code>
        <div className={classes.RelativeParent}>
          Relatively positioned parent, but fluid height, so not the clipping parent.
          <div className={classes.StaticOverflowContainer}>
            Floating element container. Position=static and overflow=hidden to show that overflow-hidden on a
            statically-positioned element will not have any effect.
            <Float
              top={position?.top ?? 0}
              left={position?.left ?? 0}
              width={150}
              height={220}
              ref={floatingElementRef as React.RefObject<HTMLDivElement>}
            >
              Floating element
            </Float>
          </div>
        </div>
        <div className={classes.TallContainer}>
          Anchor element container. This element is really tall to demonstrate behavior within a scrollable clipping
          container.
          <div className={classes.AnchorElementContainer} ref={anchorElementRef as React.RefObject<HTMLDivElement>}>
            Anchor Element
          </div>
        </div>
      </div>
      <Button onClick={onRecalculateClick}>Click to recalculate floating position</Button>
    </>
  )
}

const Nav = ({children, ...props}: React.ComponentPropsWithoutRef<'nav'>) => (
  <nav className={classes.Nav} {...props}>
    {children}
  </nav>
)

const Main = ({children, ...props}: React.ComponentPropsWithRef<'main'>) => (
  <main className={classes.Main} {...props}>
    {children}
  </main>
)

/*

There are a few "gotchas" to take note of from this example. See the
documentation for more info.

1. The portal's root (<Main> in this example) needs to be large enough
   to include ANY space that the overlay might need to take. By default,
   elements are not rendered at full height! Notice how <Main> uses
   top, left, right, and bottom all set to 0 to achieve a full-size box.

2. The positioning routine needs to know the size of the overlay before
   calculating its position! Therefore, we use visibility: hidden to
   prevent showing a single frame of the overlay being positioned at
   (0, 0).

*/

export const WithPortal = () => {
  const [showMenu, setShowMenu] = React.useState(false)
  const mainRef = React.useRef<HTMLElement>(null)

  // Calculate the position of the menu
  const {floatingElementRef, anchorElementRef, position} = useAnchoredPosition(
    {
      side: 'outside-bottom',
      align: 'start',
    },
    [showMenu],
  )

  // Register <Main> as the Portal root
  React.useEffect(() => {
    if (mainRef.current) {
      registerPortalRoot(mainRef.current)
    }
  }, [mainRef])

  // Toggles rendering the menu when the button is clicked
  const toggleMenu = React.useCallback(() => {
    setShowMenu(!showMenu)
  }, [showMenu])

  return (
    <Main ref={mainRef}>
      <Nav>
        <h2>The nav bar!</h2>
        <p>
          This &ldquo;nav bar&rdquo; has a width of 300px and is <code>position:relative</code> with{' '}
          <code>overflow:hidden</code>, meaning that its children cannot overflow this container. Using &lt;Portal&gt;
          with <code>useAnchoredPosition</code>, we can break out of this constraint.
        </p>
        <div className={classes.RightAligned}>
          <Button variant="primary" onClick={toggleMenu} ref={anchorElementRef as React.RefObject<HTMLButtonElement>}>
            Show the overlay!
          </Button>
          {showMenu ? (
            <Portal>
              <Float
                ref={floatingElementRef as React.RefObject<HTMLDivElement>}
                style={{top: `${position?.top ?? 0}px`, left: `${position?.left ?? 0}px`}}
                width={250}
                height={400}
                className={position ? classes.VisibleOverlay : classes.HiddenOverlay}
              >
                An un-constrained overlay!
              </Float>
            </Portal>
          ) : null}
        </div>
      </Nav>
      <div className={classes.FlexGrow}>
        <h1>The body!</h1>
        <p>
          <em>Note: The controls below have no effect in this story.</em>
        </p>
      </div>
    </Main>
  )
}
