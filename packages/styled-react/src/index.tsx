export {ActionList} from '@primer/react'
export {ActionMenu} from '@primer/react'
export {Autocomplete} from '@primer/react'
export {Avatar} from '@primer/react'
export {Breadcrumbs} from '@primer/react'
export {Box, type BoxProps} from './components/Box'
export {Button} from '@primer/react'
export {CheckboxGroup} from '@primer/react'
export {CircleBadge} from '@primer/react'
export {Details} from '@primer/react'
export {Dialog} from '@primer/react'
export {FormControl} from '@primer/react'
export {Heading} from '@primer/react'
export {IconButton} from '@primer/react'
export {Label} from '@primer/react'
export {Link} from '@primer/react'
export {NavList} from '@primer/react'
export {Overlay} from '@primer/react'
export {PageLayout} from '@primer/react'
export {ProgressBar} from '@primer/react'

export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedControlButtonProps,
  type SegmentedControlIconButtonProps,
} from './components/SegmentedControl'
export {Select} from '@primer/react'
export {Spinner} from '@primer/react'
export {StateLabel, type StateLabelProps} from './components/StateLabel'
export {SubNav, type SubNavProps, type SubNavLinkProps} from './components/SubNav'
export {Text} from '@primer/react'
export {Textarea} from '@primer/react'
export {TextInput} from '@primer/react'
export {Timeline} from '@primer/react'
export {ToggleSwitch, type ToggleSwitchProps} from './components/ToggleSwitch'
export {Token} from '@primer/react'
export {Tooltip} from '@primer/react'

// theming depends on styled-components
export {ThemeProvider} from '@primer/react'
export {merge} from '@primer/react'
export {theme} from '@primer/react'
export {themeGet} from '@primer/react'
export {useColorSchemeVar} from '@primer/react'
export {useTheme} from '@primer/react'
export {type TextInputProps} from '@primer/react'
export {type TokenProps} from '@primer/react'

export {sx, type SxProp} from './sx'

export type {BetterSystemStyleObject} from './styled-props'

import {
  Box,
  type SxProp,
  RadioGroup as PrimerRadioGroup,
  type RadioGroupProps as PrimerRadioGroupProps,
  Checkbox as PrimerCheckbox,
  type CheckboxProps as PrimerCheckboxProps,
  CounterLabel as PrimerCounterLabel,
  type CounterLabelProps as PrimerCounterLabelProps,
  StateLabel as PrimerStateLabel,
  type StateLabelProps as PrimerStateLabelProps,
  SubNav as PrimerSubNav,
  type RelativeTimeProps as PrimerRelativeTimeProps,
  RelativeTime as PrimerRelativeTime,
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
  UnderlineNav as PrimerUnderlineNav,
  type UnderlineNavProps as PrimerUnderlineNavProps,
  type UnderlineNavItemProps as PrimerUnderlineNavItemProps,
  sx,
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
import styled from 'styled-components'

import {LinkButton, type LinkButtonProps} from './components/LinkButton'

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

type RelativeTimeProps = PrimerRelativeTimeProps & SxProp

function RelativeTime(props: RelativeTimeProps) {
  // @ts-expect-error the types for Box are not correctly inferred here
  return <Box as={PrimerRelativeTime} {...props} />
}

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

export {
  PageHeader,
  type PageHeaderProps,
  type PageHeaderActionsProps,
  type PageHeaderTitleProps,
} from './components/PageHeader'

type TruncateProps = PropsWithChildren<PrimerTruncateProps> & SxProp

const Truncate: ForwardRefComponent<'div', TruncateProps> = styled(PrimerTruncate).withConfig<TruncateProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

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

export {Header, type HeaderProps} from './components/Header'

export {Flash} from './components/Flash'

export {Checkbox, CounterLabel, LinkButton, type LinkButtonProps, RadioGroup, RelativeTime, Truncate, UnderlineNav}
