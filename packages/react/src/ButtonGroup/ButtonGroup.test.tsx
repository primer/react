import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import ButtonGroup from './ButtonGroup'
import {createRef} from 'react'
import {FeatureFlags} from '../FeatureFlags'
import {describe, expect, it, vi} from 'vitest'
import {implementsClassName} from '../utils/testing'
import classes from './ButtonGroup.module.css'

describe('ButtonGroup', () => {
  implementsClassName(ButtonGroup, classes.ButtonGroup)

  it('renders a <div>', () => {
    render(<ButtonGroup data-testid="button-group" />)
    expect(page.getByTestId('button-group').element().tagName).toBe('DIV')
  })

  it('renders data-component attribute', async () => {
    const {container} = render(<ButtonGroup />)
    await expect.element(container.querySelector<HTMLElement>('[data-component="ButtonGroup"]')).toBeInTheDocument()
  })

  it('should respect role prop', async () => {
    render(<ButtonGroup role="toolbar" />)
    await expect.element(page.getByRole('toolbar')).toBeInTheDocument()
  })
})

describe('ButtonGroup forwarded ref (primer_react_merged_forwarded_refs)', () => {
  for (const enabled of [true, false]) {
    describe(`with the flag ${enabled ? 'enabled' : 'disabled'}`, () => {
      it('forwards a ref object to the element', () => {
        const ref = createRef<HTMLDivElement>()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <ButtonGroup ref={ref}>
              <button type="button">A</button>
            </ButtonGroup>
          </FeatureFlags>,
        )
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      it('calls a callback ref with the element', () => {
        const refCallback = vi.fn()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <ButtonGroup ref={refCallback}>
              <button type="button">A</button>
            </ButtonGroup>
          </FeatureFlags>,
        )
        expect(refCallback.mock.calls.some(([el]) => el instanceof HTMLDivElement)).toBe(true)
      })
    })
  }
})
