import {ActionMenu} from '@primer/react'
import {TrashIcon} from '@primer/octicons-react'

function LeadingVisual() {
  return <ActionMenu.Button leadingVisual={TrashIcon}>Test</ActionMenu.Button>
}

function TrailingVisual() {
  return <ActionMenu.Button trailingVisual={TrashIcon}>Test</ActionMenu.Button>
}

function OutlineVariant() {
  return <ActionMenu.Button variant="invisible">Test</ActionMenu.Button>
}
