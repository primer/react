import React from 'react'
import {createPortal} from 'react-dom'
import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {
  SelectPanelBackButton,
  SelectPanelCancelButton,
  SelectPanelClearSearchButton,
  SelectPanelClearSelectionButton,
  SelectPanelCloseButton,
  SelectPanelForm,
  SelectPanelSubmitButton,
} from './SelectPanelActions'
import {SelectPanelItem, SelectPanelList, SelectPanelRoot, SelectPanelSearchInput} from './SelectPanelParts'

const actions = [
  {name: 'Close', Component: SelectPanelCloseButton},
  {name: 'Cancel', Component: SelectPanelCancelButton},
  {name: 'Save', Component: SelectPanelSubmitButton},
  {name: 'Clear selection', Component: SelectPanelClearSelectionButton},
  {name: 'Clear search', Component: SelectPanelClearSearchButton},
  {name: 'Back', Component: SelectPanelBackButton},
]

describe('SelectPanel actions', () => {
  it('supports an externally labelled close action', () => {
    render(
      <SelectPanelRoot>
        <span id="close-label">Dismiss reviewers</span>
        <SelectPanelCloseButton aria-labelledby="close-label" aria-label="Close picker" />
      </SelectPanelRoot>,
    )
    const button = screen.getByRole('button', {name: 'Dismiss reviewers'})
    expect(button).toHaveAttribute('aria-labelledby', 'close-label')
    expect(button).not.toHaveAttribute('aria-label')
  })

  it('renders the opt-in close action as an icon button without a text label', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <SelectPanelRoot defaultOpen onDismiss={onDismiss}>
        <SelectPanelCloseButton aria-label="Close picker" />
      </SelectPanelRoot>,
    )
    const button = screen.getByRole('button', {name: 'Close picker'})
    expect(button).toHaveAttribute('data-component', 'IconButton')
    expect(button.querySelector('.octicon-x')).not.toBeNull()
    expect(button).not.toHaveTextContent('Close picker')
    await user.click(button)
    expect(onDismiss).toHaveBeenCalledWith('close')
  })

  it.each(actions)('$name respects a canceled consumer click', async ({Component, name}) => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault())
    render(
      <SelectPanelRoot
        defaultOpen
        defaultSelected={['apple']}
        defaultFilterValue="apple"
        onSubmit={onAction}
        onCancel={onAction}
        onDismiss={onAction}
        onSelectedChange={onAction}
        onFilterChange={onAction}
        onOpenChange={onAction}
      >
        <Component onClick={onClick} />
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name}))

    expect(onClick).toHaveBeenCalledOnce()
    expect(onAction).not.toHaveBeenCalled()
  })

  it.each(actions)('$name respects disabled and forwards its ref and button props', async ({Component, name}) => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLButtonElement>()
    const onAction = vi.fn()
    render(
      <SelectPanelRoot
        defaultOpen
        defaultSelected={['apple']}
        defaultFilterValue="apple"
        onSubmit={onAction}
        onCancel={onAction}
        onDismiss={onAction}
        onSelectedChange={onAction}
        onFilterChange={onAction}
        onOpenChange={onAction}
      >
        <Component ref={ref} disabled onClick={onAction} aria-label={`Custom ${name}`} data-testid="action" />
      </SelectPanelRoot>,
    )
    const button = screen.getByRole('button', {name: `Custom ${name}`})

    expect(ref.current).toBe(button)
    expect(button).toHaveAttribute('data-testid', 'action')
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onAction).not.toHaveBeenCalled()
  })

  it('does not implicitly submit or nest forms in an application form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
    const {container} = render(
      <form aria-label="Application" onSubmit={onSubmit}>
        <SelectPanelRoot>
          {actions.map(({Component, name}) => (
            <Component key={name} />
          ))}
        </SelectPanelRoot>
      </form>,
    )

    expect(container.querySelectorAll('form')).toHaveLength(1)
    for (const {name} of actions) {
      const button = screen.getByRole('button', {name})
      expect(button).toHaveAttribute('type', 'button')
      await user.click(button)
    }
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it.each(['submit', 'reset'] as const)('non-submit actions suppress an explicit native %s type', async type => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
    const onReset = vi.fn()
    const nonSubmitActions = actions.filter(({Component}) => Component !== SelectPanelSubmitButton)
    render(
      <form onSubmit={onSubmit} onReset={onReset}>
        <SelectPanelRoot defaultSelected={['apple']} defaultFilterValue="apple">
          {nonSubmitActions.map(({Component, name}) => (
            <Component key={name} type={type} />
          ))}
        </SelectPanelRoot>
      </form>,
    )

    for (const {name} of nonSubmitActions) {
      await user.click(screen.getByRole('button', {name}))
    }

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onReset).not.toHaveBeenCalled()
  })

  it.each([
    {Component: SelectPanelCloseButton, name: 'Close', reason: 'close'},
    {Component: SelectPanelBackButton, name: 'Back', reason: 'back'},
  ])('$name dismisses without canceling, submitting, or changing the draft', async ({Component, name, reason}) => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    const onCancel = vi.fn()
    const onSubmit = vi.fn()
    const onSelectedChange = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <SelectPanelRoot
        defaultOpen
        defaultSelected={['apple']}
        onDismiss={onDismiss}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onSelectedChange={onSelectedChange}
        onOpenChange={onOpenChange}
      >
        <Component />
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name}))

    expect(onDismiss).toHaveBeenCalledWith(reason)
    expect(onOpenChange).toHaveBeenCalledWith(false, reason)
    expect(onCancel).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('cancels without resetting the application-owned draft', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onOtherAction = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <SelectPanelRoot
        defaultOpen
        defaultSelected={['apple']}
        onCancel={onCancel}
        onSubmit={onOtherAction}
        onDismiss={onOtherAction}
        onSelectedChange={onOtherAction}
        onOpenChange={onOpenChange}
      >
        <SelectPanelList aria-label="Fruit">
          <SelectPanelItem value="apple">Apple</SelectPanelItem>
        </SelectPanelList>
        <SelectPanelCancelButton />
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name: 'Cancel'}))

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false, 'cancel')
    expect(onOtherAction).not.toHaveBeenCalled()
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'true')
  })

  it('submits the current selection independently of selecting an item', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onOtherAction = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <SelectPanelRoot
        defaultOpen
        selectionMode="multiple"
        defaultSelected={['apple']}
        onSubmit={onSubmit}
        onCancel={onOtherAction}
        onDismiss={onOtherAction}
        onOpenChange={onOpenChange}
      >
        <SelectPanelList aria-label="Fruit">
          <SelectPanelItem value="apple">Apple</SelectPanelItem>
          <SelectPanelItem value={2}>Banana</SelectPanelItem>
        </SelectPanelList>
        <SelectPanelSubmitButton>Apply fruit</SelectPanelSubmitButton>
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('option', {name: 'Banana'}))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', {name: 'Apply fruit'}))

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith(['apple', 2])
    expect(onOpenChange).toHaveBeenCalledWith(false, 'submit')
    expect(onOtherAction).not.toHaveBeenCalled()
  })

  it('clears only selection without submitting, dismissing, or clearing search', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const onOtherAction = vi.fn()
    render(
      <SelectPanelRoot
        defaultOpen
        defaultSelected={['apple']}
        defaultFilterValue="apple"
        onSelectedChange={onSelectedChange}
        onSubmit={onOtherAction}
        onCancel={onOtherAction}
        onDismiss={onOtherAction}
        onOpenChange={onOtherAction}
        onFilterChange={onOtherAction}
      >
        <SelectPanelSearchInput aria-label="Filter fruit" />
        <SelectPanelList aria-label="Fruit">
          <SelectPanelItem value="apple">Apple</SelectPanelItem>
        </SelectPanelList>
        <SelectPanelClearSelectionButton />
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name: 'Clear selection'}))

    expect(onSelectedChange).toHaveBeenCalledExactlyOnceWith([])
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('combobox')).toHaveValue('apple')
    expect(onOtherAction).not.toHaveBeenCalled()
  })

  it('clears search with a null event and returns focus to the input without changing selection', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    const onOtherAction = vi.fn()
    render(
      <SelectPanelRoot
        defaultOpen
        defaultSelected={['apple']}
        defaultFilterValue="apple"
        onFilterChange={onFilterChange}
        onSelectedChange={onOtherAction}
        onSubmit={onOtherAction}
        onCancel={onOtherAction}
        onDismiss={onOtherAction}
        onOpenChange={onOtherAction}
      >
        <SelectPanelSearchInput aria-label="Filter fruit" />
        <SelectPanelClearSearchButton />
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name: 'Clear search'}))

    expect(onFilterChange).toHaveBeenCalledExactlyOnceWith('', null)
    expect(screen.getByRole('combobox')).toHaveValue('')
    expect(screen.getByRole('combobox')).toHaveFocus()
    expect(onOtherAction).not.toHaveBeenCalled()
  })

  it('gives the back action a leading chevron and allows a custom label', () => {
    render(
      <SelectPanelRoot>
        <SelectPanelBackButton>Back to labels</SelectPanelBackButton>
      </SelectPanelRoot>,
    )
    expect(screen.getByRole('button', {name: 'Back to labels'}).querySelector('.octicon-chevron-left')).not.toBeNull()
  })
})

describe('SelectPanel.Form', () => {
  it('runs the consumer handler first, prevents navigation, and submits explicitly', () => {
    const calls: string[] = []
    const ref = React.createRef<HTMLFormElement>()
    const onSubmit = vi.fn(() => calls.push('panel'))
    const onFormSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      expect(event.defaultPrevented).toBe(false)
      calls.push('form')
    })
    const onOpenChange = vi.fn()
    render(
      <SelectPanelRoot defaultOpen defaultSelected={['apple']} onSubmit={onSubmit} onOpenChange={onOpenChange}>
        <SelectPanelForm aria-label="Selection" id="selection" ref={ref} onSubmit={onFormSubmit}>
          <button type="submit">Submit form</button>
        </SelectPanelForm>
      </SelectPanelRoot>,
    )
    const form = screen.getByRole('form', {name: 'Selection'})

    expect(ref.current).toBe(form)
    expect(form).toHaveAttribute('id', 'selection')
    expect(fireEvent.submit(form)).toBe(false)
    expect(calls).toEqual(['form', 'panel'])
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith(['apple'])
    expect(onOpenChange).toHaveBeenCalledWith(false, 'submit')
  })

  it('honors a prevented native form submission', () => {
    const onSubmit = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <SelectPanelRoot defaultOpen onSubmit={onSubmit} onOpenChange={onOpenChange}>
        <SelectPanelForm aria-label="Selection" onSubmit={event => event.preventDefault()} />
      </SelectPanelRoot>,
    )

    expect(fireEvent.submit(screen.getByRole('form', {name: 'Selection'}))).toBe(false)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it.each([undefined, 'submit'] as const)('submits natively exactly once with SubmitButton type %s', async type => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onFormSubmit = vi.fn()
    render(
      <SelectPanelRoot defaultSelected={['apple']} onSubmit={onSubmit}>
        <SelectPanelForm onSubmit={onFormSubmit}>
          <SelectPanelSubmitButton type={type} />
        </SelectPanelForm>
      </SelectPanelRoot>,
    )

    const button = screen.getByRole('button', {name: 'Save'})
    expect(button).toHaveAttribute('type', 'submit')
    await user.click(button)
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith(['apple'])
    expect(onFormSubmit).toHaveBeenCalledOnce()
  })

  it('honors Form onSubmit cancellation when clicking SubmitButton', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onOpenChange = vi.fn()
    const onFormSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
    render(
      <SelectPanelRoot defaultOpen onSubmit={onSubmit} onOpenChange={onOpenChange}>
        <SelectPanelForm onSubmit={onFormSubmit}>
          <SelectPanelSubmitButton />
        </SelectPanelForm>
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name: 'Save'}))

    expect(onFormSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('honors a canceled SubmitButton click inside its Form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onFormSubmit = vi.fn()
    render(
      <SelectPanelRoot onSubmit={onSubmit}>
        <SelectPanelForm onSubmit={onFormSubmit}>
          <SelectPanelSubmitButton onClick={event => event.preventDefault()} />
        </SelectPanelForm>
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name: 'Save'}))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onFormSubmit).not.toHaveBeenCalled()
  })

  it('preserves native validation for SubmitButton inside its Form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onFormSubmit = vi.fn()
    render(
      <SelectPanelRoot onSubmit={onSubmit}>
        <SelectPanelForm onSubmit={onFormSubmit}>
          <input required aria-label="Required explanation" />
          <SelectPanelSubmitButton />
        </SelectPanelForm>
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name: 'Save'}))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onFormSubmit).not.toHaveBeenCalled()

    await user.type(screen.getByRole('textbox', {name: 'Required explanation'}), 'A reason')
    await user.click(screen.getByRole('button', {name: 'Save'}))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onFormSubmit).toHaveBeenCalledOnce()
  })

  it('does not submit its Form while SubmitButton is loading', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onFormSubmit = vi.fn()
    render(
      <SelectPanelRoot onSubmit={onSubmit}>
        <SelectPanelForm onSubmit={onFormSubmit}>
          <SelectPanelSubmitButton loading data-testid="saving" />
        </SelectPanelForm>
      </SelectPanelRoot>,
    )
    const button = screen.getByTestId('saving')
    expect(button).toHaveAttribute('type', 'button')

    await user.click(button)

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onFormSubmit).not.toHaveBeenCalled()
  })

  it('does not inherit a parent Root form when a nested Root has no form adapter', async () => {
    const user = userEvent.setup()
    const onParentSubmit = vi.fn()
    const onChildSubmit = vi.fn()
    const onParentFormSubmit = vi.fn()
    render(
      <SelectPanelRoot onSubmit={onParentSubmit}>
        <SelectPanelForm onSubmit={onParentFormSubmit}>
          <SelectPanelRoot defaultSelected={['child']} onSubmit={onChildSubmit}>
            <SelectPanelSubmitButton />
          </SelectPanelRoot>
        </SelectPanelForm>
      </SelectPanelRoot>,
    )
    const button = screen.getByRole('button', {name: 'Save'})
    expect(button).toHaveAttribute('type', 'button')

    await user.click(button)

    expect(onChildSubmit).toHaveBeenCalledExactlyOnceWith(['child'])
    expect(onParentSubmit).not.toHaveBeenCalled()
    expect(onParentFormSubmit).not.toHaveBeenCalled()
  })

  it.each(['portal', 'form attribute'] as const)(
    'does not submit an unrelated form associated by %s',
    async association => {
      const user = userEvent.setup()
      const onExternalSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
      const onFormSubmit = vi.fn()
      const onSubmit = vi.fn()
      render(<form id="external-form" aria-label="External" onSubmit={onExternalSubmit} />)
      const externalForm = screen.getByRole('form', {name: 'External'})
      const button = <SelectPanelSubmitButton form={association === 'form attribute' ? 'external-form' : undefined} />
      render(
        <SelectPanelRoot onSubmit={onSubmit}>
          <SelectPanelForm onSubmit={onFormSubmit}>
            {association === 'portal' ? createPortal(button, externalForm) : button}
          </SelectPanelForm>
        </SelectPanelRoot>,
      )
      const submitButton = screen.getByRole('button', {name: 'Save'})
      expect((submitButton as HTMLButtonElement).form).toBe(externalForm)
      expect(submitButton).toHaveAttribute('type', 'button')

      await user.click(submitButton)

      expect(onSubmit).toHaveBeenCalledOnce()
      expect(onFormSubmit).not.toHaveBeenCalled()
      expect(onExternalSubmit).not.toHaveBeenCalled()
    },
  )

  it('keeps an unassociated portaled SubmitButton a direct action', async () => {
    const user = userEvent.setup()
    const {container: portalContainer} = render(<div />)
    const onSubmit = vi.fn()
    const onFormSubmit = vi.fn()
    render(
      <SelectPanelRoot onSubmit={onSubmit}>
        <SelectPanelForm onSubmit={onFormSubmit}>
          {createPortal(<SelectPanelSubmitButton />, portalContainer)}
        </SelectPanelForm>
      </SelectPanelRoot>,
    )
    const button = screen.getByRole('button', {name: 'Save'})
    expect(button).toHaveAttribute('type', 'button')
    expect((button as HTMLButtonElement).form).toBeNull()

    await user.click(button)

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onFormSubmit).not.toHaveBeenCalled()
  })

  it.each([false, true])('isolates a portaled child Root form submission (canceled: %s)', async canceled => {
    const user = userEvent.setup()
    const {container: portalContainer} = render(<div />)
    const onParentSubmit = vi.fn()
    const onParentFormSubmit = vi.fn()
    const onChildSubmit = vi.fn()
    const onChildFormSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      if (canceled) event.preventDefault()
    })
    render(
      <SelectPanelRoot onSubmit={onParentSubmit}>
        <SelectPanelForm aria-label="Parent" onSubmit={onParentFormSubmit}>
          {createPortal(
            <SelectPanelRoot defaultSelected={['child']} onSubmit={onChildSubmit}>
              <SelectPanelForm aria-label="Child" onSubmit={onChildFormSubmit}>
                <SelectPanelSubmitButton />
              </SelectPanelForm>
            </SelectPanelRoot>,
            portalContainer,
          )}
        </SelectPanelForm>
      </SelectPanelRoot>,
    )
    expect(screen.getByRole('form', {name: 'Parent'})).not.toContainElement(screen.getByRole('form', {name: 'Child'}))

    await user.click(screen.getByRole('button', {name: 'Save'}))

    expect(onChildFormSubmit).toHaveBeenCalledOnce()
    if (canceled) {
      expect(onChildSubmit).not.toHaveBeenCalled()
    } else {
      expect(onChildSubmit).toHaveBeenCalledExactlyOnceWith(['child'])
    }
    expect(onParentFormSubmit).not.toHaveBeenCalled()
    expect(onParentSubmit).not.toHaveBeenCalled()
  })

  it('does not bubble a portaled panel submission into an application form', async () => {
    const user = userEvent.setup()
    const {container: portalContainer} = render(<div />)
    const onApplicationSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
    const onSubmit = vi.fn()
    render(
      <form onSubmit={onApplicationSubmit}>
        <SelectPanelRoot onSubmit={onSubmit}>
          {createPortal(
            <SelectPanelForm>
              <SelectPanelSubmitButton />
            </SelectPanelForm>,
            portalContainer,
          )}
        </SelectPanelRoot>
      </form>,
    )

    await user.click(screen.getByRole('button', {name: 'Save'}))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onApplicationSubmit).not.toHaveBeenCalled()
  })

  it('ignores a submit event from a portaled native child form', async () => {
    const user = userEvent.setup()
    const {container: portalContainer} = render(<div />)
    const onSubmit = vi.fn()
    const onFormSubmit = vi.fn()
    const onChildSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
    render(
      <SelectPanelRoot onSubmit={onSubmit}>
        <SelectPanelForm onSubmit={onFormSubmit}>
          {createPortal(
            <form onSubmit={onChildSubmit}>
              <button type="submit">Submit child</button>
            </form>,
            portalContainer,
          )}
        </SelectPanelForm>
      </SelectPanelRoot>,
    )

    await user.click(screen.getByRole('button', {name: 'Submit child'}))

    expect(onChildSubmit).toHaveBeenCalledOnce()
    expect(onFormSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not submit on Enter in search or when selecting an option', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onFormSubmit = vi.fn()
    render(
      <SelectPanelRoot onSubmit={onSubmit}>
        <SelectPanelForm onSubmit={onFormSubmit}>
          <SelectPanelSearchInput aria-label="Filter fruit" />
          <SelectPanelList aria-label="Fruit">
            <SelectPanelItem value="apple">Apple</SelectPanelItem>
          </SelectPanelList>
          <button type="submit">Submit form</button>
        </SelectPanelForm>
      </SelectPanelRoot>,
    )
    const input = screen.getByRole('combobox', {name: 'Filter fruit'})
    const option = screen.getByRole('option', {name: 'Apple'})
    await user.click(input)
    expect(input).toHaveAttribute('aria-activedescendant', option.id)
    await user.keyboard('{Enter}')
    expect(option).toHaveAttribute('aria-selected', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onFormSubmit).not.toHaveBeenCalled()

    await user.keyboard('{ArrowDown}')
    expect(input).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(option).toHaveAttribute('aria-selected', 'false')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onFormSubmit).not.toHaveBeenCalled()
  })
})
