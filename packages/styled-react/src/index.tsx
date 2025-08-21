import {Box, type BoxProps, Label as PrimerLabel, type LabelProps as PrimerLabelProps, type SxProp} from '@primer/react'
import {forwardRef} from 'react'
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
import type {ForwardRefComponent} from './polymorphic'

type StyledProps = SxProp &
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

const Label = forwardRef(function Label(props, ref) {
  return <Box as={PrimerLabel} ref={ref} {...props} />
}) as ForwardRefComponent<'span', PrimerLabelProps & Omit<StyledProps, keyof PrimerLabelProps>>

export {Label}
export {
  ActionList,
  ActionMenu,
  Box,
  type BoxProps,
  Breadcrumbs,
  Button,
  Flash,
  FormControl,
  Heading,
  IconButton,
  Link,
  LinkButton,
  PageLayout,
  Text,
  TextInput,
  Truncate,

  // Utilities for working with the `sx` prop
  sx,
  type SxProp,
  type BetterSystemStyleObject,
} from '@primer/react'
