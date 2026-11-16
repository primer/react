import {act, cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {UnderlinePanels} from './UnderlinePanels'

afterEach(cleanup)

describe('UnderlinePanels', () => {
  it('styles the outer wrapper independently while keeping list props and refs on the tablist', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLElement>()
    const example = (wrapperClassName?: string) => (
      <UnderlinePanels defaultValue="activity">
        <UnderlinePanels.List
          ref={ref}
          aria-label="Sections"
          className="consumer-list gap-4"
          data-testid="list"
          wrapperClassName={wrapperClassName}
        >
          <UnderlinePanels.Tab value="activity">Activity</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="security">Security</UnderlinePanels.Tab>
        </UnderlinePanels.List>
        <UnderlinePanels.Panel value="activity">Activity content</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="security">Security content</UnderlinePanels.Panel>
      </UnderlinePanels>
    )
    const {rerender} = render(example('consumer-wrapper px-0 pt-0 shadow-none'))
    const list = screen.getByRole('tablist', {name: 'Sections'})
    const wrapper = list.parentElement
    expect(ref.current).toBe(list)
    expect(list).toBe(screen.getByTestId('list'))
    expect(list).toHaveClass('consumer-list', 'gap-4')
    expect(list).not.toHaveAttribute('wrapperClassName')
    expect(list).not.toHaveClass('consumer-wrapper')
    expect(list).not.toHaveClass('shadow-none')
    expect(wrapper).toHaveClass('consumer-wrapper', 'px-0', 'pt-0', 'shadow-none')
    for (const className of ['primer:px-4', 'primer:pt-2', 'primer:shadow-[inset_0_-1px_var(--borderColor-muted)]']) {
      expect(wrapper).not.toHaveClass(className)
    }
    expect(wrapper).not.toHaveClass('consumer-list')
    screen.getByRole('tab', {name: 'Activity'}).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', {name: 'Security'})).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security content')

    rerender(example())
    expect(list.parentElement).toHaveClass(
      'primer:px-4',
      'primer:pt-2',
      'primer:shadow-[inset_0_-1px_var(--borderColor-muted)]',
    )
    expect(list.parentElement).not.toHaveClass('consumer-wrapper')
    expect(list.parentElement).not.toHaveClass('primer:shadow-none')
  })

  it('composes Tabs with accessible keyboard panel selection', async () => {
    const user = userEvent.setup()
    render(
      <UnderlinePanels defaultValue="a">
        <UnderlinePanels.List aria-label="Sections">
          <UnderlinePanels.Tab value="a">Activity</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="b">Security</UnderlinePanels.Tab>
        </UnderlinePanels.List>
        <UnderlinePanels.Panel value="a">Activity content</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="b">Security content</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )
    await user.click(screen.getByRole('tab', {name: 'Activity'}))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', {name: 'Security'})).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security content')
    expect(screen.getByRole('tablist')).toHaveAttribute('data-component', 'UnderlinePanels.List')
    expect(screen.getByRole('tab', {name: 'Security'})).toHaveAttribute('data-component', 'UnderlinePanels.Tab')
    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-component', 'UnderlinePanels.Panel')
  })

  describe('controlled value / onChange / activationMode', () => {
    const RefTabs = (props: {
      value?: string
      defaultValue?: string
      activationMode?: 'automatic' | 'manual'
      onChange?: (details: {value: string}) => void
    }) => (
      <UnderlinePanels {...props}>
        <UnderlinePanels.List aria-label="Ref type">
          <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
        </UnderlinePanels.List>
        <UnderlinePanels.Panel value="branch">Branch panel</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tag">Tag panel</UnderlinePanels.Panel>
      </UnderlinePanels>
    )

    it('`value` selects the matching tab and shows its panel', () => {
      render(<RefTabs value="tag" onChange={vi.fn()} />)

      expect(screen.getByRole('tab', {name: 'Tags'})).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', {name: 'Branches'})).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByText('Tag panel')).toBeVisible()
      expect(screen.queryByText('Branch panel')).not.toBeInTheDocument()
    })

    it('calls onChange with the domain value when a tab is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RefTabs value="branch" onChange={onChange} />)

      await user.click(screen.getByRole('tab', {name: 'Tags'}))

      expect(onChange).toHaveBeenCalledWith({value: 'tag'})
    })

    it('does not call onChange when the selected tab is re-clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RefTabs value="branch" onChange={onChange} />)

      await user.click(screen.getByRole('tab', {name: 'Branches'}))

      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not call onChange for an automatic fallback selection', () => {
      const onChange = vi.fn()
      render(<RefTabs defaultValue="missing" onChange={onChange} />)

      expect(screen.getByRole('tab', {name: 'Branches'})).toHaveAttribute('aria-selected', 'true')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('calls onValueChange with Base UI event details alongside onChange', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const onValueChange = vi.fn()
      render(
        <UnderlinePanels defaultValue="branch" onChange={onChange} onValueChange={onValueChange}>
          <UnderlinePanels.List aria-label="Ref type">
            <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
            <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
          </UnderlinePanels.List>
          <UnderlinePanels.Panel value="branch">Branch panel</UnderlinePanels.Panel>
          <UnderlinePanels.Panel value="tag">Tag panel</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )

      await user.click(screen.getByRole('tab', {name: 'Tags'}))

      expect(onValueChange).toHaveBeenCalledWith('tag', expect.objectContaining({reason: 'none'}))
      expect(onChange).toHaveBeenCalledWith({value: 'tag'})
    })

    it('does not call onChange when onValueChange cancels the change', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <UnderlinePanels
          defaultValue="branch"
          onChange={onChange}
          onValueChange={(_value, eventDetails) => eventDetails.cancel()}
        >
          <UnderlinePanels.List aria-label="Ref type">
            <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
            <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
          </UnderlinePanels.List>
          <UnderlinePanels.Panel value="branch">Branch panel</UnderlinePanels.Panel>
          <UnderlinePanels.Panel value="tag">Tag panel</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )

      await user.click(screen.getByRole('tab', {name: 'Tags'}))

      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByRole('tab', {name: 'Branches'})).toHaveAttribute('aria-selected', 'true')
    })

    it('calls onChange on arrow-key navigation (automatic activation)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RefTabs value="branch" onChange={onChange} />)

      act(() => screen.getByRole('tab', {name: 'Branches'}).focus())
      await user.keyboard('{ArrowRight}')

      expect(onChange).toHaveBeenCalledWith({value: 'tag'})
    })

    it('does not update selection while controlled unless `value` changes', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const {rerender} = render(<RefTabs value="branch" onChange={onChange} />)

      await user.click(screen.getByRole('tab', {name: 'Tags'}))

      expect(screen.getByRole('tab', {name: 'Branches'})).toHaveAttribute('aria-selected', 'true')

      rerender(<RefTabs value="tag" onChange={onChange} />)
      expect(screen.getByRole('tab', {name: 'Tags'})).toHaveAttribute('aria-selected', 'true')
    })

    it('`defaultValue` sets the initial selection and updates internally (uncontrolled)', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<RefTabs defaultValue="tag" onChange={onChange} />)

      expect(screen.getByRole('tab', {name: 'Tags'})).toHaveAttribute('aria-selected', 'true')

      await user.click(screen.getByRole('tab', {name: 'Branches'}))

      expect(screen.getByRole('tab', {name: 'Branches'})).toHaveAttribute('aria-selected', 'true')
      expect(onChange).toHaveBeenCalledWith({value: 'branch'})
      expect(screen.getByText('Branch panel')).toBeVisible()
    })

    describe('manual activation', () => {
      it('arrow keys move focus without selecting or firing onChange', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<RefTabs value="branch" activationMode="manual" onChange={onChange} />)

        const branch = screen.getByRole('tab', {name: 'Branches'})
        const tag = screen.getByRole('tab', {name: 'Tags'})

        act(() => branch.focus())
        await user.keyboard('{ArrowRight}')

        expect(tag).toHaveFocus()
        expect(branch).toHaveAttribute('aria-selected', 'true')
        expect(onChange).not.toHaveBeenCalled()
        expect(tag).toHaveAttribute('tabindex', '0')
        expect(branch).toHaveAttribute('tabindex', '-1')
      })

      it('commits selection with Enter', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<RefTabs value="branch" activationMode="manual" onChange={onChange} />)

        act(() => screen.getByRole('tab', {name: 'Branches'}).focus())
        await user.keyboard('{ArrowRight}')
        await user.keyboard('{Enter}')

        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith({value: 'tag'})
      })

      it('commits selection with Space when uncontrolled (defaultValue)', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<RefTabs defaultValue="branch" activationMode="manual" onChange={onChange} />)

        const branch = screen.getByRole('tab', {name: 'Branches'})
        const tag = screen.getByRole('tab', {name: 'Tags'})

        act(() => branch.focus())
        await user.keyboard('{ArrowRight}')

        expect(tag).toHaveFocus()
        expect(branch).toHaveAttribute('aria-selected', 'true')
        expect(onChange).not.toHaveBeenCalled()

        await user.keyboard(' ')

        expect(onChange).toHaveBeenCalledWith({value: 'tag'})
        expect(tag).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByText('Tag panel')).toBeVisible()
      })
    })
  })

  describe('AnchoredOverlay composition', () => {
    it.each([false, true])('preserves manual keyboard focus after reopening (StrictMode=%s)', async strictMode => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const example = (
        <AnchoredOverlay>
          <AnchoredOverlay.Trigger>Code</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content role="dialog" aria-label="Code options">
            <UnderlinePanels defaultValue="local" activationMode="manual" onChange={onChange}>
              <UnderlinePanels.List aria-label="Code source">
                <UnderlinePanels.Tab value="local">Local</UnderlinePanels.Tab>
                <UnderlinePanels.Tab value="codespaces">Codespaces</UnderlinePanels.Tab>
              </UnderlinePanels.List>
              <UnderlinePanels.Panel value="local">Clone locally</UnderlinePanels.Panel>
              <UnderlinePanels.Panel value="codespaces">Create a codespace</UnderlinePanels.Panel>
            </UnderlinePanels>
          </AnchoredOverlay.Content>
        </AnchoredOverlay>
      )
      render(strictMode ? <React.StrictMode>{example}</React.StrictMode> : example)
      const trigger = screen.getByRole('button', {name: 'Code'})
      for (let cycle = 0; cycle < 3; cycle += 1) {
        await user.click(trigger)
        const local = await screen.findByRole('tab', {name: 'Local'})
        const codespaces = screen.getByRole('tab', {name: 'Codespaces'})
        await waitFor(() => expect(local).toHaveFocus())
        onChange.mockClear()
        await user.keyboard('{ArrowRight}')
        expect(codespaces).toHaveFocus()
        expect(local).toHaveAttribute('aria-selected', 'true')
        expect(codespaces).toHaveAttribute('tabindex', '0')
        expect(local).toHaveAttribute('tabindex', '-1')
        expect(onChange).not.toHaveBeenCalled()
        await user.keyboard('{Enter}')
        expect(codespaces).toHaveAttribute('aria-selected', 'true')
        expect(onChange).toHaveBeenCalledExactlyOnceWith({value: 'codespaces'})
        await user.keyboard('{ArrowLeft}')
        expect(local).toHaveFocus()
        expect(codespaces).toHaveAttribute('aria-selected', 'true')
        await user.keyboard('{End}')
        expect(codespaces).toHaveFocus()
        await user.keyboard('{Home}')
        expect(local).toHaveFocus()
        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('tablist')).not.toBeInTheDocument())
        expect(trigger).toHaveFocus()
      }
    })

    it('keeps the tablist roving tabindex intact (exactly one tab is tabbable)', async () => {
      render(
        <AnchoredOverlay defaultOpen>
          <AnchoredOverlay.Trigger>Open</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content role="dialog" aria-label="Select a ref type">
            <UnderlinePanels defaultValue="branch">
              <UnderlinePanels.List aria-label="Ref type">
                <UnderlinePanels.Tab value="branch">Branches</UnderlinePanels.Tab>
                <UnderlinePanels.Tab value="tag">Tags</UnderlinePanels.Tab>
              </UnderlinePanels.List>
              <UnderlinePanels.Panel value="branch">Branch panel</UnderlinePanels.Panel>
              <UnderlinePanels.Panel value="tag">Tag panel</UnderlinePanels.Panel>
            </UnderlinePanels>
          </AnchoredOverlay.Content>
        </AnchoredOverlay>,
      )

      const branch = await screen.findByRole('tab', {name: 'Branches'})
      const tag = screen.getByRole('tab', {name: 'Tags'})

      expect(branch).toHaveAttribute('tabindex', '0')
      expect(tag).toHaveAttribute('tabindex', '-1')
    })
  })
})
