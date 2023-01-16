import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {Hidden} from '.'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles, checkStoriesForAxeViolations} from '../utils/testing'
import {viewportRanges} from '../hooks/useResponsiveValue'

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
      // `.replace` is used because renderStyles return the JSON object without a space after the column
      [`@media screen and ${viewportRanges.regular.replace(': ', ':')}`]: {
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
      [`@media screen and ${viewportRanges.narrow.replace(': ', ':')}`]: {
        display: 'none',
      },
      [`@media screen and ${viewportRanges.wide.replace(': ', ':')}`]: {
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

checkStoriesForAxeViolations('features', '../Hidden/')
checkStoriesForAxeViolations('examples', '../Hidden/')
