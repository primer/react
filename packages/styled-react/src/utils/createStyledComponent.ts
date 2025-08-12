import {sx} from '@primer/react'
import type {SxProp} from '@primer/react'
import type React from 'react'
import styled from 'styled-components'
import {background, border, color, flexbox, grid, layout, position, shadow, space, typography} from 'styled-system'
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

export function createStyledComponent<P>(Component: React.ComponentType<P>) {
  return styled(Component)<StyledBoxProps>(
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
}
