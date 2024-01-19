import React from 'react'
import {fireEvent, getByRole, render, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Dialog} from './Dialog'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports, renderStyles, checkStoriesForAxeViolations} from '../utils/testing'
import {mediaQueries} from '../utils/layout'
import {ANIMATION_DURATION, FULL_HEIGHT, HALF_HEIGHT} from './DialogBottomSheet'

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
      <Dialog onClose={() => {}} type="bottom-sheet">
        <div>Hello World</div>
      </Dialog>
    ),
  })

  // Arrow keys support in the testing library is currently not implemented and therefore can't be tested
  // https://github.com/testing-library/user-event/issues/871

  it('expands/contracts when pressing arrow up/down', async () => {
    const onClose = jest.fn()

    const {getByRole} = render(
      <Dialog onClose={onClose} type="bottom-sheet">
        <div>Hello World</div>
      </Dialog>,
    )

    const slider = getByRole('slider')
    slider.focus()

    expect(slider).toHaveFocus()

    fireEvent.change(slider, {target: {value: 2}})

    const dialog = getByRole('dialog')

    expect(dialog).toHaveStyle(`height: ${FULL_HEIGHT}dvh)`)

    fireEvent.change(slider, {target: {value: 1}})

    expect(dialog).toHaveStyle(`height: ${HALF_HEIGHT}dvh)`)
  })

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
