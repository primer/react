import React, {useCallback, useRef, useState} from 'react'
import {Meta} from '@storybook/react'
import styled from 'styled-components'
import {Box, BaseStyles, Flash, theme, ThemeProvider} from '..'
import {Button} from '../Button'
import {FocusKeys} from '@primer/behaviors'
import type {Direction} from '@primer/behaviors'
import {themeGet} from '@styled-system/theme-get'
import {useFocusZone} from '../hooks/useFocusZone'
import {useTheme} from '../ThemeProvider'

export default {
  title: 'Hooks/useFocusZone',
  decorators: [
    Story => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

const MarginButton = styled(Button)`
  margin: ${themeGet('space.1')};
`

export const BasicFocusZone = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const [fzEnabled, setFzEnabled] = useState(true)
  const {containerRef} = useFocusZone({disabled: !fzEnabled}, [fzEnabled])

  const toggleFz = useCallback(() => {
    setFzEnabled(!fzEnabled)
  }, [fzEnabled])

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Box position="absolute" right={5} top={2}>
          Last key pressed: {lastKey}
        </Box>
        <Button variant={fzEnabled ? 'danger' : 'primary'} onClick={toggleFz} sx={{mb: 3}}>
          {fzEnabled ? 'Disable' : 'Enable'} Focus Zone
        </Button>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <Box
          borderColor="gray.5"
          ref={containerRef as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>Use Up Arrow, Down Arrow, Home, and End to move focus within this box.</strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Box>
        </Box>
        <MarginButton>Kiwi</MarginButton>
        <MarginButton>Lemon</MarginButton>
        <MarginButton>Mango</MarginButton>
      </Box>
    </>
  )
}

export const FocusOutBehavior = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const {containerRef: containerRef1} = useFocusZone({
    focusOutBehavior: 'stop',
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
  })
  const {containerRef: containerRef2} = useFocusZone({
    focusOutBehavior: 'wrap',
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
  })

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Box position="absolute" right={5} top={2}>
          Last key pressed: {lastKey}
        </Box>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <Box
          borderColor="gray.5"
          ref={containerRef1 as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>
            Use Left Arrow, Right Arrow, Home, and End to move focus within this box. Focus stops at the ends.
          </strong>

          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Box>
        </Box>
        <Box
          borderColor="gray.5"
          ref={containerRef2 as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>Use Left Arrow, Right Arrow, Home, and End to move focus within this box. Focus is circular.</strong>

          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <MarginButton>Grapefruit</MarginButton>
            <MarginButton>Honeydew</MarginButton>
            <MarginButton>Jackfruit</MarginButton>
          </Box>
        </Box>
        <MarginButton>Kiwi</MarginButton>
        <MarginButton>Lemon</MarginButton>
        <MarginButton>Mango</MarginButton>
      </Box>
    </>
  )
}

function getSiblingIndex(element: Element) {
  let child: Element | null = element
  let i = 0
  while ((child = child.previousElementSibling) != null) {
    ++i
  }
  return i
}

export const CustomFocusMovement = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const containerRef = useRef<HTMLElement>(null)

  const getNextFocusable = useCallback(
    (direction: Direction, from: Element | undefined, event: KeyboardEvent): HTMLElement | undefined => {
      const toEnd = direction === 'start' || direction === 'end'
      if (from && containerRef.current) {
        const currentIndex = getSiblingIndex(from)
        let nextIndex = currentIndex
        if (['End', 'ArrowRight'].includes(event.key)) {
          while (nextIndex % 3 !== 2) {
            nextIndex += 1
            if (!toEnd) {
              break
            }
          }
        }
        if (['Home', 'ArrowLeft'].includes(event.key)) {
          while (nextIndex % 3 !== 0) {
            nextIndex -= 1
            if (!toEnd) {
              break
            }
          }
        }
        if (event.key === 'ArrowUp') {
          while (nextIndex - 3 >= 0) {
            nextIndex -= 3
            if (!toEnd) {
              break
            }
          }
        }
        if (event.key === 'ArrowDown') {
          while (nextIndex + 3 < 9) {
            nextIndex += 3
            if (!toEnd) {
              break
            }
          }
        }
        return containerRef.current.children[nextIndex] as HTMLElement
      }
    },
    [containerRef],
  )

  useFocusZone({containerRef, getNextFocusable})

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Box position="absolute" right={5} top={2}>
          Last key pressed: {lastKey}
        </Box>
        <MarginButton>Apple</MarginButton>

        <Box borderColor="gray.5" m={4} p={4} borderWidth="1px" borderStyle="solid" borderRadius={2}>
          <strong>Use arrow keys to move focus within this box.</strong>
          <Box
            display="grid"
            ref={containerRef as React.RefObject<HTMLDivElement>}
            gridTemplateRows="1fr 1fr 1fr"
            gridTemplateColumns="1fr 1fr 1fr"
          >
            <MarginButton>Banana</MarginButton>
            <MarginButton>Cantaloupe</MarginButton>
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
            <MarginButton>Grapefruit</MarginButton>
            <MarginButton>Honeydew</MarginButton>
            <MarginButton>Jackfruit</MarginButton>
            <MarginButton>Kiwi</MarginButton>
          </Box>
        </Box>
        <MarginButton>Lemon</MarginButton>
        <MarginButton>Mango</MarginButton>
      </Box>
    </>
  )
}

export const FocusInStrategy = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const {containerRef: firstContainerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy: 'first',
  })

  const {containerRef: closestContainerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy: 'closest',
  })

  const {containerRef: prevContainerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy: 'previous',
  })

  const customContainerRef = useRef<HTMLElement>(null)
  const customStrategy = React.useCallback(() => {
    if (customContainerRef.current) {
      const buttons = Array.from(customContainerRef.current.querySelectorAll('button'))
      return buttons[Math.floor(Math.random() * 3)]
    }
  }, [customContainerRef])

  useFocusZone({
    containerRef: customContainerRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy: customStrategy,
  })

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Box position="absolute" right={5} top={2}>
          Last key pressed: {lastKey}
        </Box>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <Box
          borderColor="gray.5"
          ref={firstContainerRef as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>&ldquo;First&rdquo; strategy (focus first focusable element)</strong>
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <MarginButton>Banana</MarginButton>
            <MarginButton>Cantaloupe</MarginButton>
            <MarginButton>Durian</MarginButton>
          </Box>
        </Box>
        <Box
          borderColor="gray.5"
          ref={closestContainerRef as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>&ldquo;Closest&rdquo; strategy (focus first or last depending on focus direction)</strong>
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
            <MarginButton>Grapefruit</MarginButton>
          </Box>
        </Box>
        <Box
          borderColor="gray.5"
          ref={prevContainerRef as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>&ldquo;Previous&rdquo; strategy (most recently focused element)</strong>
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <MarginButton>Honeydew</MarginButton>
            <MarginButton>Jackfruit</MarginButton>
            <MarginButton>Kiwi</MarginButton>
          </Box>
        </Box>
        <Box
          borderColor="gray.5"
          ref={customContainerRef as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>&ldquo;Custom&rdquo; strategy (choose randomly for this example)</strong>
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <MarginButton>Lemon</MarginButton>
            <MarginButton>Mango</MarginButton>
            <MarginButton>Nectarine</MarginButton>
          </Box>
        </Box>
        <MarginButton>Orange</MarginButton>
        <MarginButton>Papaya</MarginButton>
      </Box>
    </>
  )
}

export const SpecialSituations = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const {containerRef: vContainerRef} = useFocusZone({
    bindKeys:
      FocusKeys.ArrowVertical |
      FocusKeys.JK |
      FocusKeys.WS |
      FocusKeys.Tab |
      FocusKeys.PageUpDown |
      FocusKeys.HomeAndEnd,
  })
  const {containerRef: hContainerRef} = useFocusZone({focusOutBehavior: 'wrap', bindKeys: FocusKeys.ArrowHorizontal})

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Flash sx={{mb: 3}}>
          This story is very esoteric! It only exists to show some of the nuance of the arrow key focus behavior in
          different situations. Focus treatment within your component should be evaluated for your particular UX using
          the <a href="https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard">ARIA guidelines</a>.
        </Flash>
        <Box position="absolute" right={5} top={2}>
          Last key pressed: {lastKey}
        </Box>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <Box
          borderColor="gray.5"
          ref={vContainerRef as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>Bound keys: Up, Down, PageUp, PageDown, W, S, J, K, Home, End, Tab</strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <input style={{width: '250px'}} type="text" defaultValue="Printable characters won't move focus" />
            <MarginButton>Regular button</MarginButton>
            <select>
              <option>Down arrow invokes dropdown</option>
              <option>Unless Cmd (mac)/Ctrl (Windows)</option>
              <option>Is held</option>
            </select>
            <textarea
              style={{width: '250px', height: '95px'}}
              defaultValue="Up/Down only works when at beginning/end. PageUp and PageDown completely disabled. Printable characters will never move focus."
            ></textarea>
          </Box>
        </Box>
        <Box
          borderColor="gray.5"
          ref={hContainerRef as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>Use Left Arrow and Right Arrow to move focus within this box. Focus is circular.</strong>

          <Box display="flex" flexDirection="row" alignItems="center">
            <MarginButton>Grapefruit</MarginButton>
            <input
              style={{width: '300px'}}
              type="text"
              defaultValue="Left/Right only work at beginning/end of input."
            />
            <MarginButton>Jackfruit</MarginButton>
          </Box>
        </Box>
        <MarginButton>Kiwi</MarginButton>
        <MarginButton>Lemon</MarginButton>
        <MarginButton>Mango</MarginButton>
      </Box>
    </>
  )
}

export const ChangingSubtree = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const {containerRef} = useFocusZone({bindKeys: FocusKeys.ArrowVertical})

  const [buttonCount, setButtonCount] = useState(3)
  const removeButton = useCallback(() => {
    setButtonCount(buttonCount - 1)
  }, [setButtonCount, buttonCount])

  const addButton = useCallback(() => {
    setButtonCount(buttonCount + 1)
  }, [setButtonCount, buttonCount])

  const buttons: JSX.Element[] = []
  for (let i = 0; i < buttonCount; ++i) {
    buttons.push(
      <div>
        <MarginButton key={`button${i}`}>{i + 1}</MarginButton>
      </div>,
    )
  }

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Flash sx={{mb: 3}}>
          This story demonstrates that focusZone is consistent even when the container&rsquo;s subtree changes.
        </Flash>
        <Box position="absolute" right={5} top={2}>
          Last key pressed: {lastKey}
        </Box>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <Box
          borderColor="gray.5"
          ref={containerRef as React.RefObject<HTMLDivElement>}
          m={4}
          p={4}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>Bound keys: Arrow Up and Arrow Down</strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            {buttons}
          </Box>
        </Box>
        <Box display="flex" flexDirection="row">
          <MarginButton onClick={removeButton}>Remove Button</MarginButton>
          <MarginButton onClick={addButton}>Add Button</MarginButton>
        </Box>
      </Box>
    </>
  )
}

export const NestedZones = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const outerContainerRef = useRef<HTMLElement>(null)
  const innerContainerRef = useRef<HTMLElement>(null)

  useFocusZone({
    containerRef: outerContainerRef,
    bindKeys: FocusKeys.ArrowVertical,
  })

  useFocusZone({
    containerRef: innerContainerRef,
    bindKeys: FocusKeys.ArrowHorizontal,
  })

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Box position="absolute" right={5} top={2}>
          Last key pressed: {lastKey}
        </Box>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <Box
          borderColor="gray.5"
          m={4}
          p={4}
          ref={outerContainerRef as React.RefObject<HTMLDivElement>}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>Bound keys: Arrow Up and Arrow Down</strong>
          <br />
          <MarginButton>Cantaloupe</MarginButton>
          <Box
            borderColor="gray.5"
            m={4}
            p={4}
            ref={innerContainerRef as React.RefObject<HTMLDivElement>}
            borderWidth="1px"
            borderStyle="solid"
            borderRadius={2}
          >
            <strong>Additional Bound keys: Arrow Left and Arrow Right</strong>
            <Box display="flex" id="list" flexDirection="column" alignItems="flex-start">
              <MarginButton>Durian</MarginButton>
              <MarginButton>Elderberry</MarginButton>
              <MarginButton>Fig</MarginButton>
              <MarginButton>Grapefruit</MarginButton>
            </Box>
          </Box>
          <MarginButton>Honeydew</MarginButton>
        </Box>
        <MarginButton>Jackfruit</MarginButton>
        <MarginButton>Kiwi</MarginButton>
      </Box>
    </>
  )
}

export const ActiveDescendant = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const containerRef = useRef<HTMLElement>(null)
  const controllingElementRef = useRef<HTMLElement>(null)
  const {theme: themeFromContext} = useTheme()

  useFocusZone({
    containerRef,
    activeDescendantFocus: controllingElementRef,
    bindKeys: FocusKeys.ArrowVertical,
    onActiveDescendantChanged: (current, previous) => {
      if (current) {
        current.style.outline = `2px solid ${themeFromContext?.colors.accent.fg}`
      }
      if (previous) {
        previous.style.outline = ''
      }
    },
    focusableElementFilter: elem => elem instanceof HTMLButtonElement,
  })

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Flash sx={{mb: 3}}>
          This story demonstrates using the `aria-activedescendant` pattern for managing both a focused element and an
          active element. Below, you can focus the input box then use the up/down arrow keys to change the active
          descendant (dark blue outline).
        </Flash>
        <Box position="absolute" right={5} top={2}>
          Last key pressed: {lastKey}
        </Box>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <Box borderColor="gray.5" m={4} p={4} borderWidth="1px" borderStyle="solid" borderRadius={2}>
          <strong>Bound keys: Arrow Up and Arrow Down</strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <input
              ref={controllingElementRef as React.RefObject<HTMLInputElement>}
              type="text"
              defaultValue="Focus remains here."
              aria-controls="list"
            />
            <Box
              display="flex"
              id="list"
              flexDirection="column"
              alignItems="flex-start"
              ref={containerRef as React.RefObject<HTMLDivElement>}
            >
              <MarginButton>Durian</MarginButton>
              <MarginButton>Elderberry</MarginButton>
              <MarginButton>Fig</MarginButton>
              <MarginButton>Grapefruit</MarginButton>
            </Box>
          </Box>
        </Box>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
        <MarginButton>Kiwi</MarginButton>
      </Box>
    </>
  )
}
