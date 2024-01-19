import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import {Dialog} from './Dialog'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent} from '../utils/testing'
import {ANIMATION_DURATION, FULL_HEIGHT, HALF_HEIGHT} from './DialogBottomSheet'
import {axe} from 'jest-axe'

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

  it('expands/contracts when using the range slider', async () => {
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

  it('automatically focuses the footer button when `autoFocus` is true', async () => {
    const {getByRole} = render(
      <Dialog
        onClose={() => {}}
        footerButtons={[{buttonType: 'primary', content: 'Footer button', autoFocus: true}]}
        type={'bottom-sheet'}
      >
        Pay attention to me
      </Dialog>,
    )

    await waitFor(() => expect(getByRole('button', {name: 'Footer button'})).toHaveFocus())
  })

  it('changes the <body> style for `overflow` if it is not set to "hidden"', () => {
    document.body.style.overflow = 'scroll'

    const {container} = render(
      <Dialog onClose={() => {}} type="bottom-sheet">
        Pay attention to me
      </Dialog>,
    )

    expect(container.ownerDocument.body.style.overflow).toBe('hidden')
  })

  it('should have no axe violations', async () => {
    const {container} = render(
      <Dialog type="bottom-sheet" onClose={() => {}}>
        Pay attention to me
      </Dialog>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
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

    console.log(matchMedia)
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(getByLabelText('Close'))

    // Ensures the out-animation happens before calling onClose
    expect(onClose).not.toHaveBeenCalled()

    await waitFor(() => expect(onClose).toHaveBeenCalled(), {timeout: ANIMATION_DURATION + 100})
  })
  */

  it('calls `onClose` when keying "Escape"', () => {
    const onClose = jest.fn()
    const {container} = render(
      <Dialog onClose={onClose} type="bottom-sheet">
        Pay attention to me
      </Dialog>,
    )

    expect(onClose).not.toHaveBeenCalled()

    fireEvent.keyDown(container, {key: 'Escape'})

    expect(onClose).toHaveBeenCalled()
  })

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
