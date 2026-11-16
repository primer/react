import type React from 'react'
import {describe, expectTypeOf, it} from 'vitest'
import {SelectPanel as RootSelectPanel} from '../../index'
import {SelectPanel as SelectionSelectPanel} from '../selection'
import {
  SelectPanel,
  type SelectPanelItem,
  type SelectPanelMultipleProps,
  type SelectPanelProps,
  type SelectPanelSingleProps,
} from './index'

type LabelItem = SelectPanelItem & {id: number; color: string}

declare const labels: LabelItem[]
declare const label: LabelItem | undefined
declare const selectedLabels: LabelItem[]
declare const looseLabels: LabelItem | LabelItem[] | undefined
declare const retained: SelectPanelItem[]
declare const narrowItems: Array<{id: string; text: string}>

// Type-only checks; never rendered.
export function typeChecks() {
  return (
    <>
      <SelectPanel
        items={labels}
        selected={label}
        onSelectedChange={next => {
          expectTypeOf(next).toEqualTypeOf<LabelItem | undefined>()
        }}
        renderItem={item => {
          expectTypeOf(item).toEqualTypeOf<LabelItem>()
          return item.color
        }}
        title="Single by default"
      />
      <SelectPanel
        items={labels}
        selected={undefined}
        onSelectedChange={next => {
          expectTypeOf(next).toEqualTypeOf<LabelItem | undefined>()
        }}
        title="Undefined is single"
      />
      <SelectPanel
        items={labels}
        selected={selectedLabels}
        onSelectedChange={next => {
          expectTypeOf(next).toEqualTypeOf<LabelItem[]>()
        }}
        title="Array infers multiple"
      />
      <SelectPanel
        items={labels}
        selected={[]}
        selectionVariant="multiple"
        onSelectedChange={next => {
          expectTypeOf(next).toEqualTypeOf<LabelItem[]>()
        }}
        title="Explicit multiple"
      />
      <SelectPanel
        items={narrowItems}
        selected={retained}
        onSelectedChange={next => {
          expectTypeOf(next).toEqualTypeOf<Array<{id: string; text: string} | SelectPanelItem>>()
        }}
        title="Retained selection widens the callback"
      />
      <SelectPanel
        items={labels}
        selected={label}
        // @ts-expect-error Custom fields are preserved, so unknown fields are rejected.
        onSelectedChange={next => next?.missing}
        title="Custom fields"
      />
      {/* @ts-expect-error A single selection cannot be an array. */}
      <SelectPanel items={labels} selected={selectedLabels} selectionVariant="single" onSelectedChange={() => {}} />
      {/* @ts-expect-error Multiple selection requires an array. */}
      <SelectPanel items={labels} selected={undefined} selectionVariant="multiple" onSelectedChange={() => {}} />
      {/* @ts-expect-error Array selections report arrays. */}
      <SelectPanel items={labels} selected={selectedLabels} onSelectedChange={(_next: LabelItem | undefined) => {}} />
      {/* @ts-expect-error Single selections report one item. */}
      <SelectPanel items={labels} selected={label} onSelectedChange={(_next: LabelItem[]) => {}} />
      {/* @ts-expect-error Runtime-decided selection shapes must choose one mode. */}
      <SelectPanel items={labels} selected={looseLabels} onSelectedChange={() => {}} />
      <SelectPanel
        items={labels}
        selected={{id: '1', text: 'One'}}
        onSelectedChange={next => {
          // Retained options with string IDs stay distinct from numeric `items`.
          expectTypeOf(next).toEqualTypeOf<LabelItem | {id: string; text: string} | undefined>()
        }}
        title="Distinct IDs"
      />
    </>
  )
}

describe('SelectPanel types', () => {
  it('discriminates selection props by mode and preserves item types', () => {
    expectTypeOf<SelectPanelSingleProps<LabelItem>['selected']>().toEqualTypeOf<LabelItem | undefined>()
    expectTypeOf<SelectPanelMultipleProps<LabelItem>['selected']>().toEqualTypeOf<readonly LabelItem[]>()
    expectTypeOf<SelectPanelProps<LabelItem>>().toEqualTypeOf<
      SelectPanelSingleProps<LabelItem> | SelectPanelMultipleProps<LabelItem>
    >()
    expectTypeOf<React.ComponentProps<typeof SelectPanel>>().toMatchTypeOf<SelectPanelProps>()
  })

  it('keeps compound members and package entry points typed', () => {
    expectTypeOf(RootSelectPanel).toEqualTypeOf(SelectPanel)
    expectTypeOf(SelectionSelectPanel).toEqualTypeOf(SelectPanel)
    expectTypeOf(SelectPanel.Message).not.toBeAny()
    expectTypeOf(SelectPanel.SecondaryActionButton).not.toBeAny()
  })
})
