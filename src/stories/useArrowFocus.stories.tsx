/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Meta} from '@storybook/react'
import styled, {createGlobalStyle, ThemeProvider} from 'styled-components'

import {Absolute, BaseStyles, BorderBox, Button, Flash, Grid, theme} from '..'
import {arrowFocus, Direction, KeyBits} from '../behaviors/arrowFocus'
import Flex from '../Flex'
import {themeGet} from '@styled-system/theme-get'

export default {
  title: 'Hooks/useArrowFocus',
  decorators: [
    Story => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

// NOTE: the below styles are solely intended as a visual aid for
// this Storybook story, but they're not recommended for a real site!
const HelperGlobalStyling = createGlobalStyle`
  *:focus {
    outline: 2px solid ${themeGet('colors.blue.3')} !important;
  }
  [data-focus-trap='active'] {
    background-color: ${themeGet('colors.green.2')}
  }
  [data-focus-trap='suspended'] {
    background-color: ${themeGet('colors.yellow.2')}
  }
`

const MarginButton = styled(Button)`
  margin: ${themeGet('space.1')};
`

export const ArrowFocus = () => {
  const vContainerRef = useRef<HTMLElement>()
  const hContainerRef = useRef<HTMLElement>()
  const [lastKey, setLastKey] = useState('none')

  useEffect(() => {
    if (vContainerRef.current && hContainerRef.current) {
      const vController = arrowFocus(vContainerRef.current)
      const hController = arrowFocus(hContainerRef.current, {
        circular: true,
        bindKeys: KeyBits.ArrowHorizontal | KeyBits.HomeAndEnd
      })
      return () => {
        vController.abort()
        hController.abort()
      }
    }
  }, [vContainerRef, hContainerRef])

  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  return (
    <>
      <HelperGlobalStyling />
      <Flex flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Absolute right={5} top={2}>
          Last key pressed: {lastKey}
        </Absolute>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <BorderBox borderColor="gray.5" ref={vContainerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>Use Up Arrow, Down Arrow, Home, and End to move focus within this box.</strong>
          <Flex flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Flex>
        </BorderBox>
        <BorderBox borderColor="gray.5" ref={hContainerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>Use Left Arrow, Right Arrow, Home, and End to move focus within this box. Focus is circular.</strong>

          <Flex flexDirection="row" alignItems="flex-start">
            <MarginButton>Grapefruit</MarginButton>
            <MarginButton>Honeydew</MarginButton>
            <MarginButton>Jackfruit</MarginButton>
          </Flex>
        </BorderBox>
        <MarginButton>Kiwi</MarginButton>
        <MarginButton>Lemon</MarginButton>
        <MarginButton>Mango</MarginButton>
      </Flex>
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
  const containerRef = useRef<HTMLElement>()
  const [lastKey, setLastKey] = useState('none')

  const getNextFocusable = useCallback(
    (
      direction: Direction,
      toEnd: boolean,
      from: Element | undefined,
      event: KeyboardEvent
    ): HTMLElement | undefined => {
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
    [containerRef]
  )

  useEffect(() => {
    if (containerRef.current) {
      const controller = arrowFocus(containerRef.current, {
        getNextFocusable
      })
      return () => {
        controller.abort()
      }
    }
  }, [containerRef, getNextFocusable])

  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  return (
    <>
      <HelperGlobalStyling />
      <Flex flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Absolute right={5} top={2}>
          Last key pressed: {lastKey}
        </Absolute>
        <MarginButton>Apple</MarginButton>

        <BorderBox borderColor="gray.5" m={4} p={4}>
          <strong>Use arrow keys to move focus within this box.</strong>
          <Grid
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
          </Grid>
        </BorderBox>
        <MarginButton>Lemon</MarginButton>
        <MarginButton>Mango</MarginButton>
      </Flex>
    </>
  )
}

export const FocusInStrategy = () => {
  const firstContainerRef = useRef<HTMLElement>()
  const prevContainerRef = useRef<HTMLElement>()
  const customContainerRef = useRef<HTMLElement>()
  const [lastKey, setLastKey] = useState('none')

  const customStrategy = React.useCallback(() => {
    if (customContainerRef.current) {
      const buttons = Array.from(customContainerRef.current.querySelectorAll('button'))
      return buttons[Math.floor(Math.random() * 3)]
    }
  }, [customContainerRef])

  useEffect(() => {
    if (firstContainerRef.current && prevContainerRef.current && customContainerRef.current) {
      const firstController = arrowFocus(firstContainerRef.current, {
        bindKeys: KeyBits.ArrowHorizontal | KeyBits.HomeAndEnd,
        focusInStrategy: 'first'
      })
      const prevController = arrowFocus(prevContainerRef.current, {
        bindKeys: KeyBits.ArrowHorizontal | KeyBits.HomeAndEnd,
        focusInStrategy: 'previous'
      })
      const customController = arrowFocus(customContainerRef.current, {
        bindKeys: KeyBits.ArrowHorizontal | KeyBits.HomeAndEnd,
        focusInStrategy: customStrategy
      })
      return () => {
        firstController.abort()
        prevController.abort()
        customController.abort()
      }
    }
  }, [firstContainerRef, prevContainerRef, customContainerRef, customStrategy])

  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  return (
    <>
      <HelperGlobalStyling />
      <Flex flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Absolute right={5} top={2}>
          Last key pressed: {lastKey}
        </Absolute>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <BorderBox borderColor="gray.5" ref={firstContainerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>&ldquo;First&rdquo; strategy (focus first focusable element)</strong>
          <Flex flexDirection="row" alignItems="flex-start">
            <MarginButton>Banana</MarginButton>
            <MarginButton>Cantaloupe</MarginButton>
            <MarginButton>Durian</MarginButton>
          </Flex>
        </BorderBox>
        <BorderBox borderColor="gray.5" ref={prevContainerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>&ldquo;Previous&rdquo; strategy (most recently focused element)</strong>
          <Flex flexDirection="row" alignItems="flex-start">
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
            <MarginButton>Grapefruit</MarginButton>
          </Flex>
        </BorderBox>
        <BorderBox borderColor="gray.5" ref={customContainerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>&ldquo;Custom&rdquo; strategy (choose randomly for this example)</strong>
          <Flex flexDirection="row" alignItems="flex-start">
            <MarginButton>Honeydew</MarginButton>
            <MarginButton>Jackfruit</MarginButton>
            <MarginButton>Kiwi</MarginButton>
          </Flex>
        </BorderBox>
        <MarginButton>Lemon</MarginButton>
        <MarginButton>Mango</MarginButton>
      </Flex>
    </>
  )
}

export const SpecialSituations = () => {
  const vContainerRef = useRef<HTMLElement>()
  const hContainerRef = useRef<HTMLElement>()
  const [lastKey, setLastKey] = useState('none')

  useEffect(() => {
    if (vContainerRef.current && hContainerRef.current) {
      const vController = arrowFocus(vContainerRef.current, {
        bindKeys:
          KeyBits.ArrowVertical | KeyBits.JK | KeyBits.WS | KeyBits.TAB | KeyBits.PageUpDown | KeyBits.HomeAndEnd
      })
      const hController = arrowFocus(hContainerRef.current, {
        circular: true,
        bindKeys: KeyBits.ArrowHorizontal
      })
      return () => {
        vController.abort()
        hController.abort()
      }
    }
  }, [vContainerRef, hContainerRef])

  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  return (
    <>
      <HelperGlobalStyling />
      <Flex flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Flash mb={3}>
          This story is very esoteric! It only exists to show some of the nuance of the arrow key focus behavior in
          different situations. Focus treatment within your component should be evaluated for your particular UX using
          the <a href="https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard">ARIA guidelines</a>.
        </Flash>
        <Absolute right={5} top={2}>
          Last key pressed: {lastKey}
        </Absolute>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <BorderBox borderColor="gray.5" ref={vContainerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>Bound keys: Up, Down, PageUp, PageDown, W, S, J, K, Home, End, Tab</strong>
          <Flex flexDirection="column" alignItems="flex-start">
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
          </Flex>
        </BorderBox>
        <BorderBox borderColor="gray.5" ref={hContainerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>Use Left Arrow, Right Arrow, Home, and End to move focus within this box. Focus is circular.</strong>

          <Flex flexDirection="row" alignItems="center">
            <MarginButton>Grapefruit</MarginButton>
            <input
              style={{width: '300px'}}
              type="text"
              defaultValue="Left/Right only work at beginning/end of input."
            />
            <MarginButton>Jackfruit</MarginButton>
          </Flex>
        </BorderBox>
        <MarginButton>Kiwi</MarginButton>
        <MarginButton>Lemon</MarginButton>
        <MarginButton>Mango</MarginButton>
      </Flex>
    </>
  )
}

export const ChangingSubtree = () => {
  const containerRef = useRef<HTMLElement>()
  const [buttonCount, setButtonCount] = useState(3)
  const [lastKey, setLastKey] = useState('none')

  useEffect(() => {
    if (containerRef.current) {
      const controller = arrowFocus(containerRef.current, {
        bindKeys: KeyBits.ArrowVertical
      })
      return () => {
        controller.abort()
      }
    }
  }, [containerRef])

  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const removeButton = useCallback(() => {
    setButtonCount(buttonCount - 1)
  }, [setButtonCount, buttonCount])

  const addButton = useCallback(() => {
    setButtonCount(buttonCount + 1)
  }, [setButtonCount, buttonCount])

  const buttons: JSX.Element[] = []
  for (let i = 0; i < buttonCount; ++i) {
    buttons.push(<MarginButton key={"button"+i}>{i + 1}</MarginButton>)
  }

  return (
    <>
      <HelperGlobalStyling />
      <Flex flexDirection="column" alignItems="flex-start" onKeyDownCapture={reportKey}>
        <Flash mb={3}>
          This story demonstrates that arrowFocus is consistent even when the container&rsquo;s subtree changes.
        </Flash>
        <Absolute right={5} top={2}>
          Last key pressed: {lastKey}
        </Absolute>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <BorderBox borderColor="gray.5" ref={containerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>Bound keys: Arrow Up and Arrow Down</strong>
          <Flex flexDirection="column" alignItems="flex-start">
            {buttons}
          </Flex>
        </BorderBox>
        <Flex flexDirection="row">
          <MarginButton onClick={removeButton}>Remove Button</MarginButton>
          <MarginButton onClick={addButton}>Add Button</MarginButton>
        </Flex>
      </Flex>
    </>
  )
}
