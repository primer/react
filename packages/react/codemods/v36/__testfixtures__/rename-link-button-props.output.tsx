import {LinkButton} from '@primer/react'
import {TrashIcon} from '@primer/octicons-react'

function LeadingVisual() {
  return <LinkButton leadingVisual={TrashIcon}>Test</LinkButton>
}

function TrailingVisual() {
  return <LinkButton trailingVisual={TrashIcon}>Test</LinkButton>
}

function OutlineVariant() {
  return <LinkButton variant="invisible">Test</LinkButton>
}
