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
  ToggleSwitch as PrimerToggleSwitch,
  type ToggleSwitchProps as PrimerToggleSwitchProps,
  Truncate as PrimerTruncate,
  type TruncateProps as PrimerTruncateProps,
  type SegmentedControlProps as PrimerSegmentedControlProps,
  SegmentedControl as PrimerSegmentedControl,
  type SegmentedControlButtonProps as PrimerSegmentedControlButtonProps,
  type SegmentedControlIconButtonProps as PrimerSegmentedControlIconButtonProps,
} from '@primer/react'
import React, {forwardRef, type PropsWithChildren} from 'react'
import type {ForwardRefComponent} from './polymorphic'
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

const RadioGroupImpl = (props: RadioGroupProps) => {
  return <Box as={PrimerRadioGroup} {...props} />
}

// Define local types based on the internal component props
type CheckboxOrRadioGroupLabelProps = PropsWithChildren<
  {
    className?: string
    visuallyHidden?: boolean
  } & SxProp
>
const CheckboxOrRadioGroupLabel = (props: CheckboxOrRadioGroupLabelProps) => {
  return <Box as={PrimerRadioGroup.Label} {...props} />
}

type CheckboxOrRadioGroupCaptionProps = PropsWithChildren<
  {
    className?: string
  } & SxProp
>
const CheckboxOrRadioGroupCaption = (props: CheckboxOrRadioGroupCaptionProps) => {
  return <Box as={PrimerRadioGroup.Caption} {...props} />
}

type CheckboxOrRadioGroupValidationProps = PropsWithChildren<
  {
    className?: string
    variant: 'error' | 'success'
  } & SxProp
>
const CheckboxOrRadioGroupValidation = (props: CheckboxOrRadioGroupValidationProps) => {
  return <Box as={PrimerRadioGroup.Validation} {...props} />
}

const RadioGroup = Object.assign(RadioGroupImpl, {
  Label: CheckboxOrRadioGroupLabel,
  Caption: CheckboxOrRadioGroupCaption,
  Validation: CheckboxOrRadioGroupValidation,
})

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

type TruncateProps = PropsWithChildren<PrimerTruncateProps> & SxProp

const Truncate = forwardRef<HTMLDivElement, TruncateProps>(function Truncate(props, ref) {
  // @ts-ignore - PrimerTruncate is polymorphic and functionally compatible with Box's as prop
  return <Box as={PrimerTruncate} ref={ref} {...props} />
}) as ForwardRefComponent<'div', TruncateProps>

export {RadioGroup, SegmentedControl, StateLabel, SubNav, ToggleSwitch, Truncate}

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
  RelativeTime,
  Select,
  Spinner,
  Text,
  Textarea,
  TextInput,
  Timeline,
  Token,
  Tooltip,
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
