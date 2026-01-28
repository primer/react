import React, {useCallback, useEffect} from 'react'
import type {Meta} from '@storybook/react-vite'

import {Button, Flash, Stack, Text} from '..'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import classes from './FocusTrap.stories.module.css'

export default {
  title: 'Hooks/useFocusTrap',
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
      <Stack direction="vertical" gap="normal">
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div className={classes.TrapZone} ref={containerRef as React.RefObject<HTMLDivElement>}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Stack direction="vertical" gap="normal">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Stack>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Stack>
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
      <Stack direction="vertical" gap="normal">
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div className={classes.TrapZone} ref={containerRef as React.RefObject<HTMLDivElement>}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Stack direction="vertical" gap="normal">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Stack>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Stack>
    </>
  )
}

export const RestoreFocusMinimal = () => {
  const [enabled, setEnabled] = React.useState(false)
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null)
  const {containerRef} = useFocusTrap({
    disabled: !enabled,
    restoreFocusOnCleanUp: true,
    returnFocusRef: toggleButtonRef,
    allowOutsideClick: true,
  })

  useOnEscapePress(
    React.useCallback(
      e => {
        if (!enabled) return
        e.preventDefault()
        setEnabled(false)
      },
      [enabled, setEnabled],
    ),
    [enabled, setEnabled],
  )

  return (
    <>
      <HelperGlobalStyling />
      <Stack direction="vertical" gap="normal">
        <Flash style={{marginBottom: 'var(--base-size-12)'}}>
          Minimal focus trap example. Click to toggle focus trap to toggle. While enabled, focus stays inside the green
          zone. Disabling restores focus to the toggle button.
        </Flash>
        <Button
          ref={toggleButtonRef}
          onClick={() => {
            if (enabled) {
              setEnabled(false)
            } else {
              setEnabled(true)
            }
          }}
        >
          {enabled ? 'Disable' : 'Enable'} focus trap
        </Button>
        <div
          style={{
            height: '900px',
            overflow: 'auto',
            border: '1px dashed var(--borderColor-default)',
            padding: 'var(--base-size-16)',
            background: 'var(--bgColor-muted)',
          }}
          aria-hidden="true"
        >
          <Text
            as="p"
            style={{
              fontSize: '12px',
              lineHeight: '1.25',
              margin: 0,
            }}
          >
            Scroll down to reach the trap zone. This spacer exists so that when the trap zone becomes active you can
            scroll such that the original toggle button is no longer visible. When you press Escape or the Close trap
            button, focus will still restore to the toggle button and the browser will scroll it back into view.
          </Text>
          <Text
            as="p"
            style={{
              fontSize: '12px',
              lineHeight: '1.25',
              margin: 0,
            }}
          >
            (Content intentionally verbose to create vertical space.)
          </Text>
        </div>
        <div className={classes.TrapZone} ref={containerRef as React.RefObject<HTMLDivElement>}>
          <Stack direction="vertical" gap="normal">
            <MarginButton>First</MarginButton>
            <MarginButton>Second</MarginButton>
            <MarginButton>Third</MarginButton>
            <Button onClick={() => setEnabled(false)}>Close trap</Button>
          </Stack>
        </div>
        <Button>Click here to escape trap</Button>
      </Stack>
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
      <Stack direction="vertical" gap="normal">
        <Flash style={{marginBottom: 'var(--base-size-12)'}}>
          This story is the same as the `Focus Trap` story, except, when the trap zone is activated, the
          &ldquo;Elderberry&rdquo; button will receive the initial focus (if the trap zone container does not already
          have focus).
        </Flash>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div className={classes.TrapZone} ref={containerRef as React.RefObject<HTMLDivElement>}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Stack direction="vertical" gap="normal">
            <MarginButton>Durian</MarginButton>
            <MarginButton ref={initialFocusRef as React.RefObject<HTMLButtonElement>}>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Stack>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Stack>
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
      <Stack direction="vertical" gap="normal">
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div className={classes.TrapZone} ref={containerRef as React.RefObject<HTMLDivElement>}>
          <strong>Trap zone! Press SPACE to {trapEnabled ? 'deactivate' : 'activate'}.</strong>
          <Stack direction="vertical" gap="normal">
            <ToggleableButton name="Durian"></ToggleableButton>
            <ToggleableButton name="Elderberry"></ToggleableButton>
            <ToggleableButton name="Fig"></ToggleableButton>
          </Stack>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
      </Stack>
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
      <Stack direction="vertical" gap="normal">
        <Flash style={{marginBottom: 'var(--base-size-12)'}}>
          This story demonstrates the global nature of focus traps. When a focus trap is enabled, if there is already an
          active focus trap, it becomes suspended and pushed onto a stack. Once the newly-active focus trap is disabled,
          the most recently-suspended trap will reactivate. Suspended focus traps can be disabled, causing them to be
          removed from the stack of suspended traps.
        </Flash>
        <div className={classes.Legend}>
          Legend
          <Stack direction="horizontal" gap="condensed" align="center">
            <div className={classes.LegendItem}></div>
            <Text> - Inactive</Text>
          </Stack>
          <Stack direction="horizontal" gap="condensed" align="center">
            <div className={`${classes.LegendItem} ${classes.LegendItemSuspended}`}></div>
            <Text> - Suspended</Text>
          </Stack>
          <Stack direction="horizontal" gap="condensed" align="center">
            <div className={`${classes.LegendItem} ${classes.LegendItemActive}`}></div>
            <Text> - Active</Text>
          </Stack>
        </div>
        <MarginButton>Apple</MarginButton>
        <MarginButton>Banana</MarginButton>
        <MarginButton>Cantaloupe</MarginButton>
        <div className={classes.TrapZoneSmall} ref={containerRef1 as React.RefObject<HTMLDivElement>}>
          <strong>
            Trap zone ({trapEnabled1 ? 'enabled' : 'disabled'})! Press <code>1</code> to toggle.
          </strong>
          <Stack direction="vertical" gap="normal">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
          </Stack>
        </div>
        <MarginButton>Grapefruit</MarginButton>
        <MarginButton>Honeydew</MarginButton>
        <MarginButton>Jackfruit</MarginButton>
        <div className={classes.TrapZoneSmall} ref={containerRef2 as React.RefObject<HTMLDivElement>}>
          <strong>
            Trap zone ({trapEnabled2 ? 'enabled' : 'disabled'})! Press <code>2</code> to toggle.
          </strong>
          <Stack direction="vertical" gap="normal">
            <MarginButton>Kiwi</MarginButton>
            <MarginButton>Lemon</MarginButton>
            <MarginButton>Mango</MarginButton>
          </Stack>
        </div>
        <MarginButton>Nectarine</MarginButton>
        <MarginButton>Orange</MarginButton>
        <MarginButton>Peach</MarginButton>
      </Stack>
    </>
  )
}
