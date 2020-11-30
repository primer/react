declare module '@primer/components' {
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
  import * as StyledSystem from 'styled-system'
  import {SystemStyleObject} from '@styled-system/css'
  import * as StyledComponents from 'styled-components'
  import { ReactComponentLike } from 'prop-types';
  import * as History from 'history'

  export interface BaseProps extends React.Props<any> {
    as?: React.ReactType
    className?: string
    css?: string
    sx?: SystemStyleObject
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
    extends StyledSystem.BordersProps,
      StyledSystem.BoxShadowProps {}

  interface PositionProps extends StyledSystem.PositionProps {}

  export interface BoxProps
    extends BaseProps,
      CommonProps,
      LayoutProps,
      StyledSystem.FlexboxProps,
      Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export const Box: React.FunctionComponent<BoxProps>

  interface FlexProps extends BoxProps {}

  export const Flex: React.FunctionComponent<FlexProps>

  export interface TextProps
    extends BaseProps,
      CommonProps,
      TypographyProps,
      Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {}

  export const Text: React.FunctionComponent<TextProps>

  export interface HeaderProps
    extends BaseProps,
      CommonProps,
      BorderProps,
      Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> { }
  export interface HeaderItemProps extends CommonProps, BorderProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    full?: boolean;
  }
  export interface HeaderLinkProps extends CommonProps, BorderProps, TypographyProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {}

  export const Header: React.FunctionComponent<HeaderProps> & {
    Item: React.FunctionComponent<HeaderItemProps>
    Link: React.FunctionComponent<HeaderLinkProps>
  }

  export interface HeadingProps
    extends BaseProps,
      CommonProps,
      TypographyProps,
      Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'> { }

  export const Heading: React.FunctionComponent<HeadingProps>


  export interface DetailsProps extends CommonProps, Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, 'color'> {
    onToggle: (event: React.SyntheticEvent<HTMLDetailsElement>) => void
    open: boolean
    ref: React.RefObject<HTMLDetailsElement>
  }

  export const Details: React.FunctionComponent<DetailsProps>

  export interface UseDetailsProps {
    defaultOpen?: boolean
    closeOnOutsideClick?: boolean
    onClickOutside?: (event: React.MouseEvent ) => void
    ref?: React.RefObject<HTMLDetailsElement> | null
  }

  export const useDetails: (props?: UseDetailsProps) => {
    getDetailsProps: () => {
      onToggle: (event: React.SyntheticEvent<HTMLDetailsElement>) => void
      open: boolean
      ref: React.RefObject<HTMLDetailsElement>
    }
    open: boolean
    setOpen: (open: boolean) => void
  }

  export interface ButtonProps
    extends BaseProps,
      CommonProps,
      LayoutProps,
      StyledSystem.FontSizeProps,
      Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    variant?: 'small' | 'medium' | 'large'
  }

  export interface ButtonTableListProps
    extends CommonProps,
      TypographyProps,
      LayoutProps,
      Omit<React.HTMLAttributes<HTMLElement>, 'color'> {}

  export const ButtonPrimary: React.FunctionComponent<ButtonProps>
  export const ButtonOutline: React.FunctionComponent<ButtonProps>
  export const ButtonDanger: React.FunctionComponent<ButtonProps>
  export const ButtonInvisible: React.FunctionComponent<ButtonProps>
  export const ButtonTableList: React.FunctionComponent<ButtonTableListProps>
  export const ButtonGroup: React.FunctionComponent<BoxProps>
  export const Button: React.FunctionComponent<ButtonProps>

  export interface AvatarProps extends CommonProps, Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'color'> {
    size?: number
    square?: boolean
  }

  export const Avatar: React.FunctionComponent<AvatarProps>

  export interface AvatarPairProps extends PositionComponentProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export const AvatarPair: React.FunctionComponent<AvatarPairProps>

  export interface BaseStylesProps extends TypographyProps, CommonProps {}

  export const BaseStyles: React.FunctionComponent<BaseStylesProps>

  export interface BorderBoxProps extends BorderProps, BoxProps {}

  export const BorderBox: React.FunctionComponent<BorderBoxProps>

  export interface BranchNameProps extends CommonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {}

  export const BranchName: React.FunctionComponent<BranchNameProps>

  export interface CircleBadgeProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    inline?: boolean
    size?: number
    variant?: 'small' | 'medium' | 'large'
  }

  export interface CircleBadgeIconProps extends StyledOcticonProps {}

  export const CircleBadge: React.FunctionComponent<CircleBadgeProps> & {
    Icon: React.FunctionComponent<CircleBadgeIconProps>
  }

  export interface CircleOcticonProps extends CommonProps, FlexProps {
    size?: number
    icon: ReactComponentLike
  }

  export const CircleOcticon: React.FunctionComponent<CircleOcticonProps>

  export interface StyledOcticonProps extends CommonProps {
    size?: number | 'small' | 'medium' | 'large'
    icon: ReactComponentLike
    verticalAlign?: 'middle' | 'text-bottom' | 'top' | 'text-top'
  }

  export const StyledOcticon: React.FunctionComponent<StyledOcticonProps>

  export interface DropdownProps extends DetailsProps {}
  export interface DropdownItemProps extends CommonProps, Omit<React.HTMLAttributes<HTMLLIElement>, 'color'> {}

  export interface DropdownMenuProps extends CommonProps, Omit<React.HTMLAttributes<HTMLUListElement>, 'color'> {
    direction?: 'ne'| 'e'| 'se'| 's'| 'sw'| 'w'
  }

  export interface DropdownButtonProps extends ButtonProps {}

  export interface DropdownCaretProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export const Dropdown: React.FunctionComponent<DropdownProps> & {
    Menu: React.FunctionComponent<DropdownMenuProps>
    Item: React.FunctionComponent<DropdownItemProps>
    Button: React.FunctionComponent<DropdownButtonProps>
    Caret: React.FunctionComponent<DropdownCaretProps>
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
    variant?: 'success' | 'default' | 'warning' | 'danger'
  }

  export const Flash: React.FunctionComponent<FlashProps>

  export interface CounterLabelProps extends CommonProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
    scheme?: string
  }

  export const CounterLabel: React.FunctionComponent<CounterLabelProps>

  export interface FormGroupProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export interface FormGroupLabelProps extends CommonProps, TypographyProps, Omit<React.HTMLAttributes<HTMLLabelElement>, 'color'> {}

  export const FormGroup: React.FunctionComponent<FormGroupProps> & {
    Label: React.FunctionComponent<FormGroupLabelProps>
  }

  export interface GridProps extends BoxProps, StyledSystem.GridProps {}

  export const Grid: React.FunctionComponent<GridProps>

  export interface LabelProps extends CommonProps, StyledSystem.BorderColorProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
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
    hoverColor?: string
  }

  export const Link: React.FunctionComponent<LinkProps>

  export interface PageheadProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export const Pagehead: React.FunctionComponent<PageheadProps>

  export type PaginationHrefBuilder = (page: number) => string

  export type PaginationPageChangeCallback = (e: React.MouseEvent, page: number) => void

  export interface PaginationProps extends CommonProps {
    currentPage: number
    hrefBuilder?: PaginationHrefBuilder
    /**
     * How many pages to show on the left and right of the component
     */
    marginPageCount?: number
    onPageChange?: PaginationPageChangeCallback
    pageCount: number
    showPages?: boolean
    /**
     * How many pages to show directly to the left and right of the current page
     */
    surroundingPageCount?: number
  }

  export const Pagination: React.FunctionComponent<PaginationProps>

  export interface PointerBoxProps extends CommonProps, LayoutProps, BorderBoxProps {
    caret?: string
  }

  export const PointerBox: React.FunctionComponent<PointerBoxProps>

  export interface PopoverProps extends CommonProps, LayoutProps, PositionProps {
    caret?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-left'
    | 'top-right'
    | 'left-bottom'
    | 'left-top'
    | 'right-bottom'
    | 'right-top'
    open?: boolean
    relative?: boolean
  }

  export interface PopoverContentProps extends BorderBoxProps { }

  export const Popover: React.FunctionComponent<PopoverProps> & {
    Content: React.FunctionComponent<PopoverContentProps>
  }

  export interface PositionComponentProps
    extends PositionProps, BoxProps {}

  export const Relative: React.FunctionComponent<PositionComponentProps>
  export const Absolute: React.FunctionComponent<PositionComponentProps>
  export const Sticky: React.FunctionComponent<PositionComponentProps>
  export const Fixed: React.FunctionComponent<PositionComponentProps>

  export interface SelectMenuProps extends Omit<CommonProps, 'as'>, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    initialTab?: string
    ref?: React.RefObject<HTMLDetailsElement> | null
  }

  export interface SelectMenuModalProps extends CommonProps, StyledSystem.WidthProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    align?: 'left' | 'right'
    ref?: React.RefObject<HTMLDivElement> | null
  }

  export interface SelectMenuListProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export interface SelectMenuLoadingAnimationProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  interface SelectMenuItemCommonProps extends CommonProps {
    selected?: boolean;
  }
  interface SelectMenuItemAsButtonProps extends SelectMenuItemCommonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    as?: "button"
  }
  interface SelectMenuItemAsAnchorProps extends SelectMenuItemCommonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
    as?: "a"
  }
  export type SelectMenuItemProps = SelectMenuItemAsButtonProps | SelectMenuItemAsAnchorProps;

  export interface SelectMenuFooterProps extends CommonProps, Omit<React.HTMLAttributes<HTMLElement>, 'color'> {}

  export interface SelectMenuDividerProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export interface SelectMenuHeaderProps extends CommonProps, TypographyProps, Omit<React.HTMLAttributes<HTMLElement>, 'color'> {}

  export interface SelectMenuFilterProps extends TextInputProps {
    value: string
  }

  export interface SelectMenuTabsProps extends CommonProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export interface SelectMenuTabProps extends CommonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    index: number,
    tabName: string
  }

  export interface SelectMenuTabPanelProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    tabName: string
  }

  export const SelectMenu: React.FunctionComponent<SelectMenuProps> & {
    MenuContext: React.Context<{
      selectedTab: string | undefined
      setSelectedTab: (selectedTab: string | undefined) => void,
      open: boolean | undefined,
      setOpen: (open: boolean | undefined) => void,
      initialTab:  string | undefined
    }>
    Divider: React.FunctionComponent<SelectMenuDividerProps>
    Filter: React.FunctionComponent<SelectMenuFilterProps>
    Footer: React.FunctionComponent<SelectMenuFooterProps>
    List: React.FunctionComponent<SelectMenuListProps>
    Item: React.FunctionComponent<SelectMenuItemProps>
    Modal: React.FunctionComponent<SelectMenuModalProps>
    Tabs: React.FunctionComponent<SelectMenuTabsProps>
    Tab: React.FunctionComponent<SelectMenuTabProps>
    TabPanel: React.FunctionComponent<SelectMenuTabPanelProps>
    Header: React.FunctionComponent<SelectMenuHeaderProps>
    LoadingAnimation: React.FunctionComponent<SelectMenuLoadingAnimationProps>
  }

  export interface SideNavProps extends CommonProps, BorderBoxProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
    bordered?: boolean
    variant?: 'normal' | 'lightweight'
  }

  export interface SideNavLinkProps
    extends CommonProps,
      TypographyProps,
      LinkProps {
    selected?: boolean
    variant?: 'normal' | 'full'
  }

  export const SideNav: React.FunctionComponent<SideNavProps> & {
    Link: React.FunctionComponent<SideNavLinkProps>
  }

  export interface StateLabelProps extends CommonProps {
    variant?: 'small' | 'normal'
    status: 'issueOpened' | 'issueClosed' | 'pullOpened' | 'pullClosed' | 'pullMerged' | 'draft'
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
      StyledSystem.MaxWidthProps,
      StyledSystem.MinWidthProps,
      Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color' | 'size' | 'width'> {
    block?: boolean
    icon?: ReactComponentLike
    variant?: 'small' | 'large'
    ref?: React.RefObject<HTMLInputElement> | null
  }

  export const TextInput: React.FunctionComponent<TextInputProps>

  export interface TooltipProps extends CommonProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
    align?: 'left' | 'right'
    direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
    noDelay?: boolean
    text?: string
    wrap?: boolean
  }

  export interface TimelineProps extends Omit<FlexProps, 'flexDirection'> {
    clipSidebar?: boolean
  }

  export interface TimelineItemProps extends Omit<FlexProps, 'flexDirection'> {
    condensed?: boolean
  }
  export interface TimelineBadgeProps extends Omit<FlexProps, 'height' | 'width' | 'alignItems' | 'justifyContent'> {}

  export const Timeline: React.FunctionComponent<TimelineProps> & {
    Item: React.FunctionComponent<TimelineItemProps>
    Badge: React.FunctionComponent<TimelineBadgeProps>
    Body: React.FunctionComponent<BoxProps>
    Break: React.FunctionComponent<BoxProps>
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

  export interface SubNavLinksProps extends CommonProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {}

  export const SubNav: React.FunctionComponent<SubNavProps> & {
    Link: React.FunctionComponent<SubNavLinkProps>,
    Links: React.FunctionComponent<SubNavLinksProps>
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

  export interface DialogProps extends CommonProps, LayoutProps {
    isOpen: boolean
    onDismiss: () => unknown
  }

  export interface DialogHeaderProps extends FlexProps {}

  export const Dialog: React.FunctionComponent<DialogProps> & {
    Header: React.FunctionComponent<DialogHeaderProps>
  }

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
declare module '@primer/components/lib/Box' {
  import {Box} from '@primer/components'
  export default Box
}

declare module '@primer/components/lib/Text' {
  import {Text} from '@primer/components'
  export default Text
}

declare module '@primer/components/lib/Header' {
  import {Header} from '@primer/components'
  export default Header
}

declare module '@primer/components/lib/Heading' {
  import {Heading} from '@primer/components'
  export default Heading
}

declare module '@primer/components/lib/ButtonDanger' {
  import {ButtonDanger} from '@primer/components'
  export default ButtonDanger
}

declare module '@primer/components/lib/ButtonPrimary' {
  import {ButtonPrimary} from '@primer/components'
  export default ButtonPrimary
}

declare module '@primer/components/lib/ButtonOutline' {
  import {ButtonOutline} from '@primer/components'
  export default ButtonOutline
}

declare module '@primer/components/lib/ButtonInvisible' {
  import {ButtonInvisible} from '@primer/components'
  export default ButtonInvisible
}

declare module '@primer/components/lib/ButtonTableList' {
  import {ButtonTableList} from '@primer/components'
  export default ButtonTableList
}

declare module '@primer/components/lib/ButtonGroup' {
  import {ButtonGroup} from '@primer/components'
  export default ButtonGroup
}

declare module '@primer/components/lib/Button' {
  import {Button} from '@primer/components'
  export default Button
}

declare module '@primer/components/lib/Flex' {
  import {Flex} from '@primer/components'
  export default Flex
}

declare module '@primer/components/lib/Avatar' {
  import {Avatar} from '@primer/components'
  export default Avatar
}

declare module '@primer/components/lib/AvatarPair' {
  import {AvatarPair} from '@primer/components'
  export default AvatarPair
}

declare module '@primer/components/lib/Details' {
  import {Details} from '@primer/components'
  export default Details
}

declare module '@primer/components/lib/hooks/useDetails' {
  import {useDetails} from '@primer/components'
  export default useDetails
}

declare module '@primer/components/lib/BaseStyles' {
  import {BaseStyles} from '@primer/components'
  export default BaseStyles
}

declare module '@primer/components/lib/BorderBox' {
  import {BorderBox} from '@primer/components'
  export default BorderBox
}

declare module '@primer/components/lib/BranchName' {
  import {BranchName} from '@primer/components'
  export default BranchName
}
declare module '@primer/components/lib/CircleBadge' {
  import {CircleBadge} from '@primer/components'
  export default CircleBadge
}
declare module '@primer/components/lib/CircleOcticon' {
  import {CircleOcticon} from '@primer/components'
  export default CircleOcticon
}
declare module '@primer/components/lib/StyledOcticon' {
  import {StyledOcticon} from '@primer/components'
  export default StyledOcticon
}
declare module '@primer/components/lib/Dropdown' {
  import {Dropdown} from '@primer/components'
  export default Dropdown
}
declare module '@primer/components/lib/FilterList' {
  import {FilterList} from '@primer/components'
  export default FilterList
}
declare module '@primer/components/lib/Flash' {
  import {Flash} from '@primer/components'
  export default Flash
}

declare module '@primer/components/lib/Grid' {
  import {Grid} from '@primer/components'
  export default Grid
}

declare module '@primer/components/lib/CounterLabel' {
  import {CounterLabel} from '@primer/components'
  export default CounterLabel
}

declare module '@primer/components/lib/Label' {
  import {Label} from '@primer/components'
  export default Label
}

declare module '@primer/components/lib/Link' {
  import {Link} from '@primer/components'
  export default Link
}
declare module '@primer/components/lib/Pagination' {
  import {Pagination} from '@primer/components'
  export default Pagination
}
declare module '@primer/components/lib/PointerBox' {
  import {PointerBox} from '@primer/components'
  export default PointerBox
}
declare module '@primer/components/lib/Popover' {
  import {Popover} from '@primer/components'
  export default Popover
}
declare module '@primer/components/lib/Relative' {
  import {Relative} from '@primer/components'
  export default Relative
}
declare module '@primer/components/lib/Absolute' {
  import {Absolute} from '@primer/components'
  export default Absolute
}
declare module '@primer/components/lib/Sticky' {
  import {Sticky} from '@primer/components'
  export default Sticky
}
declare module '@primer/components/lib/Fixed' {
  import {Fixed} from '@primer/components'
  export default Fixed
}

declare module '@primer/components/lib/Pagehead' {
  import {Pagehead} from '@primer/components'
  export default Pagehead
}

declare module '@primer/components/lib/SelectMenu' {
  import {SelectMenu} from '@primer/components'
  export default SelectMenu
}

declare module '@primer/components/lib/StateLabel' {
  import {StateLabel} from '@primer/components'
  export default StateLabel
}

declare module '@primer/components/lib/TabNav' {
  import {TabNav} from '@primer/components'
  export default TabNav
}
declare module '@primer/components/lib/TextInput' {
  import {TextInput} from '@primer/components'
  export default TextInput
}
declare module '@primer/components/lib/Timeline' {
  import {Timeline} from '@primer/components'
  export default Timeline
}
declare module '@primer/components/lib/Tooltip' {
  import {Tooltip} from '@primer/components'
  export default Tooltip
}
declare module '@primer/components/lib/UnderlineNav' {
  import {UnderlineNav} from '@primer/components'
  export default UnderlineNav
}
declare module '@primer/components/lib/SideNav' {
  import {SideNav} from '@primer/components'
  export default SideNav
}
declare module '@primer/components/lib/SubNav' {
  import {SubNav} from '@primer/components'
  export default SubNav
}
declare module '@primer/components/lib/theme' {
  import {theme} from '@primer/components'
  export default theme
}
declare module '@primer/components/lib/Dialog' {
  import {Dialog} from '@primer/components'
  export default Dialog
}

declare module '@primer/components/lib/LabelGroup' {
  import {LabelGroup} from '@primer/components'
  export default LabelGroup
}

declare module '@primer/components/lib/ProgressBar' {
  import {ProgressBar} from '@primer/components'
  export default ProgressBar
}

declare module '@primer/components/lib/AvatarStack' {
  import {AvatarStack} from '@primer/components'
  export default AvatarStack
}

declare module '@primer/components/lib/Breadcrumbs' {
  import {Breadcrumb} from '@primer/components'
  export default Breadcrumb
}

declare module '@primer/components/lib/FormGroup' {
  import {FormGroup} from '@primer/components'
  export default FormGroup
}
