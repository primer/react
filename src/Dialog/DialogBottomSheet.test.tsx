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

  /*
  behavesAsComponent({
    Component: Dialog,
    options: {skipAs: true, skipSx: true, htmlRenderer: true},
    toRender: () => (
      <Dialog onClose={() => {}} type="bottom-sheet">
        <div>Hello World</div>
      </Dialog>
    ),
  })
  */
  /*
  it('delays calling `onClose` when reduced motion has no preference', async () => {
    const onClose = jest.fn()

    const {getByLabelText} = render(
      <Dialog onClose={onClose} type="bottom-sheet">
        <div>Hello World</div>
      </Dialog>,
    )

    matchMedia.useMediaQuery('(prefers-reduced-motion: no-preference)')

    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(getByLabelText('Close'))

    // Ensures the out-animation happens before calling onClose
    expect(onClose).not.toHaveBeenCalled()

    await waitFor(() => expect(onClose).toHaveBeenCalled(), {timeout: ANIMATION_DURATION + 100})
  })*/

  it('`onClose` is called instantly when reduced motion is enabled', async () => {
    const onClose = jest.fn()
    const {getByLabelText} = render(
      <Dialog onClose={onClose} type="bottom-sheet">
        <div>Hello World</div>
      </Dialog>,
    )

    matchMedia.useMediaQuery('(prefers-reduced-motion: reduce)')

    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(getByLabelText('Close'))

    expect(onClose).toHaveBeenCalled()
  })
})
