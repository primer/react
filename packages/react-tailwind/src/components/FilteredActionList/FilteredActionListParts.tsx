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
      className="primer:flex primer:shrink-0 primer:items-center primer:border-b primer:border-default primer:bg-muted primer:px-4 primer:py-1"
      data-component="FilteredActionList.SelectAll"
    >
      <Checkbox
        {...checkboxProps}
        className="primer:mt-1 primer:mr-2 primer:mb-[calc(var(--base-size-4)-1px)]"
        id={checkboxId}
      />
      <label
        className="primer:text-sm primer:text-muted"
        data-component="FilteredActionList.SelectAllLabel"
        htmlFor={checkboxId}
      >
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
        className="primer:flex primer:h-full primer:min-h-[200px] primer:w-full primer:flex-1 primer:items-center primer:justify-center primer:p-4 primer:text-muted"
        data-component="FilteredActionList.Spinner"
        role={announce ? 'status' : undefined}
      >
        <Spinner data-testid="filtered-action-list-spinner" srText={null} />
        {announce ? <span className="primer:sr-only">Loading items</span> : null}
      </div>
    )
  }

  const skeletonRows =
    skeletonHeight === undefined ? 10 : Math.max(skeletonMinimumRows, Math.floor(skeletonHeight / skeletonRowHeight))

  return (
    <div
      className="primer:flex primer:h-full primer:min-h-[200px] primer:w-full primer:flex-1 primer:flex-col primer:gap-2 primer:p-2"
      data-component="FilteredActionList.Skeleton"
      data-testid="filtered-action-list-skeleton"
      ref={setSkeletonElement}
      role={announce ? 'status' : undefined}
    >
      {announce ? <span className="primer:sr-only">Loading items</span> : null}
      {Array.from({length: skeletonRows}, (_, index) => (
        <div key={index} className="primer:flex primer:items-center primer:gap-2">
          <SkeletonBox className="primer:size-4 primer:shrink-0" />
          <SkeletonBox height="10px" width={skeletonWidths[index % skeletonWidths.length]} />
        </div>
      ))}
    </div>
  )
}
