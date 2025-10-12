import styled from 'styled-components'
import type {
  BackgroundProps,
  BorderProps,
  ColorProps,
  FlexboxProps,
  GridProps,
  LayoutProps,
  PositionProps,
  ShadowProps,
  SpaceProps,
  TypographyProps,
} from 'styled-system'
import {background, border, color, flexbox, grid, layout, position, shadow, space, typography} from 'styled-system'
import {sx, type SxProp} from '../../sx'
import type {ComponentProps} from '../../utils/ComponentProps'

type StyledBoxProps = SxProp &
  SpaceProps &
  ColorProps &
  TypographyProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  BackgroundProps &
  BorderProps &
  PositionProps &
  ShadowProps

/**
 * @deprecated The Box component is deprecated. Replace with a `div` or
 * appropriate HTML element instead, with CSS modules for styling.
 * @see https://github.com/primer/react/blob/main/contributor-docs/migration-from-box.md
 */
const Box = styled.div<StyledBoxProps>(
  space,
  color,
  typography,
  layout,
  flexbox,
  grid,
  background,
  border,
  position,
  shadow,
  sx,
)

/**
 * @deprecated The Box component is deprecated. Replace with a `div` or
 * appropriate HTML element instead, with CSS modules for styling.
 * @see https://github.com/primer/react/blob/main/contributor-docs/migration-from-box.md
 */
export type BoxProps = ComponentProps<typeof Box>
export {Box}
export default Box
