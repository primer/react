import React from 'react'
import {act, render as renderReact, fireEvent, waitFor, within} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import userEvent from '@testing-library/user-event'
import {Dialog} from './Dialog'
import {FeatureFlags} from '../FeatureFlags'
import {Button} from '../Button'
import Portal, {registerPortalRoot} from '../Portal'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {implementsClassName} from '../utils/testing'
import classes from './Dialog.module.css'
import {ConfirmationDialog} from '../ConfirmationDialog/ConfirmationDialog'

function NativeDialogFlags({children}: React.PropsWithChildren) {
  return <FeatureFlags flags={{primer_react_use_native_dialog: true}}>{children}</FeatureFlags>
}

function render(ui: React.ReactNode) {
  return renderReact(ui, {wrapper: NativeDialogFlags})
}

describe('Dialog with primer_react_use_native_dialog enabled', () => {
  implementsClassName(Dialog, classes.Dialog)
  it.each([undefined, 'dialog'] as const)('uses native dialog semantics with role=%s', role => {
    const {getByRole} = render(
      <Dialog role={role} onClose={() => {}}>
        Pay attention to me
      </Dialog>,
    )

    expect(getByRole('dialog')).toBeInTheDocument()
    expect(getByRole('dialog')).toBeInstanceOf(HTMLDialogElement)
    expect(getByRole('dialog').matches(':modal')).toBe(true)
    expect(getByRole('dialog')).not.toHaveAttribute('role')
    expect(getByRole('dialog')).not.toHaveAttribute('aria-modal')
  })

  describe('Dialog feature flag', () => {
    it('uses the original div-based dialog by default and accepts a div ref', () => {
      const ref = React.createRef<HTMLDivElement>()
      const {getByRole} = renderReact(<Dialog ref={ref} onClose={() => {}} />)
      const dialog = getByRole('dialog')
      expect(dialog).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toBe(dialog)
      expect(dialog).toHaveAttribute('role', 'dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).not.toHaveAttribute('data-native-dialog')
      expect(dialog.parentElement).toHaveClass(classes.Backdrop)
    })

    describe.each([false, true])('primer_react_use_native_dialog=%s', enabled => {
      function renderWithFlag(ui: React.ReactNode) {
        return renderReact(ui, {
          wrapper: ({children}) => {
            return <FeatureFlags flags={{primer_react_use_native_dialog: enabled}}>{children}</FeatureFlags>
          },
        })
      }

      it('selects the appropriate root and modal semantics', () => {
        const {getByRole} = renderWithFlag(<Dialog onClose={() => {}} />)
        const dialog = getByRole('dialog')
        expect(dialog).toBeInstanceOf(enabled ? HTMLDialogElement : HTMLDivElement)
        expect(dialog.matches(':modal')).toBe(enabled)
        if (enabled) {
          expect(dialog).not.toHaveAttribute('role')
          expect(dialog).not.toHaveAttribute('aria-modal')
        } else {
          expect(dialog).toHaveAttribute('role', 'dialog')
          expect(dialog).toHaveAttribute('aria-modal', 'true')
        }
      })

      it('forwards props, children, and the ref to the selected implementation', async () => {
        const user = userEvent.setup()
        const ref = React.createRef<HTMLDivElement | HTMLDialogElement>()
        const onClose = vi.fn()
        const {getByRole, getByText} = renderWithFlag(
          <Dialog
            ref={ref}
            title="Settings"
            subtitle="Edit your preferences"
            width="small"
            height="large"
            position="center"
            align="top"
            className="custom-dialog"
            style={{opacity: 0.9}}
            data-component="CustomDialog"
            footerButtons={[{content: 'Save', autoFocus: true}]}
            onClose={onClose}
          >
            Dialog content
          </Dialog>,
        )
        const dialog = getByRole('dialog', {name: 'Settings'})
        expect(ref.current).toBe(dialog)
        expect(dialog).toHaveAccessibleDescription('Edit your preferences')
        expect(dialog).toHaveAttribute('data-width', 'small')
        expect(dialog).toHaveAttribute('data-height', 'large')
        expect(dialog).toHaveAttribute('data-position-regular', 'center')
        expect(dialog).toHaveAttribute('data-align', 'top')
        expect(dialog).toHaveAttribute('data-component', 'CustomDialog')
        expect(dialog).toHaveClass('custom-dialog')
        expect(dialog).toHaveStyle({opacity: '0.9'})
        expect(dialog).toContainElement(getByText('Dialog content'))
        expect(getByRole('button', {name: 'Save'})).toHaveFocus()
        await user.click(getByRole('button', {name: 'Close'}))
        expect(onClose).toHaveBeenCalledExactlyOnceWith('close-button')
      })

      it('preserves shared compound slots in both implementations', () => {
        const {getByRole, getByText} = renderWithFlag(
          <Dialog onClose={() => {}}>
            <Dialog.Header>Custom header</Dialog.Header>
            <Dialog.Body>Custom body</Dialog.Body>
            <Dialog.Footer>Custom footer</Dialog.Footer>
          </Dialog>,
        )
        const dialog = getByRole('dialog')
        expect(dialog).toContainElement(getByText('Custom header'))
        expect(dialog).toContainElement(getByText('Custom body'))
        expect(dialog).toContainElement(getByText('Custom footer'))
        expect(dialog).toHaveAttribute('data-has-footer')
      })

      it('focuses the requested element and restores focus on dismissal', async () => {
        const user = userEvent.setup()
        const inputRef = React.createRef<HTMLInputElement>()
        function Fixture() {
          const [open, setOpen] = React.useState(false)
          return (
            <>
              <Button
                onClick={() => {
                  setOpen(true)
                }}
              >
                Open dialog
              </Button>
              {open && (
                <Dialog
                  initialFocusRef={inputRef}
                  onClose={() => {
                    setOpen(false)
                  }}
                >
                  <input ref={inputRef} aria-label="Name" />
                </Dialog>
              )}
            </>
          )
        }
        const {getByRole, queryByRole} = renderWithFlag(<Fixture />)
        const trigger = getByRole('button', {name: 'Open dialog'})
        await user.click(trigger)
        expect(getByRole('textbox', {name: 'Name'})).toHaveFocus()
        await user.click(getByRole('button', {name: 'Close'}))
        expect(queryByRole('dialog')).not.toBeInTheDocument()
        expect(trigger).toHaveFocus()
      })

      it('requests dismissal for Escape without closing independently', async () => {
        const user = userEvent.setup()
        const onClose = vi.fn()
        const inputRef = React.createRef<HTMLInputElement>()
        const {getByRole} = renderWithFlag(
          <Dialog onClose={onClose} initialFocusRef={inputRef}>
            <input ref={inputRef} aria-label="Name" />
          </Dialog>,
        )
        if (enabled) {
          fireEvent(getByRole('dialog'), new Event('cancel', {cancelable: true}))
        } else {
          await user.keyboard('{Escape}')
        }
        expect(onClose).toHaveBeenCalledExactlyOnceWith('escape')
        expect(getByRole('dialog')).toBeVisible()
      })

      it('dismisses for backdrop clicks but not drags from content', () => {
        const onClose = vi.fn()
        const {getByRole} = renderWithFlag(<Dialog onClose={onClose}>Content</Dialog>)
        const dialog = getByRole('dialog')
        if (enabled) {
          const {left, top} = dialog.getBoundingClientRect()
          fireEvent.pointerDown(dialog, {clientX: left + 1, clientY: top + 1})
          fireEvent.click(dialog, {clientX: left - 1, clientY: top - 1})
          expect(onClose).not.toHaveBeenCalled()
          fireEvent.pointerDown(dialog, {clientX: left - 1, clientY: top - 1})
          fireEvent.click(dialog, {clientX: left - 1, clientY: top - 1})
        } else {
          const backdrop = dialog.parentElement!
          fireEvent.mouseDown(dialog)
          fireEvent.click(backdrop)
          expect(onClose).not.toHaveBeenCalled()
          fireEvent.mouseDown(backdrop)
          fireEvent.click(backdrop)
        }
        expect(onClose).toHaveBeenCalledExactlyOnceWith('escape')
      })

      it('only redirects descendant portals for the native modal', () => {
        const {getByRole} = renderWithFlag(
          <Dialog onClose={() => {}}>
            <Portal>
              <button type="button">Portaled action</button>
            </Portal>
          </Dialog>,
        )
        const dialog = getByRole('dialog')
        const action = getByRole('button', {name: 'Portaled action'})
        expect(dialog.contains(action)).toBe(enabled)
      })

      it('dismisses only the innermost dialog when both mount together', async () => {
        const user = userEvent.setup()
        const onOuterClose = vi.fn()
        const onInnerClose = vi.fn()
        const inputRef = React.createRef<HTMLInputElement>()
        const {getByRole} = renderWithFlag(
          <Dialog title="Outer" onClose={onOuterClose}>
            <Dialog title="Inner" onClose={onInnerClose} initialFocusRef={inputRef}>
              <input ref={inputRef} aria-label="Name" />
            </Dialog>
          </Dialog>,
        )
        expect(getByRole('textbox', {name: 'Name'})).toHaveFocus()
        if (enabled) {
          fireEvent(getByRole('dialog', {name: 'Inner'}), new Event('cancel', {cancelable: true}))
        } else {
          await user.keyboard('{Escape}')
        }
        expect(onInnerClose).toHaveBeenCalledExactlyOnceWith('escape')
        expect(onOuterClose).not.toHaveBeenCalled()
      })

      it('preserves ConfirmationDialog semantics and initial focus', () => {
        const {getByRole} = renderWithFlag(
          <ConfirmationDialog title="Delete item?" confirmButtonType="danger" onClose={() => {}} />,
        )
        expect(getByRole('alertdialog')).toBeInstanceOf(enabled ? HTMLDialogElement : HTMLDivElement)
        expect(getByRole('button', {name: 'Cancel'})).toHaveFocus()
      })
    })
  })

  it('keeps the accessible name and description associated with the native dialog', () => {
    const {getByRole} = render(<Dialog title="Settings" subtitle="Edit your preferences" onClose={() => {}} />)
    expect(getByRole('dialog')).toHaveAccessibleName('Settings')
    expect(getByRole('dialog')).toHaveAccessibleDescription('Edit your preferences')
  })

  it('forwards the native dialog ref', () => {
    const ref = React.createRef<HTMLDialogElement>()
    const {getByRole} = render(<Dialog ref={ref} onClose={() => {}} />)
    expect(ref.current).toBe(getByRole('dialog'))
    expect(ref.current?.open).toBe(true)
  })

  it('prevents native cancellation until the owner unmounts the dialog', () => {
    const onClose = vi.fn()
    const {getByRole} = render(<Dialog onClose={onClose} />)
    const dialog = getByRole('dialog')
    const event = new Event('cancel', {cancelable: true})
    fireEvent(dialog, event)
    expect(event.defaultPrevented).toBe(true)
    expect(onClose).toHaveBeenCalledExactlyOnceWith('escape')
    expect(dialog.matches(':modal')).toBe(true)
  })

  it('reopens after an imperative native close while still mounted', async () => {
    const ref = React.createRef<HTMLDialogElement>()
    const onClose = vi.fn()
    render(<Dialog ref={ref} onClose={onClose} />)
    ref.current?.close()
    await waitFor(() => {
      expect(ref.current?.matches(':modal')).toBe(true)
    })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('reopens after a method="dialog" form submission', async () => {
    const user = userEvent.setup()
    const {getByRole} = render(
      <Dialog onClose={() => {}}>
        <form method="dialog">
          <button type="submit">Submit</button>
        </form>
      </Dialog>,
    )
    await user.click(getByRole('button', {name: 'Submit'}))
    await waitFor(() => {
      expect(getByRole('dialog').matches(':modal')).toBe(true)
    })
  })

  it('does not reopen or steal focus when focus options change', () => {
    const firstRef = React.createRef<HTMLButtonElement>()
    const secondRef = React.createRef<HTMLButtonElement>()
    const {rerender} = render(
      <Dialog onClose={() => {}} initialFocusRef={firstRef}>
        <button type="button" ref={firstRef}>
          First
        </button>
        <button type="button" ref={secondRef}>
          Second
        </button>
      </Dialog>,
    )
    secondRef.current?.focus()
    rerender(
      <Dialog onClose={() => {}} initialFocusRef={React.createRef<HTMLButtonElement>()}>
        <button type="button" ref={firstRef}>
          First
        </button>
        <button type="button" ref={secondRef}>
          Second
        </button>
      </Dialog>,
    )
    expect(secondRef.current).toHaveFocus()
  })

  it('keeps the dialog modal in StrictMode and closes it on unmount', () => {
    const ref = React.createRef<HTMLDialogElement>()
    const {unmount} = render(
      <React.StrictMode>
        <Dialog ref={ref} onClose={() => {}} />
      </React.StrictMode>,
    )
    const dialog = ref.current
    expect(dialog?.matches(':modal')).toBe(true)
    unmount()
    expect(dialog?.open).toBe(false)
    expect(document.body).not.toHaveAttribute('data-dialog-scroll-disabled')
  })

  it('keeps descendant portals inside the modal', () => {
    const {getByRole} = render(
      <Dialog onClose={() => {}}>
        <Portal>
          <button type="button">Portaled action</button>
        </Portal>
      </Dialog>,
    )
    const action = getByRole('button', {name: 'Portaled action'})
    expect(getByRole('dialog')).toContainElement(action)
    act(() => {
      action.focus()
    })
    expect(action).toHaveFocus()
  })

  it('keeps named portals inside the modal even when their registered root is outside', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    registerPortalRoot(container, 'dialog-external-portal')
    try {
      const {getByRole, unmount} = render(
        <Dialog onClose={() => {}}>
          <Portal containerName="dialog-external-portal">
            <button type="button">Portaled action</button>
          </Portal>
        </Dialog>,
      )
      const action = getByRole('button', {name: 'Portaled action'})
      expect(getByRole('dialog')).toContainElement(action)
      expect(container).toBeEmptyDOMElement()
      unmount()
    } finally {
      container.remove()
    }
  })

  it('puts initially mounted nested dialogs above their parent', () => {
    const {getByRole} = render(
      <Dialog title="Outer" onClose={() => {}}>
        <Dialog title="Inner" onClose={() => {}}>
          Inner content
        </Dialog>
      </Dialog>,
    )
    const inner = getByRole('dialog', {name: 'Inner'})
    const closeButton = within(inner).getByRole('button', {name: 'Close'})
    expect(closeButton).toHaveFocus()
    expect(inner.matches(':modal')).toBe(true)
    const {left, top, width, height} = closeButton.getBoundingClientRect()
    expect(closeButton.contains(document.elementFromPoint(left + width / 2, top + height / 2))).toBe(true)
  })

  it('keeps menus inside the modal interactive', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onClose = vi.fn()
    const {getByRole} = render(
      <Dialog onClose={onClose}>
        <ActionMenu>
          <ActionMenu.Button>Actions</ActionMenu.Button>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item onSelect={onSelect}>Edit</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Dialog>,
    )
    await user.click(getByRole('button', {name: 'Actions'}))
    const item = getByRole('menuitem', {name: 'Edit'})
    expect(getByRole('dialog')).toContainElement(item)
    expect(item).toHaveFocus()
    await user.click(item)
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('dismisses only the nested dialog and restores focus to its trigger', async () => {
    const user = userEvent.setup()
    const onOuterClose = vi.fn()
    function Fixture() {
      const [open, setOpen] = React.useState(false)
      return (
        <Dialog title="Outer" onClose={onOuterClose}>
          <Button
            onClick={() => {
              setOpen(true)
            }}
          >
            Open inner
          </Button>
          {open && (
            <Dialog
              title="Inner"
              onClose={() => {
                setOpen(false)
              }}
            >
              Inner content
            </Dialog>
          )}
        </Dialog>
      )
    }
    const {getByRole, queryByRole} = render(<Fixture />)
    const trigger = getByRole('button', {name: 'Open inner'})
    await user.click(trigger)
    const inner = getByRole('dialog', {name: 'Inner'})
    expect(inner.matches(':modal')).toBe(true)
    await user.click(within(inner).getByRole('button', {name: 'Close'}))
    expect(queryByRole('dialog', {name: 'Inner'})).not.toBeInTheDocument()
    expect(onOuterClose).not.toHaveBeenCalled()
    expect(trigger).toHaveFocus()
  })

  it('renders with role "alertdialog" when passed', () => {
    const {getByRole} = render(
      <Dialog role="alertdialog" onClose={() => {}}>
        Definitely pay attention to me
      </Dialog>,
    )

    expect(getByRole('alertdialog')).toBeInTheDocument()
    expect(getByRole('alertdialog')).toHaveAttribute('role', 'alertdialog')
    expect(getByRole('alertdialog')).not.toHaveAttribute('aria-modal')
    expect(getByRole('alertdialog').matches(':modal')).toBe(true)
  })
  it('automatically focuses the footer button when `autoFocus` is true', async () => {
    const {getByRole} = render(
      <Dialog onClose={() => {}} footerButtons={[{buttonType: 'primary', content: 'Footer button', autoFocus: true}]}>
        Pay attention to me
      </Dialog>,
    )

    await waitFor(() => expect(getByRole('button', {name: 'Footer button'})).toHaveFocus())
  })

  it('sets data-has-footer when footerButtons are provided', () => {
    const {getByRole} = render(
      <Dialog onClose={() => {}} footerButtons={[{buttonType: 'primary', content: 'OK'}]}>
        Content
      </Dialog>,
    )
    expect(getByRole('dialog')).toHaveAttribute('data-has-footer', '')
  })

  it('does not set data-has-footer when no footer is rendered', () => {
    const {getByRole} = render(
      <Dialog onClose={() => {}} renderFooter={() => null}>
        Content
      </Dialog>,
    )
    expect(getByRole('dialog')).not.toHaveAttribute('data-has-footer')
  })

  it('renders data-component attribute', () => {
    const {getByRole} = render(<Dialog onClose={() => {}}>Content</Dialog>)
    expect(getByRole('dialog')).toHaveAttribute('data-component', 'Dialog')
  })

  it('allows overriding the root data-component attribute', () => {
    const {getByRole} = render(
      <Dialog data-component="ConfirmationDialog" onClose={() => {}}>
        Content
      </Dialog>,
    )
    expect(getByRole('dialog')).toHaveAttribute('data-component', 'ConfirmationDialog')
  })

  it('renders data-component hooks for Dialog subcomponents', () => {
    const {getByRole} = render(
      <Dialog
        onClose={() => {}}
        title="Title"
        subtitle="Subtitle"
        renderHeader={props => (
          <Dialog.Header>
            <Dialog.Title id={props.dialogLabelId}>{props.title}</Dialog.Title>
            <Dialog.Subtitle id={props.dialogDescriptionId}>{props.subtitle}</Dialog.Subtitle>
            <Dialog.CloseButton onClose={() => {}} />
          </Dialog.Header>
        )}
        renderBody={() => <Dialog.Body>Body</Dialog.Body>}
        renderFooter={() => <Dialog.Footer>Footer</Dialog.Footer>}
      />,
    )

    const dialog = getByRole('dialog')

    expect(dialog.querySelector('[data-component="Dialog.Header"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.Title"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.Subtitle"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.CloseButton"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.Body"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.Footer"]')).toBeInTheDocument()
  })

  it('adds a Dialog-scoped data-component hook for footer buttons (and not for body buttons)', () => {
    const {getByRole, getByText} = render(
      <Dialog
        onClose={() => {}}
        footerButtons={[
          {buttonType: 'primary', content: 'Submit'},
          {buttonType: 'default', content: 'Cancel'},
        ]}
      >
        <Button>Body button</Button>
      </Dialog>,
    )

    const dialog = getByRole('dialog')

    // ensure footer buttons have the data-component hook
    const footerButtonHooks = dialog.querySelectorAll('[data-component="Dialog.FooterButton"]')
    expect(footerButtonHooks).toHaveLength(2)

    // ensure we're targeting the correct buttons
    expect(footerButtonHooks[0]).toHaveTextContent('Submit')
    expect(footerButtonHooks[1]).toHaveTextContent('Cancel')

    // ensure we're not targeting other buttons
    const bodyButton = getByText('Body button').closest('button')
    expect(bodyButton).toBeTruthy()
    expect(bodyButton?.closest('[data-component="Dialog.FooterButton"]')).toBeNull()
  })

  it('calls `onClose` when clicking the close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const {getByLabelText} = render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    await user.click(getByLabelText('Close'))

    expect(onClose).toHaveBeenCalledWith('close-button')
    expect(onClose).toHaveBeenCalledTimes(1) // Ensure it's not called with a backdrop gesture as well
  })

  it('calls `onClose` when clicking the backdrop', () => {
    const onClose = vi.fn()
    const {getByRole} = render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    const dialog = getByRole('dialog')
    const {left, top} = dialog.getBoundingClientRect()
    fireEvent.pointerDown(dialog, {clientX: left - 1, clientY: top - 1})
    fireEvent.click(dialog, {clientX: left - 1, clientY: top - 1})

    expect(onClose).toHaveBeenCalledExactlyOnceWith('escape')
  })

  it('does not call `onClose` when click was not originated from backdrop', () => {
    const onClose = vi.fn()

    const {getByRole} = render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    const dialog = getByRole('dialog')
    const {left, top} = dialog.getBoundingClientRect()
    fireEvent.pointerDown(dialog, {clientX: left + 1, clientY: top + 1})
    fireEvent.click(dialog, {clientX: left - 1, clientY: top - 1})

    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not dismiss for clicks inside the dialog bounds or cancelled pointers', () => {
    const onClose = vi.fn()
    const {getByRole} = render(<Dialog onClose={onClose} />)
    const dialog = getByRole('dialog')
    const {left, top} = dialog.getBoundingClientRect()
    fireEvent.pointerDown(dialog, {clientX: left + 1, clientY: top + 1})
    fireEvent.click(dialog, {clientX: left + 1, clientY: top + 1})
    fireEvent.pointerDown(dialog, {clientX: left - 1, clientY: top - 1})
    fireEvent.pointerCancel(dialog)
    fireEvent.click(dialog, {clientX: left - 1, clientY: top - 1})
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls `onClose` when keying "Escape"', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledWith('escape')
  })

  it('calls `onClose` with a single "Escape" keypress when multiple dialogs can be opened', async () => {
    const user = userEvent.setup()

    function ButtonWithDialog({label, onClose}: {label: string; onClose: () => void}) {
      const [isOpen, setIsOpen] = React.useState(false)
      const buttonRef = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <Button ref={buttonRef} onClick={() => setIsOpen(true)}>
            {label}
          </Button>
          {isOpen && (
            <Dialog
              title={label}
              onClose={() => {
                onClose()
                setIsOpen(false)
              }}
              returnFocusRef={buttonRef}
            >
              body
            </Dialog>
          )}
        </>
      )
    }

    const onCloseFirst = vi.fn()
    const onCloseSecond = vi.fn()
    const {getByText} = render(
      <>
        <ButtonWithDialog label="Dialog 1" onClose={onCloseFirst} />
        <ButtonWithDialog label="Dialog 2" onClose={onCloseSecond} />
      </>,
    )

    await user.click(getByText('Dialog 1'))
    await user.keyboard('{Escape}')

    expect(onCloseFirst).toHaveBeenCalled()
    expect(onCloseSecond).not.toHaveBeenCalled()
  })

  it('changes the <body> style for `overflow` if it is not set to "hidden"', () => {
    document.body.style.overflow = 'scroll'

    const {container} = render(<Dialog onClose={() => {}}>Pay attention to me</Dialog>)

    expect(container.ownerDocument.body).toHaveStyle('overflow: hidden')
  })

  it('does not attempt to change the <body> style for `overflow` if it is already set to "hidden"', () => {
    document.body.style.overflow = 'hidden'

    const {container} = render(<Dialog onClose={() => {}}>Pay attention to me</Dialog>)

    expect(container.ownerDocument.body).toHaveStyle('overflow: hidden')
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

  describe('align prop', () => {
    it('sets data-align="top" on the native dialog', () => {
      const {getByRole} = render(<Dialog onClose={() => {}} align="top" />)
      const dialog = getByRole('dialog')
      expect(dialog).toHaveAttribute('data-align', 'top')
    })

    it('sets data-align="bottom" when align is bottom', () => {
      const {getByRole} = render(<Dialog onClose={() => {}} align="bottom" />)
      expect(getByRole('dialog')).toHaveAttribute('data-align', 'bottom')
    })

    it('sets data-align="center" when align is center', () => {
      const {getByRole} = render(<Dialog onClose={() => {}} align="center" />)
      expect(getByRole('dialog')).toHaveAttribute('data-align', 'center')
    })

    it('omits data-align when align is not provided', () => {
      const {getByRole} = render(<Dialog onClose={() => {}} />)
      expect(getByRole('dialog')).not.toHaveAttribute('data-align')
    })

    it('emits data-align attribute even when position is non-center', () => {
      const {getByRole} = render(<Dialog onClose={() => {}} position="left" align="top" />)
      const dialog = getByRole('dialog')
      expect(dialog).toHaveAttribute('data-position-regular', 'left')
      expect(dialog).toHaveAttribute('data-align', 'top')
    })
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

  it('should support `className` on the Dialog element', async () => {
    const Fixture = () => {
      const [isOpen, setIsOpen] = React.useState(true)
      const triggerRef = React.useRef<HTMLButtonElement>(null)

      return (
        <>
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            Show dialog
          </Button>
          {isOpen && (
            <Dialog title="title" onClose={() => setIsOpen(false)} returnFocusRef={triggerRef} className="custom-class">
              body
            </Dialog>
          )}
        </>
      )
    }

    const user = userEvent.setup()

    const component = render(<Fixture />)
    const triggerButton = component.getByRole('button', {name: 'Show dialog'})
    await user.click(triggerButton)
    expect(component.getByRole('dialog')).toHaveClass('custom-class')
    component.unmount()
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

describe('Footer button loading states', () => {
  it('applies loading state to footer buttons', () => {
    const {getByRole} = render(
      <Dialog
        onClose={() => {}}
        footerButtons={[
          {buttonType: 'primary', content: 'Submit', loading: true},
          {buttonType: 'default', content: 'Cancel', loading: false},
        ]}
      >
        Dialog content
      </Dialog>,
    )

    const submitButton = getByRole('button', {name: 'Submit'})
    const cancelButton = getByRole('button', {name: 'Cancel'})

    expect(submitButton).toHaveAttribute('data-loading', 'true')
    expect(cancelButton).not.toHaveAttribute('data-loading', 'true')
  })

  it('shows loading spinner in button when loading', () => {
    const {getByRole, baseElement} = render(
      <Dialog onClose={() => {}} footerButtons={[{buttonType: 'primary', content: 'Processing...', loading: true}]}>
        Dialog content
      </Dialog>,
    )

    const button = getByRole('button', {name: 'Processing...'})
    const spinner = baseElement.querySelector('[data-component="loadingSpinner"]') as HTMLElement

    expect(spinner).toBeInTheDocument()
    expect(button.contains(spinner)).toBe(true)
  })

  it('disables button clicks when loading', async () => {
    const mockOnClick = vi.fn()
    const {getByRole} = render(
      <Dialog
        onClose={() => {}}
        footerButtons={[{buttonType: 'primary', content: 'Submit', loading: true, onClick: mockOnClick}]}
      >
        Dialog content
      </Dialog>,
    )

    const button = getByRole('button', {name: 'Submit'})

    fireEvent.click(button)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('maintains focus management when button is loading', async () => {
    const {getByRole} = render(
      <Dialog
        onClose={() => {}}
        footerButtons={[
          {buttonType: 'default', content: 'Cancel', autoFocus: true},
          {buttonType: 'primary', content: 'Submit', loading: true},
        ]}
      >
        Dialog content
      </Dialog>,
    )

    const cancelButton = getByRole('button', {name: 'Cancel'})

    await waitFor(() => expect(cancelButton).toHaveFocus())
  })

  it('handles multiple loading buttons correctly', () => {
    const {getByRole} = render(
      <Dialog
        onClose={() => {}}
        footerButtons={[
          {buttonType: 'default', content: 'Save Draft', loading: true},
          {buttonType: 'primary', content: 'Publish', loading: true},
          {buttonType: 'danger', content: 'Delete', loading: false},
        ]}
      >
        Dialog content
      </Dialog>,
    )

    const saveDraftButton = getByRole('button', {name: 'Save Draft'})
    const publishButton = getByRole('button', {name: 'Publish'})
    const deleteButton = getByRole('button', {name: 'Delete'})

    expect(saveDraftButton).toHaveAttribute('data-loading', 'true')
    expect(publishButton).toHaveAttribute('data-loading', 'true')
    expect(deleteButton).not.toHaveAttribute('data-loading', 'true')
  })

  describe('scroll disable behavior', () => {
    it('sets data-dialog-scroll-disabled on body when dialog mounts', () => {
      const {unmount} = render(<Dialog onClose={() => {}}>Dialog content</Dialog>)

      expect(document.body.hasAttribute('data-dialog-scroll-disabled')).toBe(true)

      unmount()

      expect(document.body.hasAttribute('data-dialog-scroll-disabled')).toBe(false)
    })

    it('handles multiple dialogs with ref counting', () => {
      const {unmount: unmount1} = render(<Dialog onClose={() => {}}>Dialog 1</Dialog>)

      expect(document.body.hasAttribute('data-dialog-scroll-disabled')).toBe(true)

      const {unmount: unmount2} = render(<Dialog onClose={() => {}}>Dialog 2</Dialog>)

      expect(document.body.hasAttribute('data-dialog-scroll-disabled')).toBe(true)

      // Unmount first dialog - attribute should still be present
      unmount1()
      expect(document.body.hasAttribute('data-dialog-scroll-disabled')).toBe(true)

      // Unmount second dialog - attribute should be removed
      unmount2()
      expect(document.body.hasAttribute('data-dialog-scroll-disabled')).toBe(false)
    })
  })

  describe('width prop', () => {
    it('sets data-width for named sizes', () => {
      const {getByRole} = render(
        <Dialog onClose={() => {}} width="small">
          Content
        </Dialog>,
      )
      const dialog = getByRole('dialog')
      expect(dialog).toHaveAttribute('data-width', 'small')
      expect(dialog.style.getPropertyValue('--dialog-width')).toBe('')
    })

    it('sets --dialog-width custom property for custom width values', () => {
      const {getByRole} = render(
        <Dialog onClose={() => {}} width="400px">
          Content
        </Dialog>,
      )
      const dialog = getByRole('dialog')
      expect(dialog).not.toHaveAttribute('data-width')
      expect(dialog.style.getPropertyValue('--dialog-width')).toBe('400px')
    })

    it('sets --dialog-width custom property for numeric width values', () => {
      const {getByRole} = render(
        <Dialog onClose={() => {}} width={400}>
          Content
        </Dialog>,
      )
      const dialog = getByRole('dialog')
      expect(dialog).not.toHaveAttribute('data-width')
      expect(dialog.style.getPropertyValue('--dialog-width')).toBe('400px')
    })
  })
})

describe('Dialog auto-focus button forwarded ref (primer_react_merged_forwarded_refs)', () => {
  for (const enabled of [true, false]) {
    it(`focuses the auto-focus footer button via the gated ref with the flag ${enabled ? 'enabled' : 'disabled'}`, async () => {
      const {getByRole} = render(
        <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
          <Dialog
            onClose={() => {}}
            footerButtons={[{buttonType: 'primary', content: 'Footer button', autoFocus: true}]}
          >
            Body
          </Dialog>
        </FeatureFlags>,
      )
      await waitFor(() => expect(getByRole('button', {name: 'Footer button'})).toHaveFocus())
    })
  }
})
