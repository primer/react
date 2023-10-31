import {ActionMenu} from '@primer/react'
import {TrashIcon} from '@primer/octicons-react'

function LeadingVisual() {
  return <ActionMenu.Button leadingIcon={TrashIcon}>Test</ActionMenu.Button>
}

function TrailingVisual() {
  return <ActionMenu.Button trailingIcon={TrashIcon}>Test</ActionMenu.Button>
}

function OutlineVariant() {
  return <ActionMenu.Button variant="outline">Test</ActionMenu.Button>
}
