import React from 'react'
import {render} from '@testing-library/react'
import {Dialog} from './Dialog'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles, checkStoriesForAxeViolations} from '../utils/testing'

let matchMedia: MatchMediaMock

describe('Dialog', () => {
  beforeAll(() => {
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
        <div>Hello world</div>
      </Dialog>
    ),
  })
})
