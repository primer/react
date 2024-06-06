import {Button} from '@primer/react'
import {TrashIcon} from '@primer/octicons-react'

function LeadingVisual() {
  return <Button leadingIcon={TrashIcon}>Test</Button>
}

function TrailingVisual() {
  return <Button trailingIcon={TrashIcon}>Test</Button>
}

function OutlineVariant() {
  return <Button variant="outline">Test</Button>
}
