/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, {useEffect} from 'react'
import {Meta} from '@storybook/react'
import styled, {createGlobalStyle, ThemeProvider} from 'styled-components'

import {BaseStyles, BorderBox, Button, theme} from '..'
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
    background-color: ${themeGet("colors.green.2")}
  }
  [data-focus-trap='suspended'] {
    background-color: ${themeGet("colors.yellow.2")}
  }
`

const MarginButton = styled(Button)`
  margin: ${themeGet("space.1")} 0;
`

export const FocusTrap = () => {
  const [trapEnabled, setTrapEnabled] = React.useState(false)
  const {containerProps} = useFocusTrap({disabled: !trapEnabled})

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
        <BorderBox borderColor="gray.5" ref={containerProps.ref as React.RefObject<HTMLDivElement>} m={4} p={4}>
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

export const MultipleFocusTraps = () => {
  const [trapEnabled1, setTrapEnabled1] = React.useState(false)
  const [trapEnabled2, setTrapEnabled2] = React.useState(false)

  const {containerProps: containerProps1} = useFocusTrap({disabled: !trapEnabled1})
  const {containerProps: containerProps2} = useFocusTrap({disabled: !trapEnabled2})

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
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <BorderBox borderColor="gray.5" ref={containerProps1.ref as React.RefObject<HTMLDivElement>} m={2} p={2}>
          <strong>
            Trap zone! Press <code>1</code> to toggle.
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
        <BorderBox borderColor="gray.5" ref={containerProps2.ref as React.RefObject<HTMLDivElement>} m={2} p={2}>
          <strong>
            Trap zone! Press <code>2</code> to toggle.
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
