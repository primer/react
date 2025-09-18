import {
  type BetterSystemStyleObject,
  Box,
  type BoxProps,
  type SxProp,
  StateLabel as PrimerStateLabel,
  type StateLabelProps as PrimerStateLabelProps,
  SubNav as PrimerSubNav,
  type SubNavProps as PrimerSubNavProps,
  type SubNavLinkProps as PrimerSubNavLinkProps,
  ToggleSwitch as PrimerToggleSwitch,
  type ToggleSwitchProps as PrimerToggleSwitchProps,
  type SegmentedControlProps as PrimerSegmentedControlProps,
  SegmentedControl as PrimerSegmentedControl,
  type SegmentedControlButtonProps as PrimerSegmentedControlButtonProps,
  type SegmentedControlIconButtonProps as PrimerSegmentedControlIconButtonProps,
  UnderlineNav as PrimerUnderlineNav,
  type UnderlineNavProps as PrimerUnderlineNavProps,
  type UnderlineNavItemProps as PrimerUnderlineNavItemProps,
  sx,
} from '@primer/react'
import React, {type PropsWithChildren, forwardRef, type RefAttributes, type ForwardRefExoticComponent} from 'react'
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
import styled from 'styled-components'

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

type SegmentedControlProps = PropsWithChildren<PrimerSegmentedControlProps> & SxProp
type SegmentedControlButtonProps = PropsWithChildren<PrimerSegmentedControlButtonProps> & SxProp
type SegmentedControlIconButtonProps = PropsWithChildren<PrimerSegmentedControlIconButtonProps> & SxProp

const SegmentedControlButton = (props: SegmentedControlButtonProps) => {
  return <Box as={PrimerSegmentedControl.Button} {...props} />
}

const SegmentedControlIconButton = (props: SegmentedControlIconButtonProps) => {
  return <Box as={PrimerSegmentedControl.IconButton} {...props} />
}

const SegmentedControlImpl = (props: SegmentedControlProps) => {
  return <Box as={PrimerSegmentedControl} {...props} />
}

const SegmentedControl = Object.assign(SegmentedControlImpl, {
  Button: SegmentedControlButton,
  IconButton: SegmentedControlIconButton,
})

type StateLabelProps = PrimerStateLabelProps & SxProp

const StateLabel = forwardRef<HTMLSpanElement, StateLabelProps>(function StateLabel(props, ref) {
  return <Box as={PrimerStateLabel} ref={ref} {...props} />
})

type SubNavProps = PrimerSubNavProps & SxProp

const SubNavImpl = forwardRef<HTMLElement, SubNavProps>(function SubNav(props, ref) {
  return <Box as={PrimerSubNav} ref={ref} {...props} />
})

type SubNavLinkProps = PrimerSubNavLinkProps & SxProp

const SubNavLink = forwardRef<HTMLAnchorElement, SubNavLinkProps>(function SubNavLink(props, ref) {
  return <Box as={PrimerSubNav.Link} ref={ref} {...props} />
})

const SubNav = Object.assign(SubNavImpl, {
  Link: SubNavLink,
})

type ToggleSwitchProps = PrimerToggleSwitchProps & Omit<StyledProps, keyof PrimerToggleSwitchProps>

const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(function ToggleSwitch(props, ref) {
  return <Box as={PrimerToggleSwitch} ref={ref} {...props} />
})

type UnderlineNavProps = PrimerUnderlineNavProps & SxProp

const UnderlineNavImpl = forwardRef<HTMLElement, UnderlineNavProps>(function UnderlineNav(props, ref) {
  return <Box as={PrimerUnderlineNav} ref={ref} {...props} />
})

type UnderlineNavItemProps = PrimerUnderlineNavItemProps &
  SxProp & {
    /**
     * ID attribute for the element
     */
    id?: string
  }

const UnderlineNavItem: ForwardRefExoticComponent<UnderlineNavItemProps & RefAttributes<HTMLElement>> = styled(
  PrimerUnderlineNav.Item,
).withConfig<UnderlineNavItemProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const UnderlineNav: typeof UnderlineNavImpl & {
  Item: typeof UnderlineNavItem
} = Object.assign(UnderlineNavImpl, {
  Item: UnderlineNavItem,
})

export {SegmentedControl, StateLabel, SubNav, ToggleSwitch, UnderlineNav}

export {
  ActionList,
  ActionMenu,
  Autocomplete,
  Avatar,
  Breadcrumbs,
  Button,
  Checkbox,
  CheckboxGroup,
  CircleBadge,
  CounterLabel,
  Details,
  Dialog,
  Flash,
  FormControl,
  Header,
  Heading,
  IconButton,
  Label,
  Link,
  LinkButton,
  NavList,
  Overlay,
  PageHeader,
  PageLayout,
  ProgressBar,
  RadioGroup,
  RelativeTime,
  Select,
  Spinner,
  Text,
  Textarea,
  TextInput,
  Timeline,
  Token,
  Tooltip,
  Truncate,

  // styled-components components or types
  Box,
  sx,

  // theming depends on styled-components
  ThemeProvider,
  merge,
  theme,
  themeGet,
  useColorSchemeVar,
  useTheme,
} from '@primer/react'
export type {BoxProps, SxProp, BetterSystemStyleObject}
