import React from 'react'
import {render} from '@testing-library/react'
import {Hidden} from '.'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'

let matchMedia: MatchMediaMock
describe('Hidden', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  afterAll(() => {
    matchMedia.clear()
  })

  behavesAsComponent({
    Component: Hidden,
    options: {skipAs: true, skipSx: true},
    toRender: () => (
      <Hidden when={'narrow'}>
        <div>Hidden when narrow</div>
      </Hidden>
    ),
  })

  checkExports('Hidden', {
    default: Hidden,
    Hidden,
  })

  it('renders `when` prop as expected', () => {
    const {container} = render(
      <Hidden when={'narrow'}>
        <div>Hidden when narrow</div>
      </Hidden>,
    )
    expect(container).toMatchSnapshot()
  })

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

checkStoriesForAxeViolations('Hidden.features', '../Hidden/')
checkStoriesForAxeViolations('Hidden.examples', '../Hidden/')
