declare module '@primer/components' {
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
  import * as StyledSystem from 'styled-system'
  import * as StyledComponents from 'styled-components'
  import * as History from 'history'

  export interface BaseProps extends React.Props<any> {
    as?: React.ReactType
    title?: string
    // NOTE(@mxstbr): Necessary workaround to make <Component as={Link} to="/bla" /> work
    to?: History.LocationDescriptor
  }

  interface CommonProps extends BaseProps, StyledSystem.ColorProps, StyledSystem.SpaceProps {}

  interface LayoutProps extends BaseProps, StyledSystem.LayoutProps {}

  interface TypographyProps extends BaseProps, StyledSystem.TypographyProps {
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
  }

  interface BorderProps
    extends BaseProps,
      StyledSystem.BordersProps,
      StyledSystem.BorderColorProps,
      StyledSystem.BoxShadowProps,
      StyledSystem.BorderRadiusProps {}

  interface PositionProps
    extends BaseProps,
      StyledSystem.PositionProps,
      StyledSystem.ZIndexProps,
      StyledSystem.TopProps,
      StyledSystem.RightProps,
      StyledSystem.BottomProps,
      StyledSystem.LeftProps {}

  interface FlexItemProps
    extends BaseProps,
      CommonProps,
      LayoutProps,
      StyledSystem.FlexProps,
      StyledSystem.JustifySelfProps,
      StyledSystem.AlignSelfProps,
      StyledSystem.OrderProps {}

  interface FlexProps extends BaseProps, CommonProps, LayoutProps, StyledSystem.FlexboxProps, BoxProps {}

  export const Flex: React.FunctionComponent<FlexProps> & {
    Item: React.FunctionComponent<FlexItemProps>
  }

  export interface BoxProps
    extends BaseProps,
      CommonProps,
      LayoutProps,
      Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export const Box: React.FunctionComponent<BoxProps>

  export interface TextProps
    extends BaseProps,
      CommonProps,
      TypographyProps,
      Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {}

  export const Text: React.FunctionComponent<TextProps>

  export interface HeadingProps
    extends BaseProps,
      CommonProps,
      TypographyProps,
      Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'> {}

  export const Heading: React.FunctionComponent<HeadingProps>

  type DetailsRenderFunction = (args: {open: boolean}) => React.ReactElement

  export interface DetailsProps extends CommonProps, Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, 'color'> {
    render?: DetailsRenderFunction
    children?: DetailsRenderFunction | React.ReactNode
    defaultOpen?: boolean
    overlay?: boolean
  }

  export const Details: React.FunctionComponent<DetailsProps>

  export interface ButtonProps
    extends BaseProps,
      CommonProps,
      StyledSystem.FontSizeProps,
      Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    variant?: 'small' | 'medium' | 'large'
  }

  export const ButtonPrimary: React.FunctionComponent<ButtonProps>
  export const ButtonOutline: React.FunctionComponent<ButtonProps>
  export const ButtonDanger: React.FunctionComponent<ButtonProps>
  export const ButtonGroup: React.FunctionComponent<BoxProps>
  export const Button: React.FunctionComponent<ButtonProps>

  export interface AvatarProps extends CommonProps, Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'color'> {
    isChild?: boolean
    size?: number
  }

  export const Avatar: React.FunctionComponent<AvatarProps>

  export interface BaseStylesProps extends TypographyProps, CommonProps {}

  export const BaseStyles: React.FunctionComponent<BaseStylesProps>

  export interface BorderBoxProps extends CommonProps, LayoutProps, BorderProps, BoxProps {
    border?: string
    borderColor?: string
    borderRadius?: string | number
    boxShadow?: string
  }

  export const BorderBox: React.FunctionComponent<BorderBoxProps>

  export interface BranchNameProps extends CommonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {}

  export const BranchName: React.FunctionComponent<BranchNameProps>

  export interface CircleBadgeProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    inline?: boolean
    size?: number
    variant?: 'small' | 'medium' | 'large'
  }

  export const CircleBadge: React.FunctionComponent<CircleBadgeProps>

  export interface CircleOcticonProps extends CommonProps, FlexProps {
    size?: number
    icon: React.ReactNode
  }

  export const CircleOcticon: React.FunctionComponent<CircleOcticonProps>

  export interface StyledOcticonProps extends CommonProps {
    size?: number
    icon: React.ReactNode
  }

  export const StyledOcticon: React.FunctionComponent<StyledOcticonProps>

  export interface DropdownProps extends CommonProps, ButtonProps {}

  export interface DropdownMenuProps extends CommonProps, Omit<React.HTMLAttributes<HTMLUListElement>, 'color'> {
    direction?: string
    title: string | React.ReactNode
  }

  export const Dropdown: React.FunctionComponent<DropdownProps> & {
    Menu: React.FunctionComponent<DropdownMenuProps>
    Item: React.FunctionComponent<DropdownProps>
  }

  export interface FilteredSearchProps extends CommonProps {
    // just children
  }

  export const FilteredSearch: React.FunctionComponent<FilteredSearchProps>

  export interface FilterListProps extends CommonProps, Omit<React.HTMLAttributes<HTMLUListElement>, 'color'> {
    small?: boolean
  }

  export interface FilterListItemProps
    extends CommonProps,
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    count?: number
    selected?: boolean
  }

  export const FilterList: React.FunctionComponent<FilterListProps> & {
    Item: React.FunctionComponent<FilterListItemProps>
  }

  export interface FlashProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    full?: boolean
    scheme?: string
  }

  export const Flash: React.FunctionComponent<FlashProps>

  export interface CounterLabelProps extends CommonProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
    scheme?: string
  }

  export const CounterLabel: React.FunctionComponent<CounterLabelProps>

  export interface LabelProps extends CommonProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
    outline?: boolean
    variant?: 'small' | 'medium' | 'large' | 'xl'
    dropshadow?: boolean
  }

  export const Label: React.FunctionComponent<LabelProps>

  export interface LinkProps
    extends CommonProps,
      TypographyProps,
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    muted?: boolean
    underline?: boolean
  }

  export const Link: React.FunctionComponent<LinkProps>

  export interface PointerBoxProps extends CommonProps, LayoutProps, BorderBoxProps {
    caret?: string
  }

  export const PointerBox: React.FunctionComponent<PointerBoxProps>

  export interface PositionComponentProps
    extends PositionProps,
      CommonProps,
      LayoutProps,
      Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export const Relative: React.FunctionComponent<PositionComponentProps>
  export const Absolute: React.FunctionComponent<PositionComponentProps>
  export const Sticky: React.FunctionComponent<PositionComponentProps>
  export const Fixed: React.FunctionComponent<PositionComponentProps>

  export interface SideNavProps extends CommonProps, BorderProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    bordered?: boolean
    variant?: 'normal' | 'lightweight'
  }

  export interface SideNavLinkProps extends CommonProps, TypographyProps, LinkProps, Omit<React.HTMLAttributes<HTMLAnchorElement>, 'color'> {
    variant?: 'normal' | 'full'
  }

  export const SideNav: React.FunctionComponent<SideNavProps> & {
    Link: React.FunctionComponent<SideNavLinkProps>
  }

  export interface StateLabelProps extends CommonProps {
    small?: boolean
    status: 'issueOpened' | 'issueClosed' | 'pullOpened' | 'pullClosed' | 'pullMerged'
  }

  export const StateLabel: React.FunctionComponent<StateLabelProps>

  export interface TabNavProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export interface TabNavLinkProps extends CommonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    selected?: boolean
  }

  export const TabNav: React.FunctionComponent<TabNavProps> & {
    Link: React.FunctionComponent<TabNavLinkProps>
  }

  export interface TextInputProps
    extends CommonProps,
      StyledSystem.WidthProps,
      Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color' | 'size' | 'width'> {
    block?: boolean
    icon?: React.ReactElement
    variant?: 'small' | 'large'
  }

  export const TextInput: React.FunctionComponent<TextInputProps>

  export interface TooltipProps extends CommonProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
    align?: 'left' | 'right'
    direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
    noDelay?: boolean
    text?: string
    wrap?: boolean
  }

  export const Tooltip: React.FunctionComponent<TooltipProps>

  export interface UnderlineNavProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    actions?: React.ReactNode
    align?: 'right'
    full?: boolean
    label?: string
  }

  export interface TruncateProps extends StyledSystem.MaxWidthProps, TypographyProps, BaseProps {
    expandable?: boolean
    inline?: boolean
    title: string
  }

  export const Truncate: React.FunctionComponent<TruncateProps>

  export interface UnderlineNavLinkProps
    extends CommonProps,
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    selected?: boolean
  }

  export const UnderlineNav: React.FunctionComponent<UnderlineNavProps> & {
    Link: React.FunctionComponent<UnderlineNavLinkProps>
  }

  export interface SubNavProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>, FlexProps {
    actions?: React.ReactNode
    label?: string
  }

  export interface SubNavLinkProps extends CommonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    selected?: boolean
  }

  export const SubNav: React.FunctionComponent<SubNavProps> & {
    Link: React.FunctionComponent<SubNavLinkProps>
  }

  export interface BreadcrumbProps
    extends CommonProps,
      Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
      FlexProps {}

  export interface BreadcrumbItemProps
    extends CommonProps,
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    selected?: boolean
  }

  export const Breadcrumb: React.FunctionComponent<BreadcrumbProps> & {
    Item: React.FunctionComponent<BreadcrumbItemProps>
  }

  export const theme: {[key: string]: any}
  export const themeGet: (key: any) => any

  export interface DialogProps extends CommonProps {
    title: string
    isOpen: boolean
    onDismiss: () => unknown
  }

  export const Dialog: React.FunctionComponent<DialogProps>

  export interface LabelGroupProps extends CommonProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {}

  export const LabelGroup: React.FunctionComponent<LabelGroupProps>

  export interface AvatarStackProps extends CommonProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
    alignRight?: boolean
  }

  export const AvatarStack: React.FunctionComponent<AvatarStackProps>
  export interface ProgressBarProps
    extends BaseProps,
      CommonProps,
      StyledSystem.WidthProps,
      Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
    progress?: number | string
    barSize?: 'small' | 'default' | 'large'
    inline?: boolean
  }

  export const ProgressBar: React.FunctionComponent<ProgressBarProps>
}

declare module '@primer/components/src/Box' {
  import {Box} from '@primer/components'
  export default Box
}

declare module '@primer/components/src/Text' {
  import {Text} from '@primer/components'
  export default Text
}

declare module '@primer/components/src/Heading' {
  import {Heading} from '@primer/components'
  export default Heading
}

declare module '@primer/components/src/ButtonDanger' {
  import {ButtonDanger} from '@primer/components'
  export default ButtonDanger
}

declare module '@primer/components/src/ButtonPrimary' {
  import {ButtonPrimary} from '@primer/components'
  export default ButtonPrimary
}

declare module '@primer/components/src/ButtonOutline' {
  import {ButtonOutline} from '@primer/components'
  export default ButtonOutline
}

declare module '@primer/components/src/ButtonGroup' {
  import {ButtonGroup} from '@primer/components'
  export default ButtonGroup
}

declare module '@primer/components/src/Button' {
  import {Button} from '@primer/components'
  export default Button
}

declare module '@primer/components/src/Flex' {
  import {Flex} from '@primer/components'
  export default Flex
}

declare module '@primer/components/src/Avatar' {
  import {Avatar} from '@primer/components'
  export default Avatar
}

declare module '@primer/components/src/Details' {
  import {Details} from '@primer/components'
  export default Details
}

declare module '@primer/components/src/BaseStyles' {
  import {BaseStyles} from '@primer/components'
  export default BaseStyles
}

declare module '@primer/components/src/BorderBox' {
  import {BorderBox} from '@primer/components'
  export default BorderBox
}

declare module '@primer/components/src/BranchName' {
  import {BranchName} from '@primer/components'
  export default BranchName
}
declare module '@primer/components/src/CircleBadge' {
  import {CircleBadge} from '@primer/components'
  export default CircleBadge
}
declare module '@primer/components/src/CircleOcticon' {
  import {CircleOcticon} from '@primer/components'
  export default CircleOcticon
}
declare module '@primer/components/src/StyledOcticon' {
  import {StyledOcticon} from '@primer/components'
  export default StyledOcticon
}
declare module '@primer/components/src/Dropdown' {
  import {Dropdown} from '@primer/components'
  export default Dropdown
}
declare module '@primer/components/src/FilterList' {
  import {FilterList} from '@primer/components'
  export default FilterList
}
declare module '@primer/components/src/Flash' {
  import {Flash} from '@primer/components'
  export default Flash
}

declare module '@primer/components/src/CounterLabel' {
  import {CounterLabel} from '@primer/components'
  export default CounterLabel
}

declare module '@primer/components/src/Label' {
  import {Label} from '@primer/components'
  export default Label
}

declare module '@primer/components/src/Link' {
  import {Link} from '@primer/components'
  export default Link
}
declare module '@primer/components/src/PointerBox' {
  import {PointerBox} from '@primer/components'
  export default PointerBox
}
declare module '@primer/components/src/Relative' {
  import {Relative} from '@primer/components'
  export default Relative
}
declare module '@primer/components/src/Absolute' {
  import {Absolute} from '@primer/components'
  export default Absolute
}
declare module '@primer/components/src/Sticky' {
  import {Sticky} from '@primer/components'
  export default Sticky
}
declare module '@primer/components/src/Fixed' {
  import {Fixed} from '@primer/components'
  export default Fixed
}
declare module '@primer/components/src/StateLabel' {
  import {StateLabel} from '@primer/components'
  export default StateLabel
}
declare module '@primer/components/src/TabNav' {
  import {TabNav} from '@primer/components'
  export default TabNav
}
declare module '@primer/components/src/TextInput' {
  import {TextInput} from '@primer/components'
  export default TextInput
}
declare module '@primer/components/src/Tooltip' {
  import {Tooltip} from '@primer/components'
  export default Tooltip
}
declare module '@primer/components/src/UnderlineNav' {
  import {UnderlineNav} from '@primer/components'
  export default UnderlineNav
}
declare module '@primer/components/src/SideNav' {
  import {SideNav} from '@primer/components'
  export default SideNav
}
declare module '@primer/components/src/SubNav' {
  import {SubNav} from '@primer/components'
  export default SubNav
}
declare module '@primer/components/src/theme' {
  import {theme} from '@primer/components'
  export default theme
}
declare module '@primer/components/src/Dialog' {
  import {Dialog} from '@primer/components'
  export default Dialog
}

declare module '@primer/components/src/LabelGroup' {
  import {LabelGroup} from '@primer/components'
  export default LabelGroup
}

declare module '@primer/components/src/ProgressBar' {
  import {ProgressBar} from '@primer/components'
  export default ProgressBar
}

declare module '@primer/components/src/AvatarStack' {
  import {AvatarStack} from '@primer/components'
  export default AvatarStack
}

declare module '@primer/components/src/Breadcrumbs' {
  import {Breadcrumb} from '@primer/components'
  export default Breadcrumb
}
