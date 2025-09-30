import {Box, ActionMenu as PrimerActionMenu, type SxProp} from '@primer/react'
import {sx} from '../sx'
import styled from 'styled-components'
import {forwardRef, type ComponentProps} from 'react'
import type {ForwardRefComponent} from '../polymorphic'

type ActionMenuOverlayProps = ComponentProps<typeof PrimerActionMenu.Overlay> & SxProp

const ActionMenuOverlay: React.ComponentType<ActionMenuOverlayProps> = styled(PrimerActionMenu.Overlay).withConfig({
  shouldForwardProp: prop => (prop as keyof ActionMenuOverlayProps) !== 'sx',
})`
  ${sx}
`

export type ActionMenuButtonProps = ComponentProps<typeof PrimerActionMenu.Button> & SxProp

const StyledActionMenuButton = forwardRef<HTMLButtonElement, ActionMenuButtonProps>((props, ref) => {
  return <Box as={PrimerActionMenu.Button} ref={ref} {...props} />
})

const ActionMenuButton = forwardRef(({as, ...props}: ActionMenuButtonProps, ref) => (
  <StyledActionMenuButton {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'button', ActionMenuButtonProps>

export const ActionMenu: typeof PrimerActionMenu & {
  Button: typeof PrimerActionMenu.Button
  Anchor: typeof PrimerActionMenu.Anchor
  Overlay: typeof ActionMenuOverlay
  Divider: typeof PrimerActionMenu.Divider
} = Object.assign(PrimerActionMenu, {
  Button: ActionMenuButton,
  Anchor: PrimerActionMenu.Anchor,
  Overlay: ActionMenuOverlay,
  Divider: PrimerActionMenu.Divider,
})
