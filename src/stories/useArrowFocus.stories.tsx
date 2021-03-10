/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Meta} from '@storybook/react'
import styled, {createGlobalStyle, ThemeProvider} from 'styled-components'

import {Absolute, BaseStyles, BorderBox, Button, Grid, theme} from '..'
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
          <strong>Use Left Arrow, Right Arrow, Home, and End to move focus within this box.</strong>

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
