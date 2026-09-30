import {describe, expect, it, vi} from 'vitest'
import {createRef} from 'react'
import {isValidElementType} from 'react-is'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// eslint-disable-next-line import/no-namespace
import * as Primer from '../index'
// eslint-disable-next-line import/no-namespace
import * as Experimental from '../experimental'
import {ActionList as LegacyActionList} from '../ActionList'
import {Dialog as LegacyDialog} from '../Dialog'
import LegacyFormControl from '../FormControl'
import LegacyTextInput from '../TextInput'

const namespaces = {
  ActionBar: Primer.ActionBar,
  ActionList: Primer.ActionList,
  ActionMenu: Primer.ActionMenu,
  Autocomplete: Primer.Autocomplete,
  Banner: Primer.Banner,
  Breadcrumb: Primer.Breadcrumb,
  Breadcrumbs: Primer.Breadcrumbs,
  CheckboxGroup: Primer.CheckboxGroup,
  CircleBadge: Primer.CircleBadge,
  Details: Primer.Details,
  Dialog: Primer.Dialog,
  FormControl: Primer.FormControl,
  Header: Primer.Header,
  NavList: Primer.NavList,
  PageHeader: Primer.PageHeader,
  PageLayout: Primer.PageLayout,
  Popover: Primer.Popover,
  ProgressBar: Primer.ProgressBar,
  RadioGroup: Primer.RadioGroup,
  SegmentedControl: Primer.SegmentedControl,
  Select: Primer.Select,
  SelectPanel: Primer.SelectPanel,
  SideNav: Primer.SideNav,
  SplitPageLayout: Primer.SplitPageLayout,
  Stack: Primer.Stack,
  SubNav: Primer.SubNav,
  TextInput: Primer.TextInput,
  Timeline: Primer.Timeline,
  TreeView: Primer.TreeView,
  UnderlineNav: Primer.UnderlineNav,
  'experimental.ActionBar': Experimental.ActionBar,
  'experimental.Blankslate': Experimental.Blankslate,
  'experimental.Card': Experimental.Card,
  'experimental.Dialog': Experimental.Dialog,
  'experimental.FilteredActionList': Experimental.FilteredActionList,
  'experimental.NavList': Experimental.NavList,
  'experimental.PageHeader': Experimental.PageHeader,
  'experimental.SelectPanel': Experimental.SelectPanel,
  'experimental.Stack': Experimental.Stack,
  'experimental.Table': Experimental.Table,
  'experimental.TopicTag': Experimental.TopicTag,
  'experimental.UnderlinePanels': Experimental.UnderlinePanels,
  'ActionList.GroupHeading': Primer.ActionList.GroupHeading,
}

describe('compound component namespace exports', () => {
  it.each(Object.entries(namespaces))('%s exposes a root and statically exported parts', (_name, namespace) => {
    expect(isValidElementType(namespace)).toBe(false)
    expect(isValidElementType(namespace.Root)).toBe(true)

    for (const part of Object.values(namespace)) {
      if (typeof part === 'object' && part !== null && 'Root' in part) {
        expect(isValidElementType(part.Root)).toBe(true)
      } else {
        expect(isValidElementType(part)).toBe(true)
      }
    }
  })

  it('preserves component identity and slot markers', () => {
    expect(Primer.ActionList.Root).toBe(LegacyActionList)
    expect(Primer.ActionList.Item).toBe(LegacyActionList.Item)
    expect(Primer.ActionList.GroupHeading.Root).toBe(LegacyActionList.GroupHeading)
    expect(Primer.ActionList.GroupHeading.TrailingAction).toBe(LegacyActionList.GroupHeading.TrailingAction)
    expect(Primer.Dialog.Root).toBe(LegacyDialog)
    expect(Primer.FormControl.Root).toBe(LegacyFormControl)
    expect(Primer.FormControl.Root.__SLOT__).toBe(LegacyFormControl.__SLOT__)
    expect(Primer.TextInput.Root).toBe(LegacyTextInput)
    expect(Primer.TextInput.Root.__SLOT__).toBe(LegacyTextInput.__SLOT__)
  })

  it('shares namespaces across entrypoints without conflating the SelectPanel versions', () => {
    expect(Primer.ActionBar).toBe(Experimental.ActionBar)
    expect(Primer.Dialog).toBe(Experimental.Dialog)
    expect(Primer.NavList).toBe(Experimental.NavList)
    expect(Primer.PageHeader).toBe(Experimental.PageHeader)
    expect(Primer.Stack).toBe(Experimental.Stack)
    expect(Primer.Breadcrumb).toBe(Primer.Breadcrumbs)
    expect(Primer.SelectPanel.Root).not.toBe(Experimental.SelectPanel.Root)
  })

  it('renders ActionList roots, nested headings, and wrapped slots', async () => {
    const onSelect = vi.fn()
    const LeadingVisual = Primer.asSlot(function LeadingVisual() {
      return <Primer.ActionList.LeadingVisual>Visual</Primer.ActionList.LeadingVisual>
    }, Primer.ActionList.LeadingVisual)

    render(
      <Primer.ActionList.Root>
        <Primer.ActionList.Group>
          <Primer.ActionList.GroupHeading.Root as="h2">Actions</Primer.ActionList.GroupHeading.Root>
          <Primer.ActionList.Item onSelect={onSelect}>
            <LeadingVisual />
            Copy link
          </Primer.ActionList.Item>
        </Primer.ActionList.Group>
      </Primer.ActionList.Root>,
    )

    expect(screen.getByRole('heading', {name: 'Actions'})).toBeVisible()
    expect(screen.getByText('Visual')).toHaveAttribute('data-component', 'ActionList.LeadingVisual')
    await userEvent.click(screen.getByRole('button', {name: 'Copy link'}))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('preserves FormControl composition, labels, input behavior, and refs', async () => {
    const ref = createRef<HTMLInputElement>()

    render(
      <Primer.FormControl.Root>
        <Primer.FormControl.Label>Name</Primer.FormControl.Label>
        <Primer.TextInput.Root ref={ref} />
        <Primer.FormControl.Caption>Your display name</Primer.FormControl.Caption>
      </Primer.FormControl.Root>,
    )

    const input = screen.getByRole('textbox', {name: 'Name'})
    expect(ref.current).toBe(input)
    expect(input).toHaveAccessibleDescription('Your display name')
    await userEvent.type(input, 'Primer')
    expect(input).toHaveValue('Primer')
  })

  it('renders an experimental namespace root and its parts', () => {
    render(
      <Experimental.Blankslate.Root>
        <Experimental.Blankslate.Heading>No items</Experimental.Blankslate.Heading>
        <Experimental.Blankslate.Description>Create an item to get started.</Experimental.Blankslate.Description>
      </Experimental.Blankslate.Root>,
    )

    expect(screen.getByRole('heading', {name: 'No items'})).toBeVisible()
    expect(screen.getByText('Create an item to get started.')).toBeVisible()
  })
})
