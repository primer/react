import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import {Dialog} from './Dialog'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles, checkStoriesForAxeViolations} from '../utils/testing'
import {mediaQueries} from '../utils/layout'
import {ANIMATION_DURATION} from './DialogBottomSheet'

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
    options: {skipAs: true, skipSx: true, htmlRenderer: true},
    toRender: () => (
      <Dialog onClose={() => {}}>
        <div>Hidden when narrow</div>
      </Dialog>
    ),
  })

  checkExports('Dialog/Dialog', {
    default: undefined,
    Dialog,
  })

  it('renders `when` prop as expected', () => {
    const {container} = render(
      <Dialog onClose={() => {}}>
        <div>Hidden when narrow</div>
      </Dialog>,
    )
    expect(container).toMatchSnapshot()
  })

  // it('delays calling `onClose` when reduced motion has no preference', async () => {
  //   const onClose = jest.fn()
  //   const {getByLabelText} = render(
  //     <Dialog
  //       onClose={() => {
  //         console.log('internal onClose handler')
  //         onClose()
  //       }}
  //     >
  //       <div>Hidden when narrow</div>
  //     </Dialog>,
  //   )
  //   matchMedia.useMediaQuery('(prefers-reduced-motion)')

  //   expect(onClose).not.toHaveBeenCalled()
  //   fireEvent.click(getByLabelText('Close'))
  //   await waitFor(() => expect(onClose).toHaveBeenCalled(), {timeout: ANIMATION_DURATION + 100})
  // })
})
