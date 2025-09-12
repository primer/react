import type React from 'react'
import {forwardRef, type PropsWithChildren} from 'react'
import {
  type BetterSystemStyleObject,
  Box,
  type BoxProps,
  StateLabel as PrimerStateLabel,
  type StateLabelProps as PrimerStateLabelProps,
  SubNav as PrimerSubNav,
  type SubNavProps as PrimerSubNavProps,
  type SubNavLinkProps as PrimerSubNavLinkProps,
  Textarea as PrimerTextarea,
  type TextareaProps as PrimerTextareaProps,
  ToggleSwitch as PrimerToggleSwitch,
  type ToggleSwitchProps as PrimerToggleSwitchProps,
  Link as PrimerLink,
  type LinkProps as PrimerLinkProps,
  Heading as PrimerHeading,
  type HeadingProps as PrimerHeadingProps,
  Checkbox as PrimerCheckbox,
  type CheckboxProps as PrimerCheckboxProps,
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
import {type SxProp} from './sx'
import {PageHeader} from './components/PageHeader'
import {PageLayout} from './components/PageLayout'
import {NavList} from './components/NavList'
import {UnderlineNav} from './components/UnderlineNav'
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

type LinkProps = PrimerLinkProps & SxProp

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  return <Box as={PrimerLink} ref={ref} {...props} />
})

type HeadingProps = PrimerHeadingProps & SxProp

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(props, ref) {
  return <Box as={PrimerHeading} ref={ref} {...props} />
})

type CheckboxProps = PrimerCheckboxProps & SxProp

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(props, ref) {
  return <Box as={PrimerCheckbox} ref={ref} {...props} />
})

export {
  Autocomplete,
  Checkbox,
  Heading,
  Link,
  NavList,
  PageHeader,
  PageLayout,
  SegmentedControl,
  Select,
  StateLabel,
  SubNav,
  Textarea,
  TextInput,
  ToggleSwitch,
  UnderlineNav,
}
type TextareaProps = PropsWithChildren<PrimerTextareaProps> & SxProp

// Type annotation needed because TextInput uses `FormValidationStatus` internal type
const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>> = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function Textarea(props, ref) {
  return <Box as={PrimerTextarea} ref={ref} {...props} />
})

export {
  ActionList,
  ActionMenu,
  Avatar,
  Breadcrumbs,
  Button,
  CheckboxGroup,
  CircleBadge,
  CounterLabel,
  Details,
  Dialog,
  Flash,
  FormControl,
  Header,
  IconButton,
  Label,
  LinkButton,
  Overlay,
  Popover,
  ProgressBar,
  RadioGroup,
  RelativeTime,
  Spinner,
  Text,
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
