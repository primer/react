import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import {Dialog} from './Dialog'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent} from '../utils/testing'
import {FULL_HEIGHT, HALF_HEIGHT} from './DialogBottomSheet'
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

  it('opens the bottom sheet on mount', () => {
    const {getByRole} = render(
      <Dialog onClose={() => {}} type="bottom-sheet">
        My dialog content
      </Dialog>,
    )

    expect(getByRole('dialog')).toHaveStyle(`height: ${HALF_HEIGHT}dvh)`)
  })

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

  it('`onClose` is called when clicking close', async () => {
    const onClose = jest.fn()
    const {getByLabelText} = render(
      <Dialog onClose={onClose} type="bottom-sheet">
        <div>Hello World</div>
      </Dialog>,
    )

    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(getByLabelText('Close'))

    expect(onClose).toHaveBeenCalled()
  })

  it('is dialog and has the aria-model attribute', () => {
    const {getByRole} = render(
      <Dialog onClose={() => {}} type="bottom-sheet">
        My dialog content
      </Dialog>,
    )

    const dialog = getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('`onClose` is called when clicking the overlay', async () => {
    const mockOnClose = jest.fn()

    const {getByTestId} = render(
      <Dialog onClose={mockOnClose} type="bottom-sheet">
        My dialog content
      </Dialog>,
    )
    expect(mockOnClose).not.toHaveBeenCalled()
    fireEvent.click(getByTestId('overlay'))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
