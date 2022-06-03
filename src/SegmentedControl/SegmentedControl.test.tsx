import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
// import userEvent from '@testing-library/user-event'
// import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import SegmentedControl from './'

const segmentData = [
  {label: 'Preview', iconLabel: 'EyeIcon', icon: () => <EyeIcon aria-label="EyeIcon" />},
  {label: 'Raw', iconLabel: 'FileCodeIcon', icon: () => <FileCodeIcon aria-label="FileCodeIcon" />},
  {label: 'Blame', iconLabel: 'PeopleIcon', icon: () => <PeopleIcon aria-label="PeopleIcon" />}
]

// TODO: improve test coverage
describe('SegmentedControl', () => {
  // behavesAsComponent({
  //   Component: SegmentedControl,
  //   toRender: () => (
  //     <SegmentedControl aria-label="File view">
  //       <SegmentedControl.Button selected>Preview</SegmentedControl.Button>
  //       <SegmentedControl.Button>Raw</SegmentedControl.Button>
  //       <SegmentedControl.Button>Blame</SegmentedControl.Button>
  //     </SegmentedControl>
  //   )
  // })

  it('renders with a selected segment', () => {
    const {getByText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )
    const selectedButton = getByText('Raw').closest('button')
    expect(selectedButton?.getAttribute('aria-pressed')).toBe('true')
  })
})
