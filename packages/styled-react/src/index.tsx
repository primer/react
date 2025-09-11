import {
  type BetterSystemStyleObject,
  Box,
  type BoxProps,
  type SxProp,
  type ButtonProps as PrimerButtonProps,
  Button as PrimerButton,
  type IconButtonProps as PrimerIconButtonProps,
  IconButton as PrimerIconButton,
  type LinkButtonProps as PrimerLinkButtonProps,
  LinkButton as PrimerLinkButton,
  StateLabel as PrimerStateLabel,
  type StateLabelProps as PrimerStateLabelProps,
  SubNav as PrimerSubNav,
  type SubNavProps as PrimerSubNavProps,
  type SubNavLinkProps as PrimerSubNavLinkProps,
  ToggleSwitch as PrimerToggleSwitch,
  type ToggleSwitchProps as PrimerToggleSwitchProps,
} from '@primer/react'
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

type ButtonProps = PrimerButtonProps & SxProp

const Button = forwardRef(function Button(props, ref) {
  return <Box as={PrimerButton} ref={ref} {...props} />
}) as ForwardRefComponent<'button', ButtonProps>

type IconButtonProps = PrimerIconButtonProps & SxProp

const IconButton = forwardRef(function IconButton(props, ref) {
  // @ts-expect-error the `Box` component does not infer the types correctly
  // here
  return <Box as={PrimerIconButton} ref={ref} {...props} />
}) as ForwardRefComponent<'button' | 'a', IconButtonProps>

type LinkButtonProps = PrimerLinkButtonProps & SxProp

const LinkButton = forwardRef(function LinkButton(props, ref) {
  return <Box as={PrimerLinkButton} ref={ref} {...props} />
}) as ForwardRefComponent<'button', LinkButtonProps>

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

export {Button, IconButton, LinkButton, StateLabel, SubNav, ToggleSwitch}

export {
  ActionList,
  ActionMenu,
  Autocomplete,
  Avatar,
  Breadcrumbs,
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
  Label,
  Link,
  NavList,
  Overlay,
  PageHeader,
  PageLayout,
  Popover,
  ProgressBar,
  RadioGroup,
  RelativeTime,
  SegmentedControl,
  Select,
  Spinner,
  Text,
  Textarea,
  TextInput,
  Timeline,
  Token,
  Tooltip,
  Truncate,
  UnderlineNav,

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
