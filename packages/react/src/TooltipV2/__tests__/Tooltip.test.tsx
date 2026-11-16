import {page} from 'vitest/browser'
import type React from 'react'
import {describe, expect, it, vi} from 'vitest'
import type {TooltipProps} from '../Tooltip'
import {Tooltip} from '../Tooltip'
import {fireEvent, render as HTMLRender} from '@testing-library/react'
import BaseStyles from '../../BaseStyles'
import {Button, IconButton} from '../../Button'
import {ActionMenu} from '../../ActionMenu'
import {ActionList} from '../../ActionList'
import ButtonGroup from '../../ButtonGroup'
import {XIcon} from '@primer/octicons-react'
import classes from '../Tooltip.module.css'

import type {JSX} from 'react'
import {createRef, forwardRef, useImperativeHandle} from 'react'
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
  it('renders `data-direction="s"` by default', async () => {
    HTMLRender(<TooltipComponent />)
    await expect.element(page.getByText('Tooltip text')).toHaveAttribute('data-direction', 's')
  })
  it('renders `data-direction` attribute with the correct value when the `direction` prop is specified', async () => {
    HTMLRender(<TooltipComponent direction="n" />)
    await expect.element(page.getByText('Tooltip text')).toHaveAttribute('data-direction', 'n')
  })
  it('labels the trigger element by its tooltip when the tooltip type is label', async () => {
    HTMLRender(<TooltipComponent type="label" />)
    const triggerEL = page.getByRole('button')
    const tooltipEl = page.getByText('Tooltip text')
    await expect.element(triggerEL).toHaveAttribute('aria-labelledby', tooltipEl.element().id)
  })
  it('renders aria-hidden on the tooltip element when the tooltip is label type', async () => {
    HTMLRender(<TooltipComponent type="label" />)
    await expect.element(page.getByText('Tooltip text')).toHaveAttribute('aria-hidden', 'true')
  })
  it('renders aria-hidden on the tooltip element when the tooltip is description type', async () => {
    HTMLRender(<TooltipComponent type="description" />)
    await expect.element(page.getByText('Tooltip text')).toHaveAttribute('aria-hidden', 'true')
  })
  it('describes the trigger element by its tooltip when the tooltip type is description (by default)', () => {
    HTMLRender(<TooltipComponent />)
    const triggerEL = page.getByRole('button')
    const tooltipEl = page.getByText('Tooltip text')
    expect(triggerEL.element().getAttribute('aria-describedby')).toContain(tooltipEl.element().id)
  })
  it('renders the tooltip element with role="tooltip" when the tooltip type is description (by default)', async () => {
    HTMLRender(<TooltipComponent />)
    await expect.element(page.getByText('Tooltip text')).toHaveAttribute('role', 'tooltip')
  })

  it('spreads the accessibility attributes correctly on the trigger (ActionMenu.Button) when tooltip is used in an action menu', async () => {
    HTMLRender(
      <ExampleWithActionMenu
        actionMenuTrigger={
          <Tooltip text="Additional context about the menu button">
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
          </Tooltip>
        }
      />,
    )
    const menuButton = page.getByRole('button')
    const tooltip = page.getByText('Additional context about the menu button')
    expect(menuButton.element().getAttribute('aria-describedby')).toContain(tooltip.element().id)
    await expect.element(menuButton).toHaveAttribute('aria-haspopup', 'true')
  })

  it('spreads the accessibility attributes correctly on the trigger (Button) when tooltip is used in an action menu', async () => {
    HTMLRender(
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
    const menuButton = page.getByRole('button')
    const tooltip = page.getByText('Additional context about the menu button')
    expect(menuButton.element().getAttribute('aria-describedby')).toContain(tooltip.element().id)
    await expect.element(menuButton).toHaveAttribute('aria-haspopup', 'true')
  })
  it('uses the custom tooltip id (if present) to label the trigger element', async () => {
    HTMLRender(
      <Tooltip id="custom-tooltip-id" text="Close feedback form" direction="nw" type="label">
        <IconButton aria-labelledby="custom-tooltip-id" icon={XIcon} variant="invisible" onClick={() => {}} />
      </Tooltip>,
    )
    const triggerEL = page.getByRole('button')
    await expect.element(triggerEL).toHaveAttribute('aria-labelledby', 'custom-tooltip-id')
  })
  it('uses the custom tooltip id (if present) to described the trigger element', () => {
    HTMLRender(
      <Tooltip text="This operation cannot be reverted" id="custom-tooltip-id">
        <Button>Delete</Button>
      </Tooltip>,
    )
    const triggerEL = page.getByRole('button')
    expect(triggerEL.element().getAttribute('aria-describedby')).toContain('custom-tooltip-id')
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
      HTMLRender(
        <Tooltip text="Tooltip text">
          <>
            <Button>Button Text</Button>
          </>
        </Tooltip>,
      )

      expect(page.getByRole('button', {name: 'Button Text'}).element()).toBeInTheDocument()
      expect(page.getByText('Tooltip text').query()).not.toBeInTheDocument()
    })
  })
  it('does not throw an error when the trigger element is a button in a fieldset', async () => {
    HTMLRender(
      <fieldset>
        <legend>Legend</legend>
        <Tooltip text="Tooltip text">
          <button type="button">Button Text</button>
        </Tooltip>
      </fieldset>,
    )

    const triggerEL = page.getByRole('button')
    await expect.element(triggerEL).toBeInTheDocument()
  })
  it('allows for two-level deep interactive elements', async () => {
    HTMLRender(
      <Tooltip text="Tooltip text">
        <ButtonGroup>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </Tooltip>,
    )

    const triggerEL = page.getByText('Button 1')
    await expect.element(triggerEL).toBeInTheDocument()
  })
  it('includes keybinding hints in the label text', async () => {
    HTMLRender(<TooltipComponent type="label" keybindingHint="Control+K" />)
    await expect.element(page.getByRole('button', {name: 'Tooltip text (control k)'})).toBeInTheDocument()
  })
  it('allows overriding the accessible label with aria-label', async () => {
    HTMLRender(<TooltipComponent type="label" keybindingHint="Control+K" aria-label="Overridden label" />)
    await expect.element(page.getByRole('button', {name: 'Overridden label'})).toBeInTheDocument()
  })
  it('includes multiple keybinding hints joined with "or" in the label text', async () => {
    HTMLRender(<TooltipComponent type="label" keybindingHint={['Control+K', 'Control+Shift+K']} />)
    await expect
      .element(page.getByRole('button', {name: 'Tooltip text (control k or control shift k)'}))
      .toBeInTheDocument()
  })
  it('renders multiple keybinding hints when an array is provided', () => {
    const {container} = HTMLRender(<TooltipComponent keybindingHint={['Control+K', 'Control+Shift+K']} />)
    expect(page.getByTestId('keybinding-hint').elements()).toHaveLength(2)
    // Verify the "or" separator is rendered between keybinding hints
    const hintContainer = container.querySelector('[aria-hidden="true"] [aria-hidden="true"]')
    expect(hintContainer?.textContent).toContain(' or ')
  })
  it('treats an empty array keybindingHint as if no hint was provided', async () => {
    HTMLRender(<TooltipComponent keybindingHint={[]} />)
    await expect.element(page.getByTestId('keybinding-hint')).not.toBeInTheDocument()
  })

  it('should append tooltip id to existing aria-describedby value on the trigger element', () => {
    HTMLRender(<TooltipComponentWithExistingDescription />)
    const triggerEL = page.getByRole('button')
    const tooltipEl = page.getByText('Tooltip text')
    const externalDescription = page.getByText('External description')

    // Check that aria-describedby contains both the external description ID and the tooltip ID
    const describedBy = triggerEL.element().getAttribute('aria-describedby')
    expect(describedBy).toContain(externalDescription.element().id)
    expect(describedBy).toContain(tooltipEl.element().id)
  })
})

describe('Tooltip data-component attributes', () => {
  it('renders Tooltip with data-component attribute', async () => {
    HTMLRender(<TooltipComponent />)
    const tooltip = page.getByText('Tooltip text')
    await expect.element(tooltip).toHaveAttribute('data-component', 'Tooltip')
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
        HTMLRender(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Tooltip text="Tooltip text" ref={refCallback}>
              <Button>Button Text</Button>
            </Tooltip>
          </FeatureFlags>,
        )
        const button = page.getByRole('button')
        expect(refCallback).toHaveBeenCalledWith(button.element())
      })

      it("preserves trigger element's own ref", () => {
        const buttonRefCallback = vi.fn()

        HTMLRender(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Tooltip text="Tooltip text">
              <Button ref={buttonRefCallback}>Button Text</Button>
            </Tooltip>
          </FeatureFlags>,
        )

        const button = page.getByRole('button')
        expect(buttonRefCallback).toHaveBeenCalledWith(button.element())
      })

      it.skipIf(!enabled)("merges trigger's own ref with tooltip ref", () => {
        const buttonRefCallback = vi.fn()
        const tooltipRefCallback = vi.fn()

        HTMLRender(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <Tooltip text="Tooltip text" ref={tooltipRefCallback}>
              <Button ref={buttonRefCallback}>Button Text</Button>
            </Tooltip>
          </FeatureFlags>,
        )

        const button = page.getByRole('button')
        expect(buttonRefCallback).toHaveBeenCalledWith(button.element())
        expect(tooltipRefCallback).toHaveBeenCalledWith(button.element())
      })

      it('warns without crashing when a custom trigger ref does not resolve to an HTML element', () => {
        withExpectedConsoleWarning(() => {
          HTMLRender(
            <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
              <Tooltip text="Tooltip text">
                <InvalidRefTrigger>Button Text</InvalidRefTrigger>
              </Tooltip>
            </FeatureFlags>,
          )

          expect(() => fireEvent.focus(page.getByRole('button', {name: 'Button Text'}).element())).not.toThrow()
        })
      })
    })
  }
})
