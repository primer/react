import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {Hidden} from '.'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles, checkStoriesForAxeViolations} from '../utils/testing'

let matchmedia: MatchMediaMock
describe('Hidden', () => {
  beforeAll(() => {
    matchmedia = new MatchMediaMock()
  })
  afterAll(() => {
    matchmedia.clear()
  })
  behavesAsComponent({
    Component: Hidden,
    options: {skipAs: true, skipSx: true},
    toRender: () => (
      <Hidden on={'narrow'}>
        <div>Hidden on narrow</div>
      </Hidden>
    ),
  })
  checkExports('Hidden', {
    default: Hidden,
    Hidden,
  })
  it('renders `on` prop as expected', () => {
    const {container} = render(
      <Hidden on={'narrow'}>
        <div>Hidden on narrow</div>
      </Hidden>,
    )
    expect(container).toMatchSnapshot()
  })
  it('renders the styles as expected when a single viewport value is provided as a string via `on` prop', () => {
    const expectedStyles = {
      [`@media screen and (min-width:768px)`]: {
        display: 'none',
      },
    }
    expect(
      renderStyles(
        <Hidden on="regular">
          <div>This is hidden on regular viewports</div>
        </Hidden>,
      ),
    ).toEqual(expect.objectContaining(expectedStyles))
  })
  it('renders the styles as expected when multiple viewport values are provided as an array via `on` prop', () => {
    const expectedStyles = {
      [`@media screen and (max-width:calc(768px - 0.02px))`]: {
        display: 'none',
      },
      [`@media screen and (min-width:1400px)`]: {
        display: 'none',
      },
    }
    expect(
      renderStyles(
        <Hidden on={['narrow', 'wide']}>
          <div>This is hidden on regular and wide viewports</div>
        </Hidden>,
      ),
    ).toEqual(expect.objectContaining(expectedStyles))
  })
})

// checkStoriesForAxeViolations('examples', '../Hidden/')
