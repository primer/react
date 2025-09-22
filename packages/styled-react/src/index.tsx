import {
  type BetterSystemStyleObject,
  Box,
  type BoxProps,
  type SxProp,
  Checkbox as PrimerCheckbox,
  type CheckboxProps as PrimerCheckboxProps,
  CounterLabel as PrimerCounterLabel,
  type CounterLabelProps as PrimerCounterLabelProps,
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
import React, {type PropsWithChildren, forwardRef} from 'react'
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
import type {ForwardRefComponent} from './polymorphic'
import {LinkButton, type LinkButtonProps} from './components/LinkButton'
import {FormControl, type FormControlProps} from './components/FormControl'

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

type CheckboxProps = PrimerCheckboxProps & SxProp

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <Box as={PrimerCheckbox} ref={ref} {...props} />
})

type CounterLabelProps = PrimerCounterLabelProps & SxProp

const CounterLabel = forwardRef<HTMLSpanElement, CounterLabelProps>(function CounterLabel(props, ref) {
  return <Box as={PrimerCounterLabel} ref={ref} {...props} />
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

type UnderlineNavItemProps = PrimerUnderlineNavItemProps & SxProp

const UnderlineNavItem: ForwardRefComponent<'a', UnderlineNavItemProps> = styled(
  PrimerUnderlineNav.Item,
).withConfig<UnderlineNavItemProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const UnderlineNav = Object.assign(UnderlineNavImpl, {
  Item: UnderlineNavItem,
})

export {
  FormControl,
  type FormControlProps,
  LinkButton,
  type LinkButtonProps,
  Checkbox,
  CounterLabel,
  SegmentedControl,
  StateLabel,
  SubNav,
  ToggleSwitch,
  UnderlineNav,
}

export {
  ActionList,
  ActionMenu,
  Autocomplete,
  Avatar,
  Breadcrumbs,
  Button,
  CheckboxGroup,
  CircleBadge,
  Details,
  Dialog,
  Flash,
  Header,
  Heading,
  IconButton,
  Label,
  Link,
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
  type TextInputProps,
  Timeline,
  Token,
  type TokenProps,
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
