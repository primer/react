import {LinkButton} from '@primer/react'
import {TrashIcon} from '@primer/octicons-react'

function LeadingVisual() {
  return <LinkButton leadingIcon={TrashIcon}>Test</LinkButton>
}

function TrailingVisual() {
  return <LinkButton trailingIcon={TrashIcon}>Test</LinkButton>
}

function OutlineVariant() {
  return <LinkButton variant="outline">Test</LinkButton>
}
