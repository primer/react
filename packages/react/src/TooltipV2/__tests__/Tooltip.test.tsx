import type React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import type {TooltipProps} from '../Tooltip'
import {Tooltip} from '../Tooltip'
import {act, fireEvent, render as HTMLRender} from '@testing-library/react'
import BaseStyles from '../../BaseStyles'
import {Button, IconButton} from '../../Button'
import {ActionMenu} from '../../ActionMenu'
import {ActionList} from '../../ActionList'
import ButtonGroup from '../../ButtonGroup'
import {XIcon} from '@primer/octicons-react'
import classes from '../Tooltip.module.css'

import type {JSX} from 'react'
import {createRef, forwardRef, useImperativeHandle, useState} from 'react'
import {FeatureFlags} from '../../FeatureFlags'
import {implementsClassName, withExpectedConsoleError, withExpectedConsoleWarning} from '../../utils/testing'

const TooltipComponent = (props: Omit<TooltipProps, 'text'> & {text?: string}) => (
  <Tooltip text="Tooltip text" {...props}>
    <Button>Button Text</Button>
  </Tooltip>
)

const TooltipComponentWithExistingDescription = (props: Omit<TooltipProps, 'text'> & {text?: string}) => (
  <>
    <span id="external-description">External description</span>
    <Tooltip text="Tooltip text" {...props}>
      <Button aria-describedby="external-description">Button Text</Button>
    </Tooltip>
  </>
)

const InvalidRefTrigger = forwardRef<HTMLElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({children, ...props}, forwardedRef) => {
    useImperativeHandle(forwardedRef, () => ({}) as HTMLElement, [])
    return (
      <button type="button" {...props}>
        {children}
      </button>
    )
  },
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExampleWithActionMenu({actionMenuTrigger}: {actionMenuTrigger: React.ReactElement<any>}): JSX.Element {
  return (
    <BaseStyles>
      <ActionMenu>
        {actionMenuTrigger}
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item>New file</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </BaseStyles>
  )
}

describe('Tooltip', () => {
  implementsClassName(TooltipComponent, classes.Tooltip)
  it('renders `data-direction="s"` by default', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    expect(getByText('Tooltip text')).toHaveAttribute('data-direction', 's')
  })
  it('renders `data-direction` attribute with the correct value when the `direction` prop is specified', () => {
    const {getByText} = HTMLRender(<TooltipComponent direction="n" />)
    expect(getByText('Tooltip text')).toHaveAttribute('data-direction', 'n')
  })
  it('labels the trigger element by its tooltip when the tooltip type is label', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent type="label" />)
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('Tooltip text')
    expect(triggerEL).toHaveAttribute('aria-labelledby', tooltipEl.id)
  })
  it('renders aria-hidden on the tooltip element when the tooltip is label type', () => {
    const {getByText} = HTMLRender(<TooltipComponent type="label" />)
    expect(getByText('Tooltip text')).toHaveAttribute('aria-hidden', 'true')
  })
  it('renders aria-hidden on the tooltip element when the tooltip is description type', () => {
    const {getByText} = HTMLRender(<TooltipComponent type="description" />)
    expect(getByText('Tooltip text')).toHaveAttribute('aria-hidden', 'true')
  })
  it('describes the trigger element by its tooltip when the tooltip type is description (by default)', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponent />)
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('Tooltip text')
    expect(triggerEL.getAttribute('aria-describedby')).toContain(tooltipEl.id)
  })
  it('renders the tooltip element with role="tooltip" when the tooltip type is description (by default)', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    expect(getByText('Tooltip text')).toHaveAttribute('role', 'tooltip')
  })

  it('spreads the accessibility attributes correctly on the trigger (ActionMenu.Button) when tooltip is used in an action menu', () => {
    const {getByRole, getByText} = HTMLRender(
      <ExampleWithActionMenu
        actionMenuTrigger={
          <Tooltip text="Additional context about the menu button">
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
          </Tooltip>
        }
      />,
    )
    const menuButton = getByRole('button')
    const tooltip = getByText('Additional context about the menu button')
    expect(menuButton.getAttribute('aria-describedby')).toContain(tooltip.id)
    expect(menuButton).toHaveAttribute('aria-haspopup', 'true')
  })

  it('spreads the accessibility attributes correctly on the trigger (Button) when tooltip is used in an action menu', () => {
    const {getByRole, getByText} = HTMLRender(
      <ExampleWithActionMenu
        actionMenuTrigger={
          <ActionMenu.Anchor>
            <Tooltip text="Additional context about the menu button">
              <Button>Toggle Menu</Button>
            </Tooltip>
          </ActionMenu.Anchor>
        }
      />,
    )
    const menuButton = getByRole('button')
    const tooltip = getByText('Additional context about the menu button')
    expect(menuButton.getAttribute('aria-describedby')).toContain(tooltip.id)
    expect(menuButton).toHaveAttribute('aria-haspopup', 'true')
  })
  it('uses the custom tooltip id (if present) to label the trigger element', () => {
    const {getByRole} = HTMLRender(
      <Tooltip id="custom-tooltip-id" text="Close feedback form" direction="nw" type="label">
        <IconButton aria-labelledby="custom-tooltip-id" icon={XIcon} variant="invisible" onClick={() => {}} />
      </Tooltip>,
    )
    const triggerEL = getByRole('button')
    expect(triggerEL).toHaveAttribute('aria-labelledby', 'custom-tooltip-id')
  })
  it('uses the custom tooltip id (if present) to described the trigger element', () => {
    const {getByRole} = HTMLRender(
      <Tooltip text="This operation cannot be reverted" id="custom-tooltip-id">
        <Button>Delete</Button>
      </Tooltip>,
    )
    const triggerEL = getByRole('button')
    expect(triggerEL.getAttribute('aria-describedby')).toContain('custom-tooltip-id')
  })
  it('throws an error if the trigger element is disabled', () => {
    withExpectedConsoleError(() => {
      expect(() => {
        HTMLRender(
          <Tooltip text="Tooltip text" direction="n">
            <Button disabled>Delete</Button>
          </Tooltip>,
        )
      }).toThrow(
        'The `Tooltip` component expects a single React element that contains interactive content. Consider using a `<button>` or equivalent interactive element instead.',
      )
    })
  })
  it('should warn and render the trigger unchanged if it is a React Fragment', () => {
    withExpectedConsoleWarning(() => {
      const {getByRole, queryByText} = HTMLRender(
        <Tooltip text="Tooltip text">
          <>
            <Button>Button Text</Button>
          </>
        </Tooltip>,
      )

      expect(getByRole('button', {name: 'Button Text'})).toBeInTheDocument()
      expect(queryByText('Tooltip text')).not.toBeInTheDocument()
    })
  })
  it('does not throw an error when the trigger element is a button in a fieldset', () => {
    const {getByRole} = HTMLRender(
      <fieldset>
        <legend>Legend</legend>
        <Tooltip text="Tooltip text">
          <button type="button">Button Text</button>
        </Tooltip>
      </fieldset>,
    )

    const triggerEL = getByRole('button')
    expect(triggerEL).toBeInTheDocument()
  })
  it('allows for two-level deep interactive elements', () => {
    const {getByText} = HTMLRender(
      <Tooltip text="Tooltip text">
        <ButtonGroup>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </Tooltip>,
    )

    const triggerEL = getByText('Button 1')
    expect(triggerEL).toBeInTheDocument()
  })
  it('includes keybinding hints in the label text', () => {
    const {getByRole} = HTMLRender(<TooltipComponent type="label" keybindingHint="Control+K" />)
    expect(getByRole('button', {name: 'Tooltip text (control k)'})).toBeInTheDocument()
  })
  it('allows overriding the accessible label with aria-label', () => {
    const {getByRole} = HTMLRender(
      <TooltipComponent type="label" keybindingHint="Control+K" aria-label="Overridden label" />,
    )
    expect(getByRole('button', {name: 'Overridden label'})).toBeInTheDocument()
  })
  it('includes multiple keybinding hints joined with "or" in the label text', () => {
    const {getByRole} = HTMLRender(<TooltipComponent type="label" keybindingHint={['Control+K', 'Control+Shift+K']} />)
    expect(getByRole('button', {name: 'Tooltip text (control k or control shift k)'})).toBeInTheDocument()
  })
  it('renders multiple keybinding hints when an array is provided', () => {
    const {getAllByTestId, container} = HTMLRender(
      <TooltipComponent keybindingHint={['Control+K', 'Control+Shift+K']} />,
    )
    expect(getAllByTestId('keybinding-hint')).toHaveLength(2)
    // Verify the "or" separator is rendered between keybinding hints
    const hintContainer = container.querySelector('[aria-hidden="true"] [aria-hidden="true"]')
    expect(hintContainer?.textContent).toContain(' or ')
  })
  it('treats an empty array keybindingHint as if no hint was provided', () => {
    const {queryByTestId} = HTMLRender(<TooltipComponent keybindingHint={[]} />)
    expect(queryByTestId('keybinding-hint')).not.toBeInTheDocument()
  })

  it('should append tooltip id to existing aria-describedby value on the trigger element', () => {
    const {getByRole, getByText} = HTMLRender(<TooltipComponentWithExistingDescription />)
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('Tooltip text')
    const externalDescription = getByText('External description')

    // Check that aria-describedby contains both the external description ID and the tooltip ID
    const describedBy = triggerEL.getAttribute('aria-describedby')
    expect(describedBy).toContain(externalDescription.id)
    expect(describedBy).toContain(tooltipEl.id)
  })
})

describe('Tooltip with empty text', () => {
  const getTooltipElement = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('[data-component="Tooltip"]')!

  it('does not describe the trigger', () => {
    const {getByRole} = HTMLRender(<TooltipComponent text="" />)
    expect(getByRole('button')).not.toHaveAttribute('aria-describedby')
  })

  it('does not label the trigger when the tooltip type is label', () => {
    const {getByRole} = HTMLRender(<TooltipComponent text="" type="label" />)
    const trigger = getByRole('button')
    expect(trigger).not.toHaveAttribute('aria-labelledby')
    expect(trigger).toHaveAccessibleName('Button Text')
  })

  it("keeps the trigger's own aria-describedby", () => {
    const {getByRole} = HTMLRender(<TooltipComponentWithExistingDescription text="" />)
    expect(getByRole('button')).toHaveAttribute('aria-describedby', 'external-description')
  })

  it('still labels the trigger when a keybinding hint is provided', () => {
    const {getByRole, container} = HTMLRender(<TooltipComponent text="" type="label" keybindingHint="Control+K" />)
    expect(getByRole('button')).toHaveAttribute(
      'aria-labelledby',
      getTooltipElement(container).querySelector('[id]')!.id,
    )
  })

  it('does not open on keyboard focus', async () => {
    const {container} = HTMLRender(<TooltipComponent text="" />)
    await userEvent.tab()
    expect(page.getByRole('button', {name: 'Button Text', exact: true}).element()).toHaveFocus()
    expect(getTooltipElement(container).matches(':popover-open')).toBe(false)
  })

  it('closes an open tooltip when the text becomes empty', async () => {
    const {container, rerender} = HTMLRender(<TooltipComponent />)
    const tooltip = getTooltipElement(container)
    await userEvent.tab()
    expect(tooltip.matches(':popover-open')).toBe(true)

    rerender(<TooltipComponent text="" />)
    await expect.poll(() => tooltip.matches(':popover-open')).toBe(false)
    expect(getTooltipElement(container)).toBe(tooltip)
  })

  it('opens from a pending hover when the text returns before the delay elapses', () => {
    vi.useFakeTimers()
    try {
      const {container, rerender, getByRole} = HTMLRender(<TooltipComponent />)
      const tooltip = getTooltipElement(container)

      fireEvent.mouseOver(getByRole('button'))
      rerender(<TooltipComponent text="" />)
      rerender(<TooltipComponent text="Back again" />)
      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(tooltip.matches(':popover-open')).toBe(true)
      expect(tooltip).toHaveTextContent('Back again')
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not open from a pending hover when the text is still empty after the delay elapses', () => {
    vi.useFakeTimers()
    try {
      const {container, rerender, getByRole} = HTMLRender(<TooltipComponent />)
      const tooltip = getTooltipElement(container)

      fireEvent.mouseOver(getByRole('button'))
      rerender(<TooltipComponent text="" />)
      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(tooltip.matches(':popover-open')).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps the trigger mounted and focused when the text is toggled', async () => {
    function ConditionalTooltip() {
      const [allowed, setAllowed] = useState(false)
      return (
        <Tooltip text={allowed ? '' : 'Not allowed'}>
          <Button onClick={() => setAllowed(value => !value)}>Toggle</Button>
        </Tooltip>
      )
    }
    const {container} = HTMLRender(<ConditionalTooltip />)
    const button = page.getByRole('button', {name: 'Toggle', exact: true})
    const trigger = button.element()
    const tooltip = getTooltipElement(container)

    await userEvent.tab()
    expect(trigger).toHaveFocus()
    expect(tooltip.matches(':popover-open')).toBe(true)
    expect(trigger).toHaveAccessibleDescription('Not allowed')

    await userEvent.keyboard('{Enter}')
    await expect.element(button).not.toHaveAttribute('aria-describedby')
    await expect.poll(() => tooltip.matches(':popover-open')).toBe(false)
    expect(button.element()).toBe(trigger)
    expect(trigger).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await expect.element(button).toHaveAccessibleDescription('Not allowed')
    expect(button.element()).toBe(trigger)
    expect(trigger).toHaveFocus()
  })
})

describe('Tooltip data-component attributes', () => {
  it('renders Tooltip with data-component attribute', () => {
    const {getByText} = HTMLRender(<TooltipComponent />)
    const tooltip = getByText('Tooltip text')
    expect(tooltip).toHaveAttribute('data-component', 'Tooltip')
  })

  it('renders Tooltip.KeybindingHintContainer with data-component attribute when keybindingHint is provided', () => {
    const {container} = HTMLRender(<TooltipComponent keybindingHint="Control+K" />)
    const keybindingHintContainer = container.querySelector('[data-component="Tooltip.KeybindingHintContainer"]')
    expect(keybindingHintContainer).toBeInTheDocument()
  })
})

describe('Tooltip forwarded ref (primer_react_merged_forwarded_refs)', () => {
  for (const enabled of [true, false]) {
    describe(`with the flag ${enabled ? 'enabled' : 'disabled'}`, () => {
      it('forwards a ref object to the trigger element', () => {
        const ref = createRef<HTMLButtonElement>()
        HTMLRender(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Tooltip text="Tooltip text" ref={ref}>
              <Button>Button Text</Button>
            </Tooltip>
          </FeatureFlags>,
        )
        expect(ref.current).toBeInstanceOf(HTMLButtonElement)
        expect(ref.current).toHaveTextContent('Button Text')
      })

      it('calls a callback ref with the trigger element', () => {
        const refCallback = vi.fn()
        const {getByRole} = HTMLRender(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Tooltip text="Tooltip text" ref={refCallback}>
              <Button>Button Text</Button>
            </Tooltip>
          </FeatureFlags>,
        )
        const button = getByRole('button')
        expect(refCallback).toHaveBeenCalledWith(button)
      })

      it("preserves trigger element's own ref", () => {
        const buttonRefCallback = vi.fn()

        const {getByRole} = HTMLRender(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Tooltip text="Tooltip text">
              <Button ref={buttonRefCallback}>Button Text</Button>
            </Tooltip>
          </FeatureFlags>,
        )

        const button = getByRole('button')
        expect(buttonRefCallback).toHaveBeenCalledWith(button)
      })

      it.skipIf(!enabled)("merges trigger's own ref with tooltip ref", () => {
        const buttonRefCallback = vi.fn()
        const tooltipRefCallback = vi.fn()

        const {getByRole} = HTMLRender(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Tooltip text="Tooltip text" ref={tooltipRefCallback}>
              <Button ref={buttonRefCallback}>Button Text</Button>
            </Tooltip>
          </FeatureFlags>,
        )

        const button = getByRole('button')
        expect(buttonRefCallback).toHaveBeenCalledWith(button)
        expect(tooltipRefCallback).toHaveBeenCalledWith(button)
      })

      it('warns without crashing when a custom trigger ref does not resolve to an HTML element', () => {
        withExpectedConsoleWarning(() => {
          const {getByRole} = HTMLRender(
            <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
              <Tooltip text="Tooltip text">
                <InvalidRefTrigger>Button Text</InvalidRefTrigger>
              </Tooltip>
            </FeatureFlags>,
          )

          expect(() => fireEvent.focus(getByRole('button', {name: 'Button Text'}))).not.toThrow()
        })
      })
    })
  }
})
