import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {BookIcon} from '@primer/octicons-react'
import {DataActionList} from './DataActionList'
import type {DataActionListRow} from './types'

describe('DataActionList', () => {
  it('renders deterministic rows from data', () => {
    const rows: DataActionListRow[] = [
      {kind: 'item', key: 'item-a', label: 'Item A'},
      {kind: 'divider', key: 'divider-a'},
      {
        kind: 'group',
        key: 'group-a',
        heading: {content: 'Group A', as: 'h4'},
        rows: [{kind: 'item', key: 'item-b', label: 'Item B'}],
      },
    ]

    const {container, getByRole, getByText} = render(
      <DataActionList heading={{as: 'h3', content: 'Heading'}} rows={rows} />,
    )

    expect(getByRole('heading', {name: 'Heading'})).toBeInTheDocument()
    expect(getByRole('heading', {name: 'Group A'})).toBeInTheDocument()
    expect(getByText('Item A')).toBeInTheDocument()
    expect(getByText('Item B')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-component="ActionList.Divider"]')).toHaveLength(1)
  })

  it('infers option roles and aria-selected for listbox single selection', () => {
    const rows: DataActionListRow[] = [
      {kind: 'item', key: 'item-a', label: 'Item A', selected: true},
      {kind: 'item', key: 'item-b', label: 'Item B', selected: false},
    ]

    const {getAllByRole} = render(
      <DataActionList role="listbox" selectionVariant="single" aria-label="Listbox" rows={rows} />,
    )

    const options = getAllByRole('option')

    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('infers menuitemcheckbox roles and aria-checked for menu multiple selection', () => {
    const rows: DataActionListRow[] = [
      {kind: 'item', key: 'item-a', label: 'Item A', selected: true},
      {kind: 'item', key: 'item-b', label: 'Item B', selected: false},
    ]

    const {getAllByRole} = render(
      <DataActionList role="menu" selectionVariant="multiple" aria-label="Menu" rows={rows} />,
    )

    const items = getAllByRole('menuitemcheckbox')

    expect(items[0]).toHaveAttribute('aria-checked', 'true')
    expect(items[1]).toHaveAttribute('aria-checked', 'false')
  })

  it('applies group selection override semantics', () => {
    const rows: DataActionListRow[] = [
      {
        kind: 'group',
        key: 'group-a',
        selectionVariant: false,
        heading: {content: 'Group A', as: 'h4'},
        rows: [{kind: 'item', key: 'item-a', label: 'Item A', selected: true}],
      },
    ]

    const {container, getByRole} = render(
      <DataActionList role="listbox" selectionVariant="single" aria-label="Listbox" rows={rows} />,
    )

    const option = getByRole('option')
    expect(option).toHaveAttribute('aria-selected', 'true')
    expect(container.querySelector('[data-component="ActionList.Selection"]')).not.toBeInTheDocument()
  })

  it('preserves description wiring through generated accessibility ids', () => {
    const rows: DataActionListRow[] = [
      {
        kind: 'item',
        key: 'item-a',
        label: 'Item A',
        description: {variant: 'block', content: 'Detailed description'},
      },
    ]

    const {container, getByRole} = render(
      <DataActionList role="listbox" selectionVariant="single" aria-label="Listbox" rows={rows} />,
    )

    const option = getByRole('option')
    const description = container.querySelector('[data-component="ActionList.Description"]')

    expect(description?.id).toBeTruthy()
    expect(option.getAttribute('aria-describedby')).toContain(description?.id as string)
  })

  it('renders link rows with anchor semantics and context-aware click handler', () => {
    const onClick = vi.fn()
    const rows: DataActionListRow[] = [
      {
        kind: 'link',
        key: 'open-docs',
        label: context => `Open docs ${context.indexes.itemIndex}`,
        href: 'https://primer.style/react',
        target: '_blank',
        rel: 'noreferrer',
        description: {content: 'Primer docs'},
        onClick,
      },
    ]

    const {getByRole} = render(<DataActionList rows={rows} />)
    const link = getByRole('link', {name: 'Open docs 0'})

    expect(link).toHaveAttribute('href', 'https://primer.style/react')
    expect(link).toHaveAttribute('target', '_blank')

    fireEvent.click(link)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick.mock.calls[0][1].ids.itemId).toContain('open-docs')
  })

  it('supports router-like link rows with as + linkProps', () => {
    const CustomLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement> & {to: string; custom: boolean}
    >(({to, custom, children, ...props}, ref) => (
      <a ref={ref} href={to} data-custom-link={custom} {...props}>
        {children}
      </a>
    ))
    CustomLink.displayName = 'CustomLink'

    const rows: DataActionListRow[] = [
      {
        kind: 'link',
        key: 'router-link',
        as: CustomLink,
        label: 'Router docs',
        linkProps: {
          to: '/docs',
          custom: true,
        },
      },
    ]

    render(<DataActionList rows={rows} />)

    const link = screen.getByRole('link', {name: 'Router docs'})
    expect(link).toHaveAttribute('href', '/docs')
    expect(link).toHaveAttribute('data-custom-link', 'true')
  })

  it('calls both linkProps onClick and row onClick for router-like link rows', () => {
    const linkPropsOnClick = vi.fn()
    const rowOnClick = vi.fn()

    const rows: DataActionListRow[] = [
      {
        kind: 'link',
        key: 'router-clicks',
        label: 'Router click',
        href: '/router-click',
        onClick: rowOnClick,
        linkProps: {
          onClick: linkPropsOnClick,
        },
      },
    ]

    render(<DataActionList rows={rows} />)

    fireEvent.click(screen.getByRole('link', {name: 'Router click'}))

    expect(linkPropsOnClick).toHaveBeenCalledTimes(1)
    expect(rowOnClick).toHaveBeenCalledTimes(1)
  })

  it('throws when trailingAction is used in listbox or menu semantics', () => {
    const rows: DataActionListRow[] = [
      {
        kind: 'item',
        key: 'item-a',
        label: 'Item A',
        trailingAction: {
          icon: BookIcon,
          label: 'Open',
        },
      },
    ]

    expect(() =>
      render(<DataActionList role="listbox" selectionVariant="single" aria-label="Listbox" rows={rows} />),
    ).toThrow('DataActionList trailingAction is not supported in menu, menubar, or listbox semantics.')
  })

  it('skips onSelect for disabled, inactive, and loading rows', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    const rows: DataActionListRow[] = [
      {kind: 'item', key: 'disabled', label: 'Disabled', disabled: true, onSelect},
      {kind: 'item', key: 'inactive', label: 'Inactive', inactiveText: 'Unavailable', onSelect},
      {kind: 'item', key: 'loading', label: 'Loading', loading: true, onSelect},
    ]

    const {getByRole, getAllByRole} = render(
      <DataActionList role="listbox" selectionVariant="single" aria-label="Listbox" rows={rows} />,
    )

    const disabled = getByRole('option', {name: 'Disabled'})
    const inactive = getByRole('option', {name: 'Inactive'})
    const loading = getByRole('option', {name: /Loading/})

    fireEvent.click(disabled)
    fireEvent.click(inactive)
    fireEvent.click(loading)

    await user.tab()
    const options = getAllByRole('option')
    options[0].focus()
    fireEvent.keyPress(options[0], {key: 'Enter', charCode: 13})

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('throws on duplicate row keys', () => {
    const rows: DataActionListRow[] = [
      {kind: 'item', key: 'duplicate', label: 'One'},
      {kind: 'item', key: 'duplicate', label: 'Two'},
    ]

    expect(() => render(<DataActionList rows={rows} />)).toThrow(
      'DataActionList row key "duplicate" is duplicated. Row keys must be unique across all rows and groups.',
    )
  })
})
