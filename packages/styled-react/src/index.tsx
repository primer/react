import type React from 'react'
import {forwardRef, type PropsWithChildren} from 'react'
import {
  type BetterSystemStyleObject,
  Box,
  type BoxProps,
  type SxProp,
  RadioGroup as PrimerRadioGroup,
  type RadioGroupProps as PrimerRadioGroupProps,
  StateLabel as PrimerStateLabel,
  type StateLabelProps as PrimerStateLabelProps,
  SubNav as PrimerSubNav,
  type SubNavProps as PrimerSubNavProps,
  type SubNavLinkProps as PrimerSubNavLinkProps,
  Textarea as PrimerTextarea,
  type TextareaProps as PrimerTextareaProps,
  ToggleSwitch as PrimerToggleSwitch,
  type ToggleSwitchProps as PrimerToggleSwitchProps,
  Truncate as PrimerTruncate,
  type TruncateProps as PrimerTruncateProps,
  type SegmentedControlProps as PrimerSegmentedControlProps,
  SegmentedControl as PrimerSegmentedControl,
  type SegmentedControlButtonProps as PrimerSegmentedControlButtonProps,
  type SegmentedControlIconButtonProps as PrimerSegmentedControlIconButtonProps,
} from '@primer/react'
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
import {Autocomplete} from './components/Autocomplete'
import {Select} from './components/Select'
import {TextInput} from './components/TextInput'

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

type RadioGroupProps = PropsWithChildren<PrimerRadioGroupProps> & SxProp

const RadioGroup = (props: RadioGroupProps) => {
  return <Box as={PrimerRadioGroup} {...props} />
}

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

type TextareaProps = PropsWithChildren<PrimerTextareaProps> & SxProp

// Type annotation needed because TextInput uses `FormValidationStatus` internal type
const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>> = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function Textarea(props, ref) {
  return <Box as={PrimerTextarea} ref={ref} {...props} />
})

type TruncateProps = PropsWithChildren<PrimerTruncateProps> & SxProp

const Truncate = forwardRef<HTMLDivElement, TruncateProps>(function Truncate(props, ref) {
  return <Box as={PrimerTruncate} ref={ref} {...props} />
})

export {Autocomplete, SegmentedControl, Select, StateLabel, SubNav, TextInput, Textarea, ToggleSwitch}

export {
  ActionList,
  ActionMenu,
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
  Spinner,
  Text,
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
