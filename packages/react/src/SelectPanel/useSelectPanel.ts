import React from 'react'
import {useControllableState} from '../hooks/useControllableState'
import {useId} from '../hooks/useId'
import {invariant} from '../utils/invariant'

export type SelectPanelValue = string | number
export type SelectPanelDismissReason = 'anchor-click' | 'click-outside' | 'escape' | 'close' | 'back'

export type SelectPanelOpenChangeReason =
  | SelectPanelDismissReason
  | 'anchor-key-press'
  | 'selection'
  | 'cancel'
  | 'submit'

export interface SelectPanelStateOptions<T = SelectPanelValue> {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, reason: SelectPanelOpenChangeReason) => void
  selected?: T[]
  defaultSelected?: T[]
  onSelectedChange?: (selected: T[]) => void
  onSubmit?: (selected: T[]) => void
  onCancel?: () => void
  onDismiss?: (reason: SelectPanelDismissReason) => void
  selectionMode?: 'single' | 'multiple'
  closeOnSelect?: boolean
  focusStrategy?: 'active-descendant' | 'roving'
  filterValue?: string
  defaultFilterValue?: string
  onFilterChange?: (value: string, event: React.ChangeEvent<HTMLInputElement> | null) => void
  isItemEqual?: (first: T, second: T) => boolean
  isItemDisabled?: (item: T) => boolean
}

export function getSelectedItems<T>(
  selected: T[],
  item: T,
  selectionMode: 'single' | 'multiple',
  isItemEqual: (first: T, second: T) => boolean = Object.is,
): T[] {
  const isSelected = selected.some(value => isItemEqual(value, item))
  if (selectionMode === 'single') return isSelected ? [] : [item]
  return isSelected ? selected.filter(value => !isItemEqual(value, item)) : [...selected, item]
}

export function useSelectPanel<T = SelectPanelValue>({
  id: externalId,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  selected: controlledSelected,
  defaultSelected = [],
  onSelectedChange,
  onSubmit,
  onCancel,
  onDismiss,
  selectionMode = 'single',
  closeOnSelect = false,
  focusStrategy = 'active-descendant',
  filterValue: controlledFilterValue,
  defaultFilterValue = '',
  onFilterChange,
  isItemEqual = Object.is,
  isItemDisabled,
}: SelectPanelStateOptions<T> = {}) {
  const id = useId(externalId)
  const [open, setOpen] = useControllableState({
    name: 'SelectPanel.open',
    value: controlledOpen,
    defaultValue: defaultOpen,
  })
  const [selected, setSelected] = useControllableState({
    name: 'SelectPanel.selected',
    value: controlledSelected,
    defaultValue: defaultSelected,
    onChange: onSelectedChange,
  })
  const [filterValue, setFilter] = useControllableState({
    name: 'SelectPanel.filterValue',
    value: controlledFilterValue,
    defaultValue: defaultFilterValue,
  })
  const anchorRef = React.useRef<HTMLElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [inputElement, setInputElement] = React.useState<HTMLInputElement | null>(null)
  const collectionKeyDownRef = React.useRef<React.KeyboardEventHandler<HTMLElement>>()
  const setCollectionKeyDown = React.useCallback((handler?: React.KeyboardEventHandler<HTMLElement>) => {
    collectionKeyDownRef.current = handler
  }, [])
  const [collectionElement, updateCollectionElement] = React.useState<HTMLElement | null>(null)
  const collectionRef = React.useRef<HTMLElement | null>(null)
  const [panelId, setPanelId] = React.useState(`${id}-panel`)
  const [labelledBy, updateLabelledBy] = React.useState<string>()
  const labelledByRef = React.useRef<string>()
  const setLabelledBy = React.useCallback((id: string | undefined) => {
    labelledByRef.current = id
    updateLabelledBy(id)
  }, [])
  const [describedBy, setDescribedBy] = React.useState<string>()

  invariant(
    selectionMode === 'multiple' || selected.length <= 1,
    'Single-selection panels accept at most one selected item.',
  )

  const requestOpenChange = React.useCallback(
    (nextOpen: boolean, reason: SelectPanelOpenChangeReason) => {
      if (nextOpen === open) return
      setOpen(nextOpen)
      onOpenChange?.(nextOpen, reason)
    },
    [onOpenChange, open, setOpen],
  )

  const selectItem = React.useCallback(
    (item: T) => {
      if (isItemDisabled?.(item)) return
      setSelected(getSelectedItems(selected, item, selectionMode, isItemEqual))
      if (closeOnSelect) requestOpenChange(false, 'selection')
    },
    [closeOnSelect, isItemDisabled, isItemEqual, requestOpenChange, selected, selectionMode, setSelected],
  )

  const submit = React.useCallback(() => {
    onSubmit?.(selected)
    requestOpenChange(false, 'submit')
  }, [onSubmit, requestOpenChange, selected])

  const cancel = React.useCallback(() => {
    onCancel?.()
    requestOpenChange(false, 'cancel')
  }, [onCancel, requestOpenChange])

  const dismiss = React.useCallback(
    (reason: SelectPanelDismissReason) => {
      onDismiss?.(reason)
      requestOpenChange(false, reason)
    },
    [onDismiss, requestOpenChange],
  )

  const clearSelection = React.useCallback(() => setSelected([]), [setSelected])

  const setFilterValue = React.useCallback(
    (value: string, event: React.ChangeEvent<HTMLInputElement> | null) => {
      setFilter(value)
      onFilterChange?.(value, event)
    },
    [onFilterChange, setFilter],
  )

  const registerInput = React.useCallback((element: HTMLInputElement | null) => {
    invariant(
      !element || !inputRef.current || inputRef.current === element,
      'Render only one SelectPanel.SearchInput per SelectPanel.Root.',
    )
    inputRef.current = element
    setInputElement(element)
  }, [])
  const setCollectionElement = React.useCallback((element: HTMLElement | null) => {
    invariant(
      !element || !collectionRef.current || collectionRef.current === element,
      'Render only one SelectPanel.List per SelectPanel.Root.',
    )
    collectionRef.current = element
    updateCollectionElement(element)
  }, [])
  const isSelected = React.useCallback(
    (item: T) => selected.some(value => isItemEqual(value, item)),
    [isItemEqual, selected],
  )

  return {
    id,
    open,
    requestOpenChange,
    selected,
    selectItem,
    isSelected,
    submit,
    cancel,
    dismiss,
    clearSelection,
    selectionMode,
    filterValue,
    setFilterValue,
    anchorRef,
    inputRef,
    inputElement,
    collectionKeyDownRef,
    setCollectionKeyDown,
    focusStrategy,
    registerInput,
    collectionElement,
    setCollectionElement,
    panelId,
    setPanelId,
    listId: `${id}-list`,
    titleId: `${id}-title`,
    descriptionId: `${id}-description`,
    labelledBy,
    labelledByRef,
    setLabelledBy,
    describedBy,
    setDescribedBy,
  }
}

export type SelectPanelState<T = SelectPanelValue> = ReturnType<typeof useSelectPanel<T>>
