'use client'

import {Combobox} from '@base-ui/react/combobox'
import React from 'react'
import {SelectionVisual, type SelectionVisualVariant} from '../../internal/selectionVisuals'
import {Checkbox, type CheckboxProps} from '../Checkbox'
import {SkeletonBox} from '../SkeletonBox'
import {Spinner} from '../Spinner'
import {FilteredActionListLoadingTypes, type FilteredActionListLoadingType} from './constants'

const skeletonRowHeight = 24
const skeletonMinimumRows = 3
const skeletonWidths = ['80%', '52.5%', '67.5%', '40%', '72.5%'] as const
const getUndefinedSnapshot = () => undefined

/** Draws the checkbox, radio, or checkmark of a selectable combobox option from the option's selected state. */
export function ComboboxSelectionIndicator({disabled, variant}: {disabled?: boolean; variant: SelectionVisualVariant}) {
  return (
    <Combobox.ItemIndicator
      keepMounted
      // The visual draws its own content in place of Base UI's placeholder children.
      render={({children: _children, ...props}, state) => (
        <SelectionVisual {...props} checked={state.selected} disabled={disabled} variant={variant} />
      )}
    />
  )
}

export interface SelectAllRowProps extends Pick<CheckboxProps, 'checked' | 'indeterminate' | 'onCheckedChange'> {
  /** Visible label, which also names the checkbox. */
  label: string
}

/** The "Select all" row above a multi-select list. */
export function SelectAllRow({label, ...checkboxProps}: SelectAllRowProps) {
  const checkboxId = React.useId()

  return (
    <div
      className="flex shrink-0 items-center border-b border-default bg-muted px-4 py-1"
      data-component="FilteredActionList.SelectAll"
    >
      <Checkbox {...checkboxProps} className="mt-1 mr-2 mb-[calc(var(--base-size-4)-1px)]" id={checkboxId} />
      <label className="text-sm text-muted" data-component="FilteredActionList.SelectAllLabel" htmlFor={checkboxId}>
        {label}
      </label>
    </div>
  )
}

export interface BodyLoaderProps {
  /**
   * Gives the loader its own status message for when the list's live region is disabled; otherwise that live region
   * already announces loading and the loader stays visual.
   */
  announce: boolean
  /** Whether the body shows a centred spinner or skeleton rows. */
  loadingType: FilteredActionListLoadingType
}

/** The spinner or skeleton rows that stand in for a filtered list's options while they load. */
export function BodyLoader({announce, loadingType}: BodyLoaderProps) {
  const [skeletonElement, setSkeletonElement] = React.useState<HTMLDivElement | null>(null)
  const subscribeToSkeletonHeight = React.useCallback(
    (onStoreChange: () => void) => {
      if (!skeletonElement || typeof ResizeObserver === 'undefined') return () => {}
      const observer = new ResizeObserver(onStoreChange)
      observer.observe(skeletonElement)
      return () => observer.disconnect()
    },
    [skeletonElement],
  )
  const getSkeletonHeight = React.useCallback(() => skeletonElement?.clientHeight, [skeletonElement])
  const skeletonHeight = React.useSyncExternalStore(subscribeToSkeletonHeight, getSkeletonHeight, getUndefinedSnapshot)

  if (loadingType === FilteredActionListLoadingTypes.bodySpinner) {
    return (
      <div
        className="flex h-full min-h-[200px] w-full flex-1 items-center justify-center p-4 text-muted"
        data-component="FilteredActionList.Spinner"
        role={announce ? 'status' : undefined}
      >
        <Spinner data-testid="filtered-action-list-spinner" srText={null} />
        {announce ? <span className="sr-only">Loading items</span> : null}
      </div>
    )
  }

  const skeletonRows =
    skeletonHeight === undefined ? 10 : Math.max(skeletonMinimumRows, Math.floor(skeletonHeight / skeletonRowHeight))

  return (
    <div
      className="flex h-full min-h-[200px] w-full flex-1 flex-col gap-2 p-2"
      data-component="FilteredActionList.Skeleton"
      data-testid="filtered-action-list-skeleton"
      ref={setSkeletonElement}
      role={announce ? 'status' : undefined}
    >
      {announce ? <span className="sr-only">Loading items</span> : null}
      {Array.from({length: skeletonRows}, (_, index) => (
        <div key={index} className="flex items-center gap-2">
          <SkeletonBox className="size-4 shrink-0" />
          <SkeletonBox height="10px" width={skeletonWidths[index % skeletonWidths.length]} />
        </div>
      ))}
    </div>
  )
}
