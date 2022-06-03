import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {behavesAsComponent} from '../utils/testing'
import SegmentedControl from './'

// TODO: improve test coverage
describe('SegmentedControl', () => {
  behavesAsComponent({
    Component: SegmentedControl,
    toRender: () => (
      <SegmentedControl aria-label="File view">
        <SegmentedControl.Button selected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button>Blame</SegmentedControl.Button>
      </SegmentedControl>
    )
  })
})
