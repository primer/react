import React from 'react'
import {render} from '@testing-library/react'
import {Dialog} from './Dialog'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles, checkStoriesForAxeViolations} from '../utils/testing'
import {mediaQueries} from '../utils/layout'

let matchMedia: MatchMediaMock

describe('Dialog', () => {
  beforeEach(() => {
    matchMedia = new MatchMediaMock()
  })

  afterEach(() => {
    matchMedia.clear()
  })

  behavesAsComponent({
    Component: Dialog,
    options: {skipAs: true, skipSx: true},
    toRender: () => (
      <Dialog onClose={() => {}}>
        <div>Hidden when narrow</div>
      </Dialog>
    ),
  })

  it('renders `when` prop as expected', () => {
    const {container} = render(
      <Dialog onClose={() => {}}>
        <div>Hidden when narrow</div>
      </Dialog>,
    )
    expect(container).toMatchSnapshot()
  })
})
