import React from 'react'
import {render, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Dialog} from './Dialog'
import MatchMediaMock from 'jest-matchmedia-mock'
import {behavesAsComponent, checkExports} from '../utils/testing'
import axe from 'axe-core'
import {Button} from '../Button'

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

    expect(onClose).toHaveBeenCalledWith('close-button')
    expect(onClose).toHaveBeenCalledTimes(1) // Ensure it's not called with a backdrop gesture as well
  })

  it('calls `onClose` when clicking the backdrop', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    const {getByRole} = render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    const dialog = getByRole('dialog')
    const backdrop = dialog.parentElement!
    await user.click(backdrop)

    expect(onClose).toHaveBeenCalledWith('escape')
  })

  it('calls `onClose` when keying "Escape"', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()

    render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledWith('escape')
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
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders with data-position-regular="left" when position="left"', () => {
    const {getByRole} = render(<Dialog onClose={() => {}} position="left" />)
    expect(getByRole('dialog')).toHaveAttribute('data-position-regular', 'left')
  })

  it('renders with data-position-regular="right" when position="right"', () => {
    const {getByRole} = render(<Dialog onClose={() => {}} position="right" />)
    expect(getByRole('dialog')).toHaveAttribute('data-position-regular', 'right')
  })

  it('renders with data-position-narrow="fullscreen" when narrow position is fullscreen', () => {
    const {getByRole} = render(<Dialog onClose={() => {}} position={{narrow: 'fullscreen'}} />)
    expect(getByRole('dialog')).toHaveAttribute('data-position-narrow', 'fullscreen')
  })

  it('renders with data-position-narrow="bottom" when narrow position is bottom and data-position-regular="center" when regular is center', () => {
    const {getByRole} = render(<Dialog onClose={() => {}} position={{narrow: 'bottom', regular: 'center'}} />)
    expect(getByRole('dialog')).toHaveAttribute('data-position-narrow', 'bottom')
    expect(getByRole('dialog')).toHaveAttribute('data-position-regular', 'center')
  })

  it('automatically returns focus to the trigger element when the dialog closes', async () => {
    const Fixture = () => {
      const [isOpen, setIsOpen] = React.useState(false)

      return (
        <>
          <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
          {isOpen && (
            <Dialog title="title" onClose={() => setIsOpen(false)}>
              body
            </Dialog>
          )}
        </>
      )
    }

    const {getByRole, getByLabelText, queryByRole} = render(<Fixture />)
    const triggerButton = getByRole('button', {name: 'Open dialog'})

    const user = userEvent.setup()
    await user.tab() // tab into the story, this should focus on the first button
    expect(triggerButton).toHaveFocus()

    await user.click(triggerButton)
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument())

    await user.click(getByLabelText('Close'))

    expect(queryByRole('dialog')).toBeNull()
    expect(triggerButton).toHaveFocus()
  })

  it('returns focus to the element passed in returnFocusRef when the dialog closes', async () => {
    const Fixture = () => {
      const [isOpen, setIsOpen] = React.useState(false)
      const triggerRef = React.useRef<HTMLButtonElement>(null)

      return (
        <>
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            Show dialog (button 1)
          </Button>
          <Button variant="primary" ref={triggerRef}>
            return focus to (button 2)
          </Button>

          {isOpen && (
            <Dialog title="title" onClose={() => setIsOpen(false)} returnFocusRef={triggerRef}>
              body
            </Dialog>
          )}
        </>
      )
    }

    const {getByRole, getByLabelText} = render(<Fixture />)
    const triggerButton = getByRole('button', {name: 'Show dialog (button 1)'})

    const user = userEvent.setup()
    await user.tab() // tab into the story, this should focus on the first button
    expect(triggerButton).toHaveFocus()

    await user.click(triggerButton)
    await user.click(getByLabelText('Close'))

    expect(getByRole('button', {name: 'return focus to (button 2)'})).toHaveFocus()
  })
})

it('automatically focuses the element that is specified as initialFocusRef', () => {
  const initialFocusRef = React.createRef<HTMLAnchorElement>()
  const {getByRole} = render(
    <Dialog
      initialFocusRef={initialFocusRef}
      onClose={() => {}}
      title="New issue"
      renderBody={() => (
        <a ref={initialFocusRef} href="https://github.com">
          Item 1
        </a>
      )}
    ></Dialog>,
  )

  expect(getByRole('link')).toHaveFocus()
})
