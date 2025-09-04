import {
  Box,
  Label as PrimerLabel,
  type LabelProps as PrimerLabelProps,
  ToggleSwitch as PrimerToggleSwitch,
  type ToggleSwitchProps as PrimerToggleSwitchProps,
  type SxProp,
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

const Label = forwardRef(function Label(props, ref) {
  // @ts-expect-error there is an issue with polymorphic `as` with this
  // component
  return <Box as={PrimerLabel} ref={ref} {...props} />
}) as ForwardRefComponent<'span', PrimerLabelProps & Omit<StyledProps, keyof PrimerLabelProps>>

const ToggleSwitch = forwardRef(function ToggleSwitch(props, ref) {
  // @ts-expect-error there is an issue with polymorphic `as` with this
  // component
  return <Box as={PrimerToggleSwitch} ref={ref} {...props} />
}) as ForwardRefComponent<'span', PrimerToggleSwitchProps & Omit<StyledProps, keyof PrimerToggleSwitchProps>>

export {Label, ToggleSwitch}

export {
  ActionList,
  ActionMenu,
  Autocomplete,
  Avatar,
  BranchName,
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
  LabelGroup,
  Link,
  LinkButton,
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
  SelectPanel,
  SideNav,
  Spinner,
  Stack,
  StateLabel,
  SubNav,
  Text,
  Textarea,
  TextInput,
  TextInputWithTokens,
  Timeline,
  Token,
  Tooltip,
  Truncate,
  UnderlineNav,

  // styled-components components or types
  Box,
  type BoxProps,
  sx,
  type SxProp,
  type BetterSystemStyleObject,

  // theming depends on styled-components
  ThemeProvider,
  merge,
  theme,
  themeGet,
  useColorSchemeVar,
  useTheme,
} from '@primer/react'

// import {
// Box,
// Label as PrimerLabel,
// type LabelProps as PrimerLabelProps,
// type SxProp,
// ToggleSwitch as PrimerToggleSwitch,
// type ToggleSwitchProps as PrimerToggleSwitchProps,
// } from '@primer/react'

// const ToggleSwitch = forwardRef(function ToggleSwitch(props, ref) {
// // @ts-expect-error there is an issue with polymorphic `as` with this
// // component
// return <Box as={PrimerToggleSwitch} ref={ref} {...props} />
// }) as ForwardRefComponent<'div', PrimerToggleSwitchProps & Omit<StyledProps, keyof PrimerToggleSwitchProps>>

// export {Label, ToggleSwitch}
// export {
// ActionList,
// ActionMenu,
// Box,
// type BoxProps,
// Breadcrumbs,
// Button,
// Flash,
// FormControl,
// Heading,
// IconButton,
// Link,
// LinkButton,
// PageLayout,
// Text,
// TextInput,
// Truncate,

// // Utilities for working with the `sx` prop
// sx,
// type SxProp,
// type BetterSystemStyleObject,

// // theming depends on styled-components
// ThemeProvider,
// merge,
// theme,
// themeGet,
// useColorSchemeVar,
// useTheme,
// } from '@primer/react'
