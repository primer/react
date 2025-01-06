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
import type {BetterSystemStyleObject} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

type StyledBoxProps = {
  sx?: BetterSystemStyleObject
} & SpaceProps &
  ColorProps &
  TypographyProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  BackgroundProps &
  BorderProps &
  PositionProps &
  ShadowProps

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

export type BoxProps = ComponentProps<typeof Box>
export default Box
