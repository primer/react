import React from 'react'
import type {Meta} from '@storybook/react'
import {BaseStyles, Box, ThemeProvider} from '..'
import {useAnchoredPosition} from '../hooks'
import styled from 'styled-components'
import {get} from '../constants'
import type {AnchorSide} from '@primer/behaviors'
import Portal, {registerPortalRoot} from '../Portal'
import {Button} from '../Button'

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

const Float = styled(Box)`
  position: absolute;
  border: 1px solid ${get('colors.black')};
  border-radius: ${get('radii.2')};
  background-color: ${get('colors.orange.3')};
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: ${get('fontSizes.3')};
  font-weight: ${get('fontWeights.bold')};
  padding: ${get('space.3')};
`
const Anchor = styled(Box)`
  position: absolute;
  border: 1px solid ${get('colors.black')};
  border-radius: ${get('radii.2')};
  background-color: ${get('colors.blue.3')};
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: ${get('fontSizes.3')};
  font-weight: ${get('fontWeights.bold')};
  padding: ${get('space.3')};
`

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
    <Box position="relative" m={2}>
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
    </Box>
  )
}
export const CenteredOnScreen = () => {
  const {floatingElementRef, anchorElementRef, position} = useAnchoredPosition({
    side: 'inside-center',
    align: 'center',
  })
  // The outer Position element simply fills all available space
  return (
    <Box
      ref={anchorElementRef as React.RefObject<HTMLDivElement>}
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
    >
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
    </Box>
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
  const space = 2
  return (
    <>
      <Box
        m={space}
        p={space}
        sx={{
          border: '1px solid #000',
          backgroundColor: 'blue.1',
          height: '440px',
          overflow: 'auto',
          position: 'relative',
        }}
        tabIndex={0}
      >
        Clipping container - this element has <code>overflow</code> set to something other than <code>visible</code>
        <Box m={space} p={space} sx={{border: '1px solid #000', backgroundColor: 'blue.2', position: 'relative'}}>
          Relatively positioned parent, but fluid height, so not the clipping parent.
          <Box
            m={space}
            p={space}
            sx={{border: '1px solid #000', backgroundColor: 'blue.3', position: 'static', overflow: 'hidden'}}
          >
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
          </Box>
        </Box>
        <Box m={space} p={space} backgroundColor="blue.3" sx={{border: '1px solid #000', height: '2000px'}}>
          Anchor element container. This element is really tall to demonstrate behavior within a scrollable clipping
          container.
          <Box
            width="200px"
            backgroundColor="orange.3"
            height={60}
            ref={anchorElementRef as React.RefObject<HTMLDivElement>}
            sx={{border: '1px solid #000'}}
            m={space}
            p={space}
          >
            Anchor Element
          </Box>
        </Box>
      </Box>
      <Button onClick={onRecalculateClick}>Click to recalculate floating position</Button>
    </>
  )
}

const Nav = styled('nav')`
  width: 300px;
  padding: ${get('space.3')};
  position: relative;
  overflow: hidden;
  border-right: 1px solid ${get('colors.border.gray')};
`
const Main = styled('main')`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

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
        <Box sx={{textAlign: 'right'}}>
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
                sx={{visibility: position ? 'visible' : 'hidden'}}
              >
                An un-constrained overlay!
              </Float>
            </Portal>
          ) : null}
        </Box>
      </Nav>
      <Box sx={{flexGrow: 1}} p={3}>
        <h1>The body!</h1>
        <p>
          <em>Note: The controls below have no effect in this story.</em>
        </p>
      </Box>
    </Main>
  )
}
