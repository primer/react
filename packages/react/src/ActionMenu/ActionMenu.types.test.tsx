import {ActionMenu} from '.'
import {ActionMenu as ExperimentalActionMenu, Tooltip} from '../experimental/TriggerComposition/TriggerComposition'
import {Button} from '../Button'

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

export function actionOverlayWithPreventFocusOnClose() {
  return <ActionMenu.Overlay preventFocusOnClose>Menu contents</ActionMenu.Overlay>
}

export function actionOverlayWithInvalidPreventFocusOnClose() {
  // @ts-expect-error preventFocusOnClose must be a boolean
  return <ActionMenu.Overlay preventFocusOnClose="true">Menu contents</ActionMenu.Overlay>
}

export function actionMenuWithComposedTrigger() {
  const ActionMenu = ExperimentalActionMenu
  return (
    <ActionMenu
      renderAnchor={({ref, ...menuProps}) => (
        <Tooltip
          ref={ref}
          text="Additional context"
          renderAnchor={tooltipProps => (
            <Button {...menuProps} {...tooltipProps}>
              Actions
            </Button>
          )}
        />
      )}
    >
      <ActionMenu.Overlay>Menu contents</ActionMenu.Overlay>
    </ActionMenu>
  )
}
