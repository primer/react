import {ActionMenu} from '..'
import {SearchIcon} from '@primer/octicons-react'

export function actionButtonWithoutProps() {
  return <ActionMenu.Button />
}

export function actionButtonWithChildren() {
  return <ActionMenu.Button>Click me!</ActionMenu.Button>
}

export function actionButtonWithOptionalProps() {
  return <ActionMenu.Button size="small">Click me!</ActionMenu.Button>
}

export function actionButtonWithInvalidSize() {
  //@ts-expect-error size must be one of the valid values
  return <ActionMenu.Button size="some-unknownsize">Click me!</ActionMenu.Button>
}

export function actionIconButtonWithRequiredProps() {
  return <ActionMenu.IconButton icon={SearchIcon} aria-label="Search" />
}

export function actionIconButtonWithOptionalProps() {
  return <ActionMenu.IconButton icon={SearchIcon} aria-label="Search" size="small" />
}

export function actionIconButtonWithInvalidSize() {
  //@ts-expect-error size must be one of the valid values
  return <ActionMenu.IconButton icon={SearchIcon} aria-label="Search" size="some-unknownsize" />
}
