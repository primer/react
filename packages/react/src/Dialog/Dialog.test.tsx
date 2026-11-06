import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {Dialog} from './Dialog'
import {FeatureFlags} from '../FeatureFlags'
import {Button} from '../Button'
import {implementsClassName} from '../utils/testing'
import classes from './Dialog.module.css'

describe('Dialog', () => {
  implementsClassName(Dialog, classes.Dialog)
  it('renders with role "dialog" by default', async () => {
    render(<Dialog onClose={() => {}}>Pay attention to me</Dialog>)

    await expect.element(page.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders with role "alertdialog" when passed', async () => {
    render(
      <Dialog role="alertdialog" onClose={() => {}}>
        Definitely pay attention to me
      </Dialog>,
    )

    await expect.element(page.getByRole('alertdialog')).toBeInTheDocument()
  })
  it('automatically focuses the footer button when `autoFocus` is true', async () => {
    render(
      <Dialog onClose={() => {}} footerButtons={[{buttonType: 'primary', content: 'Footer button', autoFocus: true}]}>
        Pay attention to me
      </Dialog>,
    )

    await expect.element(page.getByRole('button', {name: 'Footer button', exact: true})).toHaveFocus()
  })

  it('sets data-has-footer when footerButtons are provided', async () => {
    render(
      <Dialog onClose={() => {}} footerButtons={[{buttonType: 'primary', content: 'OK'}]}>
        Content
      </Dialog>,
    )
    await expect.element(page.getByRole('dialog')).toHaveAttribute('data-has-footer', '')
  })

  it('does not set data-has-footer when no footer is rendered', async () => {
    render(
      <Dialog onClose={() => {}} renderFooter={() => null}>
        Content
      </Dialog>,
    )
    await expect.element(page.getByRole('dialog')).not.toHaveAttribute('data-has-footer')
  })

  it('renders data-component attribute', async () => {
    render(<Dialog onClose={() => {}}>Content</Dialog>)
    await expect.element(page.getByRole('dialog')).toHaveAttribute('data-component', 'Dialog')
  })

  it('allows overriding the root data-component attribute', async () => {
    render(
      <Dialog data-component="ConfirmationDialog" onClose={() => {}}>
        Content
      </Dialog>,
    )
    await expect.element(page.getByRole('dialog')).toHaveAttribute('data-component', 'ConfirmationDialog')
  })

  it('renders data-component hooks for Dialog subcomponents', () => {
    render(
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

    const dialog = page.getByRole('dialog').element()

    expect(dialog.querySelector('[data-component="Dialog.Header"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.Title"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.Subtitle"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.CloseButton"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.Body"]')).toBeInTheDocument()
    expect(dialog.querySelector('[data-component="Dialog.Footer"]')).toBeInTheDocument()
  })

  it('adds a Dialog-scoped data-component hook for footer buttons (and not for body buttons)', () => {
    render(
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

    const dialog = page.getByRole('dialog').element()

    // ensure footer buttons have the data-component hook
    const footerButtonHooks = dialog.querySelectorAll('[data-component="Dialog.FooterButton"]')
    expect(footerButtonHooks).toHaveLength(2)

    // ensure we're targeting the correct buttons
    expect(footerButtonHooks[0]).toHaveTextContent('Submit')
    expect(footerButtonHooks[1]).toHaveTextContent('Cancel')

    // ensure we're not targeting other buttons
    const bodyButton = page.getByRole('button', {name: 'Body button', exact: true}).element()
    expect(bodyButton).toBeTruthy()
    expect(bodyButton.closest('[data-component="Dialog.FooterButton"]')).toBeNull()
  })

  it('calls `onClose` when clicking the close button', async () => {
    const onClose = vi.fn()
    render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(page.getByRole('button', {name: 'Close', exact: true}))

    expect(onClose).toHaveBeenCalledWith('close-button')
    expect(onClose).toHaveBeenCalledTimes(1) // Ensure it's not called with a backdrop gesture as well
  })

  it('calls `onClose` when clicking the backdrop', async () => {
    const onClose = vi.fn()
    render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    const dialog = page.getByRole('dialog').element()
    const backdrop = dialog.parentElement!
    await userEvent.click(backdrop, {position: {x: 1, y: 1}})

    expect(onClose).toHaveBeenCalledWith('escape')
  })

  it('does not call `onClose` when click was not originated from backdrop', async () => {
    const onClose = vi.fn()

    render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    const dialog = page.getByRole('dialog').element()
    const backdrop = dialog.parentElement!

    fireEvent.mouseDown(dialog)
    fireEvent.mouseUp(backdrop)
    // trigger the click on the backdrop, mouseUp doesn't do it for us
    fireEvent.click(backdrop)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls `onClose` when keying "Escape"', async () => {
    const onClose = vi.fn()

    render(<Dialog onClose={onClose}>Pay attention to me</Dialog>)

    expect(onClose).not.toHaveBeenCalled()

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledWith('escape')
  })

  it('calls `onClose` with a single "Escape" keypress when multiple dialogs can be opened', async () => {
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
    render(
      <>
        <ButtonWithDialog label="Dialog 1" onClose={onCloseFirst} />
        <ButtonWithDialog label="Dialog 2" onClose={onCloseSecond} />
      </>,
    )

    await userEvent.click(page.getByRole('button', {name: 'Dialog 1', exact: true}))
    await userEvent.keyboard('{Escape}')

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

  it('renders with data-position-regular="left" when position="left"', async () => {
    render(<Dialog onClose={() => {}} position="left" />)
    await expect.element(page.getByRole('dialog')).toHaveAttribute('data-position-regular', 'left')
  })

  it('renders with data-position-regular="right" when position="right"', async () => {
    render(<Dialog onClose={() => {}} position="right" />)
    await expect.element(page.getByRole('dialog')).toHaveAttribute('data-position-regular', 'right')
  })

  it('renders with data-position-narrow="fullscreen" when narrow position is fullscreen', async () => {
    render(<Dialog onClose={() => {}} position={{narrow: 'fullscreen'}} />)
    await expect.element(page.getByRole('dialog')).toHaveAttribute('data-position-narrow', 'fullscreen')
  })

  it('renders with data-position-narrow="bottom" when narrow position is bottom and data-position-regular="center" when regular is center', async () => {
    render(<Dialog onClose={() => {}} position={{narrow: 'bottom', regular: 'center'}} />)
    await expect.element(page.getByRole('dialog')).toHaveAttribute('data-position-narrow', 'bottom')
    await expect.element(page.getByRole('dialog')).toHaveAttribute('data-position-regular', 'center')
  })

  describe('align prop', () => {
    it('sets data-align="top" on both dialog and backdrop', async () => {
      render(<Dialog onClose={() => {}} align="top" />)
      const dialog = page.getByRole('dialog')
      await expect.element(dialog).toHaveAttribute('data-align', 'top')
      expect(dialog.element().parentElement).toHaveAttribute('data-align', 'top')
    })

    it('sets data-align="bottom" when align is bottom', async () => {
      render(<Dialog onClose={() => {}} align="bottom" />)
      await expect.element(page.getByRole('dialog')).toHaveAttribute('data-align', 'bottom')
    })

    it('sets data-align="center" when align is center', async () => {
      render(<Dialog onClose={() => {}} align="center" />)
      await expect.element(page.getByRole('dialog')).toHaveAttribute('data-align', 'center')
    })

    it('omits data-align when align is not provided', async () => {
      render(<Dialog onClose={() => {}} />)
      await expect.element(page.getByRole('dialog')).not.toHaveAttribute('data-align')
    })

    it('emits data-align attribute even when position is non-center', async () => {
      render(<Dialog onClose={() => {}} position="left" align="top" />)
      const dialog = page.getByRole('dialog')
      await expect.element(dialog).toHaveAttribute('data-position-regular', 'left')
      await expect.element(dialog).toHaveAttribute('data-align', 'top')
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

    render(<Fixture />)
    const triggerButton = page.getByRole('button', {name: 'Open dialog', exact: true})

    await userEvent.tab() // tab into the story, this should focus on the first button
    await expect.element(triggerButton).toHaveFocus()

    await userEvent.click(triggerButton)
    await expect.element(page.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(page.getByRole('button', {name: 'Close', exact: true}))

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    await expect.element(triggerButton).toHaveFocus()
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

    render(<Fixture />)
    const triggerButton = page.getByRole('button', {name: 'Show dialog (button 1)', exact: true})

    await userEvent.tab() // tab into the story, this should focus on the first button
    await expect.element(triggerButton).toHaveFocus()

    await userEvent.click(triggerButton)
    await userEvent.click(page.getByRole('button', {name: 'Close', exact: true}))

    await expect.element(page.getByRole('button', {name: 'return focus to (button 2)', exact: true})).toHaveFocus()
  })

  it('falls back to the previously focused element when the return focus target disappears before closing', async () => {
    const Fixture = () => {
      const [isOpen, setIsOpen] = React.useState(false)
      const [showReturnTarget, setShowReturnTarget] = React.useState(true)
      const returnFocusRef = React.useRef<HTMLButtonElement>(null)

      return (
        <>
          <Button
            onClick={() => {
              setIsOpen(true)
            }}
          >
            Open dialog
          </Button>
          {showReturnTarget && <Button ref={returnFocusRef}>Return target</Button>}
          {isOpen && (
            <Dialog
              onClose={() => {
                setIsOpen(false)
              }}
              returnFocusRef={returnFocusRef}
            >
              <Button
                onClick={() => {
                  setShowReturnTarget(false)
                }}
              >
                Remove return target
              </Button>
            </Dialog>
          )}
        </>
      )
    }

    const user = userEvent.setup()
    const {getByRole, queryByRole} = render(<Fixture />)
    const triggerButton = getByRole('button', {name: 'Open dialog'})

    await user.click(triggerButton)
    await user.click(getByRole('button', {name: 'Remove return target'}))
    expect(queryByRole('button', {name: 'Return target'})).not.toBeInTheDocument()
    await user.click(getByRole('button', {name: 'Close'}))

    expect(queryByRole('dialog')).not.toBeInTheDocument()
    expect(triggerButton).toHaveFocus()
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

    const component = render(<Fixture />)
    const triggerButton = page.getByRole('button', {name: 'Show dialog', exact: true})
    // The already-open dialog blocks pointer access to the trigger.
    fireEvent.click(triggerButton.element())
    await expect.element(page.getByRole('dialog')).toHaveClass('custom-class')
    component.unmount()
  })
})

it('automatically focuses the element that is specified as initialFocusRef', async () => {
  const initialFocusRef = React.createRef<HTMLAnchorElement>()
  render(
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

  await expect.element(page.getByRole('link')).toHaveFocus()
})

describe('Footer button loading states', () => {
  it('applies loading state to footer buttons', async () => {
    render(
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

    const submitButton = page.getByRole('button', {name: 'Submit', exact: true})
    const cancelButton = page.getByRole('button', {name: 'Cancel', exact: true})

    await expect.element(submitButton).toHaveAttribute('data-loading', 'true')
    await expect.element(cancelButton).not.toHaveAttribute('data-loading', 'true')
  })

  it('shows loading spinner in button when loading', () => {
    const {baseElement} = render(
      <Dialog onClose={() => {}} footerButtons={[{buttonType: 'primary', content: 'Processing...', loading: true}]}>
        Dialog content
      </Dialog>,
    )

    const button = page.getByRole('button', {name: 'Processing...', exact: true}).element()
    const spinner = baseElement.querySelector('[data-component="loadingSpinner"]') as HTMLElement

    expect(spinner).toBeInTheDocument()
    expect(button.contains(spinner)).toBe(true)
  })

  it('disables button clicks when loading', async () => {
    const mockOnClick = vi.fn()
    render(
      <Dialog
        onClose={() => {}}
        footerButtons={[{buttonType: 'primary', content: 'Submit', loading: true, onClick: mockOnClick}]}
      >
        Dialog content
      </Dialog>,
    )

    const button = page.getByRole('button', {name: 'Submit', exact: true})

    fireEvent.click(button.element())

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('maintains focus management when button is loading', async () => {
    render(
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

    const cancelButton = page.getByRole('button', {name: 'Cancel', exact: true})

    await expect.element(cancelButton).toHaveFocus()
  })

  it('handles multiple loading buttons correctly', async () => {
    render(
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

    const saveDraftButton = page.getByRole('button', {name: 'Save Draft', exact: true})
    const publishButton = page.getByRole('button', {name: 'Publish', exact: true})
    const deleteButton = page.getByRole('button', {name: 'Delete', exact: true})

    await expect.element(saveDraftButton).toHaveAttribute('data-loading', 'true')
    await expect.element(publishButton).toHaveAttribute('data-loading', 'true')
    await expect.element(deleteButton).not.toHaveAttribute('data-loading', 'true')
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
      render(
        <Dialog onClose={() => {}} width="small">
          Content
        </Dialog>,
      )
      const dialog = page.getByRole('dialog').element()
      expect(dialog).toHaveAttribute('data-width', 'small')
      expect(dialog.style.getPropertyValue('--dialog-width')).toBe('')
    })

    it('sets --dialog-width custom property for custom width values', () => {
      render(
        <Dialog onClose={() => {}} width="400px">
          Content
        </Dialog>,
      )
      const dialog = page.getByRole('dialog').element()
      expect(dialog).not.toHaveAttribute('data-width')
      expect(dialog.style.getPropertyValue('--dialog-width')).toBe('400px')
    })

    it('sets --dialog-width custom property for numeric width values', () => {
      render(
        <Dialog onClose={() => {}} width={400}>
          Content
        </Dialog>,
      )
      const dialog = page.getByRole('dialog').element()
      expect(dialog).not.toHaveAttribute('data-width')
      expect(dialog.style.getPropertyValue('--dialog-width')).toBe('400px')
    })
  })
})

describe('Dialog auto-focus button forwarded ref (primer_react_merged_forwarded_refs)', () => {
  for (const enabled of [true, false]) {
    it(`focuses only the first auto-focus footer button with the flag ${enabled ? 'enabled' : 'disabled'}`, async () => {
      const {getByRole} = render(
        <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
          <Dialog
            onClose={() => {}}
            footerButtons={[
              {
                content: 'Not auto-focused',
              },
              {
                content: 'First auto-focus',
                autoFocus: true,
              },
              {
                content: 'Second auto-focus',
                autoFocus: true,
              },
            ]}
          >
            Body
          </Dialog>
        </FeatureFlags>,
      )

      await waitFor(() => {
        expect(getByRole('button', {name: 'First auto-focus'})).toHaveFocus()
      })
    })

    it(`does not mutate caller footer button props with the flag ${enabled ? 'enabled' : 'disabled'}`, async () => {
      const suppliedRef = React.createRef<HTMLButtonElement>()
      const footerButton = Object.freeze({
        content: 'Footer button',
        autoFocus: true,
        ref: suppliedRef,
      })
      const {getByRole} = render(
        <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
          <Dialog onClose={() => {}} footerButtons={[footerButton]}>
            Body
          </Dialog>
        </FeatureFlags>,
      )

      await waitFor(() => {
        expect(getByRole('button', {name: 'Footer button'})).toHaveFocus()
      })
      expect(footerButton.ref).toBe(suppliedRef)
      // Dialog's internal auto-focus ref still takes precedence over a supplied footer ref.
      expect(suppliedRef.current).toBeNull()
    })

    it(`focuses the auto-focus footer button via the gated ref with the flag ${enabled ? 'enabled' : 'disabled'}`, async () => {
      render(
        <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
          <Dialog
            onClose={() => {}}
            footerButtons={[{buttonType: 'primary', content: 'Footer button', autoFocus: true}]}
          >
            Body
          </Dialog>
        </FeatureFlags>,
      )
      await expect.element(page.getByRole('button', {name: 'Footer button', exact: true})).toHaveFocus()
    })
  }
})
