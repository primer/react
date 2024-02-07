import React from 'react'
import {render, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Dialog} from './Dialog'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports} from '../utils/testing'
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
    options: {skipAs: true, skipSx: true},
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

  it('renders with role "dialog" by default', () => {
    const {getByRole} = render(<Dialog onClose={() => {}}>Pay attention to me</Dialog>)

    expect(getByRole('dialog')).toBeInTheDocument()
  })

  it('renders with role "alertdialog" when passed', () => {
    const {getByRole} = render(
      <Dialog role="alertdialog" onClose={() => {}}>
        Definitely pay attention to me
      </Dialog>,
    )

    expect(getByRole('alertdialog')).toBeInTheDocument()
  })
  it('automatically focuses the footer button when `autoFocus` is true', async () => {
    const {getByRole} = render(
      <Dialog onClose={() => {}} footerButtons={[{buttonType: 'primary', content: 'Footer button', autoFocus: true}]}>
        Pay attention to me
      </Dialog>,
    )

    await waitFor(() => expect(getByRole('button', {name: 'Footer button'})).toHaveFocus())
  })

  it('calls `onClose` when clicking the close button', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    const {getByLabelText} = render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    await user.click(getByLabelText('Close'))

    expect(onClose).toHaveBeenCalled()
  })

  it('calls `onClose` when keying "Escape"', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()

    render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })

  it('changes the <body> style for `overflow` if it is not set to "hidden"', () => {
    document.body.style.overflow = 'scroll'

    const {container} = render(<Dialog onClose={() => {}}>Pay attention to me</Dialog>)

    expect(container.ownerDocument.body.style.overflow).toBe('hidden')
  })

  it('does not attempt to change the <body> style for `overflow` if it is already set to "hidden"', () => {
    document.body.style.overflow = 'hidden'

    const {container} = render(<Dialog onClose={() => {}}>Pay attention to me</Dialog>)

    expect(container.ownerDocument.body.style.overflow).toBe('hidden')
  })

  it('should have no axe violations', async () => {
    const {container} = render(<Dialog onClose={() => {}}>Pay attention to me</Dialog>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
