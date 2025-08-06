import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import {Hidden} from '../Hidden'

describe('Hidden', () => {
  it('renders the styles as expected when a single viewport value is provided as a string via `when` prop', () => {
    const hiddenElement = render(
      <div data-testid="hidden-regular">
        <Hidden when="regular">
          <div>This is hidden when regular viewports</div>
        </Hidden>
      </div>,
    )
    expect(hiddenElement.getAllByTestId('hidden-regular')[0].firstChild).toHaveAttribute(
      'style',
      '--hiddenDisplay-regular: none;',
    )
  })

  it('renders the styles as expected when multiple viewport values are provided as an array via `when` prop', () => {
    const hiddenElement = render(
      <div data-testid="hidden-regular">
        <Hidden when={['narrow', 'wide']}>
          <div>This is hidden when regular viewports</div>
        </Hidden>
      </div>,
    )
    expect(hiddenElement.getAllByTestId('hidden-regular')[0].firstChild).toHaveAttribute(
      'style',
      '--hiddenDisplay-narrow: none; --hiddenDisplay-wide: none;',
    )
  })
})
