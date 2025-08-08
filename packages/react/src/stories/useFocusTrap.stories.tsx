import React, {useCallback, useEffect} from 'react'
import type {Meta} from '@storybook/react-vite'
import {clsx} from 'clsx'

import {BaseStyles, Button, Text, ThemeProvider} from '..'
import {useFocusTrap} from '../hooks/useFocusTrap'
import classes from './FocusTrapStories.module.css'

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

// Helper styles for visual aid in this story
const HelperGlobalStyling = () => (
  <style>
    {`
      *:focus {
        outline: 2px solid var(--bgColor-accent-emphasis) !important;
      }
      [data-focus-trap='active'] {
        background-color: var(--bgColor-success-muted);
      }
      [data-focus-trap='suspended'] {
        background-color: var(--bgColor-attention-muted);
      }
    `}
  </style>
)

const MarginButton = ({children, ...props}: React.ComponentProps<typeof Button>) => (
  <Button className={classes.MarginButton} {...props}>
    {children}
  </Button>
)

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
      <div className={classes.FlexColumn}>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div ref={containerRef as React.RefObject<HTMLDivElement>} className={classes.TrapZone}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <div className={classes.FlexColumn}>
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </div>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </div>
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
      <div className={classes.FlexColumn}>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div ref={containerRef as React.RefObject<HTMLDivElement>} className={classes.TrapZone}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <div className={classes.FlexColumn}>
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </div>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </div>
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
      <div className={classes.FlexColumn}>
        <div className={classes.FlashMessage}>
          This story is the same as the `Focus Trap` story, except, when the trap zone is activated, the
          &ldquo;Elderberry&rdquo; button will receive the initial focus (if the trap zone container does not already
          have focus).
        </div>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div ref={containerRef as React.RefObject<HTMLDivElement>} className={classes.TrapZone}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <div className={classes.FlexColumn}>
            <MarginButton>Durian</MarginButton>
            <MarginButton ref={initialFocusRef as React.RefObject<HTMLButtonElement>}>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </div>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </div>
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
      <div className={classes.FlexColumn}>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div ref={containerRef as React.RefObject<HTMLDivElement>} className={classes.TrapZone}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <div className={classes.FlexColumn}>
            <ToggleableButton name="Durian"></ToggleableButton>
            <ToggleableButton name="Elderberry"></ToggleableButton>
            <ToggleableButton name="Fig"></ToggleableButton>
          </div>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </div>
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
      <div className={classes.FlexColumn}>
        <div className={classes.FlashMessage}>
          This story demonstrates the global nature of focus traps. When a focus trap is enabled, if there is already an
          active focus trap, it becomes suspended and pushed onto a stack. Once the newly-active focus trap is disabled,
          the most recently-suspended trap will reactivate. Suspended focus traps can be disabled, causing them to be
          removed from the stack of suspended traps.
        </div>
        <div className={classes.LegendContainer}>
          Legend
          <div className={classes.FlexRow}>
            <div className={classes.LegendBox}></div>
            <Text> - Inactive</Text>
          </div>
          <div className={classes.FlexRow}>
            <div className={clsx(classes.LegendBox, classes.LegendBoxSuspended)}></div>
            <Text> - Suspended</Text>
          </div>
          <div className={classes.FlexRow}>
            <div className={clsx(classes.LegendBox, classes.LegendBoxActive)}></div>
            <Text> - Active</Text>
          </div>
        </div>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div ref={containerRef1 as React.RefObject<HTMLDivElement>} className={classes.MultipleTrapZone}>
          <strong>
            Trap zone ({trapEnabled1 ? 'enabled' : 'disabled'})! Press <code>1</code> to toggle.
          </strong>
          <div className={classes.FlexColumn}>
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </div>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
        <div ref={containerRef2 as React.RefObject<HTMLDivElement>} className={classes.MultipleTrapZone}>
          <strong>
            Trap zone ({trapEnabled2 ? 'enabled' : 'disabled'})! Press <code>2</code> to toggle.
          </strong>
          <div className={classes.FlexColumn}>
            <MarginButton>Kiwi</MarginButton>
            <MarginButton>Lemon</MarginButton>
            <MarginButton>Mango</MarginButton>
          </div>
        </div>
        <MarginButton>Nectarine</MarginButton>
        <MarginButton>Orange</MarginButton>
        <MarginButton>Peach</MarginButton>
      </div>
    </>
  )
}
