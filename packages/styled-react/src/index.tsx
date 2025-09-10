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
  Timeline as PrimerTimeline,
  type TimelineProps as PrimerTimelineProps,
  type TimelineItemProps as PrimerTimelineItemProps,
  type TimelineBadgeProps as PrimerTimelineBadgeProps,
  type TimelineBodyProps as PrimerTimelineBodyProps,
  type TimelineBreakProps as PrimerTimelineBreakProps,
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

type TimelineProps = PrimerTimelineProps & SxProp
type TimelineItemProps = PrimerTimelineItemProps & SxProp
type TimelineBadgeProps = PrimerTimelineBadgeProps & SxProp
type TimelineBodyProps = PrimerTimelineBodyProps & SxProp
type TimelineBreakProps = PrimerTimelineBreakProps & SxProp

const TimelineImpl = forwardRef<HTMLDivElement, TimelineProps>(function Timeline(props, ref) {
  return <Box as={PrimerTimeline} ref={ref} {...props} />
})

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(function TimelineItem(props, ref) {
  return <Box as={PrimerTimeline.Item} ref={ref} {...props} />
})

function TimelineBadge(props: TimelineBadgeProps) {
  return <Box as={PrimerTimeline.Badge} {...props} />
}

const TimelineBody = forwardRef<HTMLDivElement, TimelineBodyProps>(function TimelineBody(props, ref) {
  return <Box as={PrimerTimeline.Body} ref={ref} {...props} />
})

const TimelineBreak = forwardRef<HTMLDivElement, TimelineBreakProps>(function TimelineBreak(props, ref) {
  return <Box as={PrimerTimeline.Break} ref={ref} {...props} />
})

const Timeline = Object.assign(TimelineImpl, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
})

type ToggleSwitchProps = PrimerToggleSwitchProps & Omit<StyledProps, keyof PrimerToggleSwitchProps>

const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(function ToggleSwitch(props, ref) {
  return <Box as={PrimerToggleSwitch} ref={ref} {...props} />
})

export {StateLabel, SubNav, Timeline, ToggleSwitch}

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
