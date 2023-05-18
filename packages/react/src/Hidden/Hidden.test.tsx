import React from 'react'
import {render} from '@testing-library/react'
import {Hidden} from '.'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles, checkStoriesForAxeViolations} from '../utils/testing'
import {mediaQueries} from '../utils/layout'

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
    const expectedStyles = {
      // `.replace` is used because renderStyles return the JSON object without a space after the column
      [`${mediaQueries.regular.replace(': ', ':')}`]: {
        display: 'none',
      },
    }
    expect(
      renderStyles(
        <Hidden when="regular">
          <div>This is hidden when regular viewports</div>
        </Hidden>,
      ),
    ).toEqual(expect.objectContaining(expectedStyles))
  })

  it('renders the styles as expected when multiple viewport values are provided as an array via `when` prop', () => {
    const expectedStyles = {
      [`${mediaQueries.narrow.replace(': ', ':')}`]: {
        display: 'none',
      },
      [`${mediaQueries.wide.replace(': ', ':')}`]: {
        display: 'none',
      },
    }
    expect(
      renderStyles(
        <Hidden when={['narrow', 'wide']}>
          <div>This is hidden when regular and wide viewports</div>
        </Hidden>,
      ),
    ).toEqual(expect.objectContaining(expectedStyles))
  })
})

checkStoriesForAxeViolations('Hidden.features', '../Hidden/')
checkStoriesForAxeViolations('Hidden.examples', '../Hidden/')
