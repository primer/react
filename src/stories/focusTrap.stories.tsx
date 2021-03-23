/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useEffect} from 'react'
import {Meta} from '@storybook/react'
import styled, {createGlobalStyle, ThemeProvider} from 'styled-components'

import {BaseStyles, BorderBox, Button, Flash, Text, theme} from '..'
import {useFocusTrap} from '../hooks/useFocusTrap'
import Flex from '../Flex'
import {themeGet} from '@styled-system/theme-get'

export default {
  title: 'Hooks/useFocusTrap',
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
  margin: ${themeGet('space.1')} 0;
`

export const FocusTrap = () => {
  const [trapEnabled, setTrapEnabled] = React.useState(false)
  const {containerRef} = useFocusTrap({disabled: !trapEnabled})

  const spaceListener = React.useCallback(
    event => {
      if (event.key === ' ') {
        setTrapEnabled(!trapEnabled)
      }
    },
    [trapEnabled]
  )

  useEffect(() => {
    document.addEventListener('keypress', spaceListener)
    return () => {
      document.removeEventListener('keypress', spaceListener)
    }
  }, [spaceListener])

  return (
    <>
      <HelperGlobalStyling />
      <Flex flexDirection="column" alignItems="flex-start">
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <BorderBox borderColor="gray.5" ref={containerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Flex flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Flex>
        </BorderBox>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Flex>
    </>
  )
}

export const CustomInitialFocus = () => {
  const [trapEnabled, setTrapEnabled] = React.useState(false)
  const {containerRef, initialFocusRef} = useFocusTrap({disabled: !trapEnabled})

  const spaceListener = React.useCallback(
    event => {
      if (event.key === ' ') {
        setTrapEnabled(!trapEnabled)
      }
    },
    [trapEnabled]
  )

  useEffect(() => {
    document.addEventListener('keypress', spaceListener)
    return () => {
      document.removeEventListener('keypress', spaceListener)
    }
  }, [spaceListener])

  return (
    <>
      <HelperGlobalStyling />
      <Flex flexDirection="column" alignItems="flex-start">
        <Flash mb={3}>
          This story is the same as the `Focus Trap` story, except, when the trap zone is activated, the
          &lquo;Elderberry&rquo; button will receive the initial focus (if the trap zone container does not already have
          focus).
        </Flash>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <BorderBox borderColor="gray.5" ref={containerRef as React.RefObject<HTMLDivElement>} m={4} p={4}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Flex flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton ref={initialFocusRef as React.RefObject<HTMLButtonElement>}>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Flex>
        </BorderBox>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Flex>
    </>
  )
}

export const MultipleFocusTraps = () => {
  const [trapEnabled1, setTrapEnabled1] = React.useState(false)
  const [trapEnabled2, setTrapEnabled2] = React.useState(false)

  const {containerRef: containerRef1} = useFocusTrap({disabled: !trapEnabled1})
  const {containerRef: containerRef2} = useFocusTrap({disabled: !trapEnabled2})

  const keyListener = React.useCallback(
    event => {
      if (event.key === '1') {
        setTrapEnabled1(!trapEnabled1)
      }
      if (event.key === '2') {
        setTrapEnabled2(!trapEnabled2)
      }
    },
    [trapEnabled1, trapEnabled2]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyListener, {capture: true})
    return () => {
      document.removeEventListener('keydown', keyListener, {capture: true})
    }
  }, [keyListener])

  return (
    <>
      <HelperGlobalStyling />
      <Flex flexDirection="column" alignItems="flex-start">
        <Flash mb={3}>
          This story demonstrates the global nature of focus traps. When a focus trap is enabled, if there is already an
          active focus trap, it becomes suspended and pushed onto a stack. Once the newly-active focus trap is disabled,
          the most recently-suspended trap will reactivate. Suspended focus traps can be disabled, causing them to be
          removed from the stack of suspended traps.
        </Flash>
        <BorderBox p={2} mb={3}>
          Legend
          <Flex flexDirection="row">
            <BorderBox width={40} height={22} mr={2} borderColor="gray.5"></BorderBox>
            <Text> - Inactive</Text>
          </Flex>
          <Flex flexDirection="row">
            <BorderBox width={40} height={22} mr={2} borderColor="gray.5" backgroundColor="yellow.2"></BorderBox>
            <Text> - Suspended</Text>
          </Flex>
          <Flex flexDirection="row">
            <BorderBox width={40} height={22} mr={2} borderColor="gray.5" backgroundColor="green.2"></BorderBox>
            <Text> - Active</Text>
          </Flex>
        </BorderBox>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <BorderBox borderColor="gray.5" ref={containerRef1 as React.RefObject<HTMLDivElement>} m={2} p={2}>
          <strong>
            Trap zone ({trapEnabled1 ? 'enabled' : 'disabled'})! Press <code>1</code> to toggle.
          </strong>
          <Flex flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Flex>
        </BorderBox>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
        <BorderBox borderColor="gray.5" ref={containerRef2 as React.RefObject<HTMLDivElement>} m={2} p={2}>
          <strong>
            Trap zone ({trapEnabled2 ? 'enabled' : 'disabled'})! Press <code>2</code> to toggle.
          </strong>
          <Flex flexDirection="column" alignItems="flex-start">
            <MarginButton>Kiwi</MarginButton>
            <MarginButton>Lemon</MarginButton>
            <MarginButton>Mango</MarginButton>
          </Flex>
        </BorderBox>
        <MarginButton>Nectarine</MarginButton>
        <MarginButton>Orange</MarginButton>
        <MarginButton>Peach</MarginButton>
      </Flex>
    </>
  )
}
