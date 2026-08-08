import React from 'react'
import {flushSync} from 'react-dom'
import {Button} from '../Button'
import Checkbox from '../Checkbox'
import {Stack} from '../Stack'
import {Tooltip} from './Tooltip'
import classes from './Tooltip.repro.stories.module.css'

export default {
  title: 'Components/TooltipV2/Repro',
  component: Tooltip,
}

// Description type, north direction by default
export const Default = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip text="This tooltip has a red background and a larger font size." className={classes.Popover}>
      <Button>Delete</Button>
    </Tooltip>
  </div>
)

function describeActiveElement() {
  const el = document.activeElement
  if (!el || el === document.body) return 'body'

  const tag = el.tagName.toLowerCase()
  const text = el.textContent ? el.textContent.trim() : ''
  return text ? `${tag} "${text}"` : tag
}

export const ConditionalTooltipWrap = () => {
  const [inactive, setInactive] = React.useState(false)
  const [currentFocus, setCurrentFocus] = React.useState(describeActiveElement)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(function printCurrentActiveElement() {
    const interval = setInterval(() => {
      setCurrentFocus(describeActiveElement())
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Buggy flow: same toggle, but no focus restoration.
  const saveWithoutRestoringFocus = () => {
    setInactive(true)
    window.setTimeout(() => setInactive(false), 2000)
  }

  // Imperative save flow for the fixed buttons: start, then after 2s flip back,
  // restoring focus after each swap. flushSync forces React to commit the
  // remount synchronously so buttonRef points at the new node before focus().
  const saveAndRestoreFocus = () => {
    flushSync(() => {
      setInactive(true)
    })
    if (document.activeElement === document.body) buttonRef.current?.focus()
    window.setTimeout(() => {
      flushSync(() => {
        setInactive(false)
      })
      if (document.activeElement === document.body) buttonRef.current?.focus()
    }, 2000)
  }

  return (
    <>
      <p>
        Current focus: <span style={{fontFamily: 'monospace', fontWeight: 'bold'}}>{currentFocus}</span>
      </p>
      <h3>Buggy</h3>
      <p>
        The element type at this slot swaps between <code>Button</code> and <code>Tooltip</code>, so React unmounts and
        recreates the button. Focusing the button and activating it drops focus to <code>body</code>.
      </p>
      <Stack direction="horizontal">
        {inactive ? (
          <Tooltip text="Saving progress">
            <Button inactive>Saving</Button>
          </Tooltip>
        ) : (
          <Button onClick={saveWithoutRestoringFocus}>Save</Button>
        )}

        <Button>Another button</Button>
      </Stack>
      <br />
      <h3>Fix, Option A: stable tree</h3>
      <p>
        The <code>Tooltip</code> is always mounted and only its <code>text</code> changes, so the button is never
        remounted and focus is preserved. Tradeoff: the active button also gets a tooltip.
      </p>
      <Stack direction="horizontal">
        <Tooltip text={inactive ? 'Saving progress' : 'Save your progress'}>
          <Button inactive={inactive} onClick={inactive ? undefined : saveWithoutRestoringFocus}>
            {inactive ? 'Saving' : 'Save'}
          </Button>
        </Tooltip>

        <Button>Another button</Button>
      </Stack>
      <br />
      <h3>Fix, Option B: restore focus via ref</h3>
      <p>
        Accept the remount, then restore focus with a ref (see <code>saveAndRestoreFocus</code>). The ref goes on the{' '}
        <code>Tooltip</code> in the inactive branch, because <code>Tooltip</code> overrides its child&apos;s ref via{' '}
        <code>cloneElement</code>.
      </p>
      <Stack direction="horizontal">
        {inactive ? (
          <Tooltip text="Saving progress" ref={buttonRef}>
            <Button inactive>Saving</Button>
          </Tooltip>
        ) : (
          <Button ref={buttonRef} onClick={saveAndRestoreFocus}>
            Save
          </Button>
        )}

        <Button>Another button</Button>
      </Stack>
    </>
  )
}

const ALERTS = ['Item 1', 'Item 2', 'Item 3']

export const CheckToActivate = () => {
  const [checked, setChecked] = React.useState<boolean[]>(() => ALERTS.map(() => false))
  const [focus, setFocus] = React.useState(describeActiveElement)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFocus(describeActiveElement())
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const selectedCount = checked.filter(Boolean).length
  const active = selectedCount >= 2

  const toggle = (index: number) => {
    setChecked(prev => prev.map((value, i) => (i === index ? !value : value)))
  }

  return (
    <div>
      <p>
        Current focus: <span style={{fontFamily: 'monospace', fontWeight: 'bold'}}>{focus}</span>
      </p>
      <p>{selectedCount} selected (check at least 2 to activate the button)</p>
      {active ? (
        <Button onClick={() => setChecked(ALERTS.map(() => false))}>Assign to Copilot</Button>
      ) : (
        <Tooltip text="Select at least 2 items to assign to Copilot">
          <Button inactive>Assign to Copilot</Button>
        </Tooltip>
      )}
      <ul style={{listStyle: 'none', paddingLeft: 0, marginTop: 16}}>
        {ALERTS.map((label, index) => (
          <li key={label} style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8}}>
            <Checkbox
              checked={checked[index]}
              onChange={() => toggle(index)}
              aria-label={label}
              id={`alert-${index}`}
            />
            <label htmlFor={`alert-${index}`}>{label}</label>
          </li>
        ))}
      </ul>
    </div>
  )
}
