import {Button} from '@primer/react'
import {TrashIcon} from '@primer/octicons-react'

function LeadingVisual() {
  return <Button leadingVisual={TrashIcon}>Test</Button>
}

function TrailingVisual() {
  return <Button trailingVisual={TrashIcon}>Test</Button>
}

function OutlineVariant() {
  return <Button variant="invisible">Test</Button>
}
