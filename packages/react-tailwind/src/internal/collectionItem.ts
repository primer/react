'use client'

import React from 'react'

/** The item fields shared by list-like collections such as FilteredActionList and SelectPanel. */
export interface CollectionItem {
  id?: string | number
  key?: React.Key
  /** Text used to filter an item whose label is not plain text. */
  filterValue?: string
  text?: React.ReactNode
  children?: React.ReactNode
}

export type CollectionItemVisual = React.ElementType | React.ReactNode

/** Identifies an item by `id`, falling back to reference equality for items without one. */
export function areItemsEqual(first: CollectionItem, second: CollectionItem): boolean {
  if (first.id === undefined && second.id === undefined) return first === second
  return first.id !== undefined && second.id !== undefined && Object.is(first.id, second.id)
}

/** Encodes an item id so that numeric and string ids never collide. */
export function itemIdKey(id: string | number): string {
  return `${typeof id}:${String(id)}`
}

/** A stable React key, preferring `id`, then `key`, then position. */
export function getItemRenderKey(item: CollectionItem, index: number): string {
  if (item.id !== undefined) return `id:${itemIdKey(item.id)}`
  if (item.key !== undefined) return `key:${itemIdKey(item.key as string | number)}`
  return `item:${index}`
}

function textFromNode(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textFromNode).join('')
  if (React.isValidElement<{children?: React.ReactNode}>(node)) return textFromNode(node.props.children)
  return ''
}

/** The plain-text label used for filtering and typeahead. */
export function getItemText(item: CollectionItem): string {
  return item.filterValue ?? textFromNode(item.text ?? item.children)
}

/** Renders an item visual given either an element type or already-rendered content. */
export function renderItemVisual(visual: CollectionItemVisual | undefined): React.ReactNode {
  if (!visual) return null
  if (typeof visual === 'string' || typeof visual === 'number' || React.isValidElement(visual)) return visual
  return React.createElement(visual as React.ElementType)
}
