import React, {useCallback, useEffect} from 'react'
import type {Meta} from '@storybook/react'
import styled, {createGlobalStyle} from 'styled-components'

import {BaseStyles, Box, Button, Flash, Text, ThemeProvider} from '..'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {themeGet} from '@styled-system/theme-get'

export default {
  title: 'Hooks/useFocusTrap',
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

// NOTE: the below styles are solely intended as a visual aid for
// this Storybook story, but they're not recommended for a real site!
const HelperGlobalStyling = createGlobalStyle`
  *:focus {
    outline: 2px solid ${themeGet('colors.auto.blue.3')} !important;
  }
  [data-focus-trap='active'] {
    background-color: ${themeGet('colors.auto.green.2')}
  }
  [data-focus-trap='suspended'] {
    background-color: ${themeGet('colors.auto.yellow.2')}
  }
`

const MarginButton = styled(Button)`
  margin: ${themeGet('space.1')} 0;
`

export const FocusTrap = () => {
  const [trapEnabled, setTrapEnabled] = React.useState(false)
  const {containerRef} = useFocusTrap({disabled: !trapEnabled})

  const spaceListener = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === ' ') {
        setTrapEnabled(!trapEnabled)
      }
    },
    [trapEnabled],
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
      <Box display="flex" flexDirection="column" alignItems="flex-start">
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
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Box>
        </Box>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Box>
    </>
  )
}

export const RestoreFocus = () => {
  const [trapEnabled, setTrapEnabled] = React.useState(false)
  const {containerRef} = useFocusTrap({disabled: !trapEnabled, restoreFocusOnCleanUp: true})

  const spaceListener = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === ' ') {
        setTrapEnabled(!trapEnabled)
      }
    },
    [trapEnabled],
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
      <Box display="flex" flexDirection="column" alignItems="flex-start">
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
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Box>
        </Box>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Box>
    </>
  )
}

export const CustomInitialFocus = () => {
  const [trapEnabled, setTrapEnabled] = React.useState(false)
  const {containerRef, initialFocusRef} = useFocusTrap({disabled: !trapEnabled})

  const spaceListener = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === ' ') {
        setTrapEnabled(!trapEnabled)
      }
    },
    [trapEnabled],
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
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Flash sx={{mb: 3}}>
          This story is the same as the `Focus Trap` story, except, when the trap zone is activated, the
          &ldquo;Elderberry&rdquo; button will receive the initial focus (if the trap zone container does not already
          have focus).
        </Flash>
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
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton ref={initialFocusRef as React.RefObject<HTMLButtonElement>}>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Box>
        </Box>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Box>
    </>
  )
}

function useKeyPressListener(key: string, handler: () => void, capture = false) {
  const listener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        handler()
      }
    },
    [key, handler],
  )

  useEffect(() => {
    document.addEventListener('keypress', listener, {capture})
    return () => {
      document.removeEventListener('keypress', listener, {capture})
    }
  }, [listener, capture])
}

function ToggleableButton({name}: {name: string}) {
  const [showButton, setShowButton] = React.useState(true)
  const key = name.substr(0, 1).toLowerCase()

  useKeyPressListener(
    key,
    useCallback(() => setShowButton(!showButton), [showButton]),
  )

  return (
    <span>
      {showButton ? <MarginButton>{name}</MarginButton> : <>{name} (Hidden) - </>}
      Press {key} to toggle
    </span>
  )
}

export const DynamicFocusTrapContents = () => {
  const [trapEnabled, setTrapEnabled] = React.useState(false)
  const {containerRef} = useFocusTrap({disabled: !trapEnabled})

  useKeyPressListener(
    ' ',
    useCallback(() => setTrapEnabled(!trapEnabled), [trapEnabled]),
  )

  return (
    <>
      <HelperGlobalStyling />
      <Box display="flex" flexDirection="column" alignItems="flex-start">
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
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <ToggleableButton name="Durian"></ToggleableButton>
            <ToggleableButton name="Elderberry"></ToggleableButton>
            <ToggleableButton name="Fig"></ToggleableButton>
          </Box>
        </Box>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Box>
    </>
  )
}

export const MultipleFocusTraps = () => {
  const [trapEnabled1, setTrapEnabled1] = React.useState(false)
  const [trapEnabled2, setTrapEnabled2] = React.useState(false)

  const {containerRef: containerRef1} = useFocusTrap({disabled: !trapEnabled1})
  const {containerRef: containerRef2} = useFocusTrap({disabled: !trapEnabled2})

  const keyListener = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === '1') {
        setTrapEnabled1(!trapEnabled1)
      }
      if (event.key === '2') {
        setTrapEnabled2(!trapEnabled2)
      }
    },
    [trapEnabled1, trapEnabled2],
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
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Flash sx={{mb: 3}}>
          This story demonstrates the global nature of focus traps. When a focus trap is enabled, if there is already an
          active focus trap, it becomes suspended and pushed onto a stack. Once the newly-active focus trap is disabled,
          the most recently-suspended trap will reactivate. Suspended focus traps can be disabled, causing them to be
          removed from the stack of suspended traps.
        </Flash>
        <Box p={2} mb={3} borderWidth="1px" borderStyle="solid" borderColor="border.default" borderRadius={2}>
          Legend
          <Box display="flex" flexDirection="row">
            <Box
              width={40}
              height={22}
              mr={2}
              borderColor="gray.5"
              borderWidth="1px"
              borderStyle="solid"
              borderRadius={2}
            ></Box>
            <Text> - Inactive</Text>
          </Box>
          <Box display="flex" flexDirection="row">
            <Box
              width={40}
              height={22}
              mr={2}
              borderColor="gray.5"
              backgroundColor="yellow.2"
              borderWidth="1px"
              borderStyle="solid"
              borderRadius={2}
            ></Box>
            <Text> - Suspended</Text>
          </Box>
          <Box display="flex" flexDirection="row">
            <Box
              width={40}
              height={22}
              mr={2}
              borderColor="gray.5"
              backgroundColor="green.2"
              borderWidth="1px"
              borderStyle="solid"
              borderRadius={2}
            ></Box>
            <Text> - Active</Text>
          </Box>
        </Box>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <Box
          borderColor="gray.5"
          ref={containerRef1 as React.RefObject<HTMLDivElement>}
          m={2}
          p={2}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>
            Trap zone ({trapEnabled1 ? 'enabled' : 'disabled'})! Press <code>1</code> to toggle.
          </strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Box>
        </Box>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
        <Box
          borderColor="gray.5"
          ref={containerRef2 as React.RefObject<HTMLDivElement>}
          m={2}
          p={2}
          borderWidth="1px"
          borderStyle="solid"
          borderRadius={2}
        >
          <strong>
            Trap zone ({trapEnabled2 ? 'enabled' : 'disabled'})! Press <code>2</code> to toggle.
          </strong>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <MarginButton>Kiwi</MarginButton>
            <MarginButton>Lemon</MarginButton>
            <MarginButton>Mango</MarginButton>
          </Box>
        </Box>
        <MarginButton>Nectarine</MarginButton>
        <MarginButton>Orange</MarginButton>
        <MarginButton>Peach</MarginButton>
      </Box>
    </>
  )
}
