export type SelectionVariant = 'single' | 'multiple' | 'radio'

export function getSelectionRole(role: string | undefined, selectionVariant: SelectionVariant | false | undefined) {
  if (role === 'menu' || role === 'menubar') {
    if (selectionVariant === 'multiple') return 'menuitemcheckbox'
    if (selectionVariant === 'single' || selectionVariant === 'radio') return 'menuitemradio'
    return 'menuitem'
  }

  if (role === 'tree') return 'treeitem'
  return role === 'listbox' ? 'option' : undefined
}

export function getSelectionAttribute(role: string | undefined) {
  return role === 'menuitemcheckbox' || role === 'menuitemradio'
    ? 'aria-checked'
    : role === 'option' || role === 'treeitem'
      ? 'aria-selected'
      : undefined
}
