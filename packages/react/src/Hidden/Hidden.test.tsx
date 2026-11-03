import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {describe, it, expect} from 'vitest'
import {Hidden} from '../Hidden'
import {implementsClassName} from '../utils/testing'
import classes from './Hidden.module.css'

describe('Hidden', () => {
  implementsClassName(Hidden, classes.Hidden)

  it('renders data-component="Hidden" on the root element', async () => {
    const {container} = render(
      <Hidden when="regular">
        <div>Child</div>
      </Hidden>,
    )

    const el = container.querySelector('[data-component="Hidden"]')
    await expect.element(el).toBeInTheDocument()
  })

  it('renders the styles as expected when a single viewport value is provided as a string via `when` prop', async () => {
    render(
      <div data-testid="hidden-regular">
        <Hidden when="regular">
          <div>This is hidden when regular viewports</div>
        </Hidden>
      </div>,
    )
    await expect
      .element(page.getByTestId('hidden-regular').element().firstChild)
      .toHaveAttribute('style', '--hiddenDisplay-regular: none;')
  })

  it('renders the styles as expected when multiple viewport values are provided as an array via `when` prop', async () => {
    render(
      <div data-testid="hidden-regular">
        <Hidden when={['narrow', 'wide']}>
          <div>This is hidden when regular viewports</div>
        </Hidden>
      </div>,
    )
    await expect
      .element(page.getByTestId('hidden-regular').element().firstChild)
      .toHaveAttribute('style', '--hiddenDisplay-narrow: none; --hiddenDisplay-wide: none;')
  })
})
