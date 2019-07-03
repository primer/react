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

  interface LayoutProps
    extends BaseProps,
      StyledSystem.DisplayProps,
      StyledSystem.SizeProps,
      StyledSystem.WidthProps,
      StyledSystem.HeightProps,
      StyledSystem.MinWidthProps,
      StyledSystem.MinHeightProps,
      StyledSystem.MaxWidthProps,
      StyledSystem.MaxHeightProps,
      StyledSystem.OverflowProps,
      StyledSystem.VerticalAlignProps {}

  interface TypographyProps
    extends BaseProps,
      StyledSystem.FontFamilyProps,
      StyledSystem.FontSizeProps,
      StyledSystem.FontStyleProps,
      StyledSystem.FontWeightProps,
      StyledSystem.LineHeightProps,
      StyledSystem.TextAlignProps {}

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

  interface FlexContainerProps
    extends BaseProps,
      CommonProps,
      LayoutProps,
      StyledSystem.FlexBasisProps,
      StyledSystem.FlexDirectionProps,
      StyledSystem.FlexWrapProps,
      StyledSystem.AlignContentProps,
      StyledSystem.AlignItemsProps,
      StyledSystem.JustifyContentProps,
      StyledSystem.JustifyItemsProps {}

  interface FlexItemProps
    extends BaseProps,
      CommonProps,
      LayoutProps,
      StyledSystem.FlexProps,
      StyledSystem.JustifySelfProps,
      StyledSystem.AlignSelfProps,
      StyledSystem.OrderProps {}

  export interface FlexProps
    extends FlexContainerProps,
      Omit<React.HTMLProps<HTMLDivElement>, keyof FlexContainerProps> {}

  export const Flex: React.FunctionComponent<FlexProps> & {
    Item: React.FunctionComponent<FlexItemProps>
  }

  export interface BoxProps extends BaseProps, CommonProps, LayoutProps {}

  export const Box: React.FunctionComponent<BoxProps>

  export interface TextProps extends BaseProps, CommonProps, TypographyProps {}

  export const Text: React.FunctionComponent<TextProps>

  export interface HeadingProps extends BaseProps, CommonProps, TypographyProps {}

  export const Heading: React.FunctionComponent<HeadingProps>

  type DetailsRenderFunction = (args: {open: boolean; toggle: () => void}) => React.ReactElement

  export interface DetailsProps extends CommonProps {
    open?: boolean
    render?: DetailsRenderFunction
    children?: DetailsRenderFunction | React.ReactNode
    overlay?: boolean
  }

  export const Details: React.FunctionComponent<DetailsProps>

  export interface ButtonProps extends BaseProps, CommonProps {
    disabled?: boolean
    grouped?: boolean
    onClick?: Function
    size?: 'sm' | 'large'
  }

  export const ButtonPrimary: React.FunctionComponent<ButtonProps>
  export const ButtonOutline: React.FunctionComponent<ButtonProps>
  export const ButtonDanger: React.FunctionComponent<ButtonProps>
  export const Button: React.FunctionComponent<ButtonProps>

  export interface AvatarProps extends CommonProps {
    alt: string
    src: string
    isChild?: boolean
    size?: number
  }

  export const Avatar: React.FunctionComponent<AvatarProps>

  export interface BaseStylesProps extends TypographyProps, CommonProps {}

  export const BaseStyles: React.FunctionComponent<BaseStylesProps>

  export interface BorderBoxProps extends CommonProps, LayoutProps {
    border?: string
    borderColor?: string
    borderRadius?: string | number
    boxShadow?: string
  }

  export const BorderBox: React.FunctionComponent<BorderBoxProps>

  export interface BranchNameProps extends CommonProps {
    href?: string
  }

  export const BranchName: React.FunctionComponent<BranchNameProps>

  export interface CircleBadgeProps extends CommonProps {
    size?: string | number
  }

  export const CircleBadge: React.FunctionComponent<CircleBadgeProps>

  export interface CircleOcticonProps extends CommonProps {
    size?: number
    icon: React.ReactNode
  }

  export const CircleOcticon: React.FunctionComponent<CircleOcticonProps>

  export interface StyledOcticonProps extends CommonProps {
    size?: number
    icon: React.ReactNode
  }

  export const StyledOcticon: React.FunctionComponent<StyledOcticonProps>

  export interface DropdownProps extends CommonProps {}

  export interface DropdownMenuProps extends CommonProps {
    direction?: string
    title: string
  }

  export const Dropdown: React.FunctionComponent<DropdownProps> & {
    Menu: React.FunctionComponent<DropdownMenuProps>
    Item: React.FunctionComponent<DropdownProps>
  }

  export interface FilterListProps extends CommonProps {
    small?: boolean
  }

  export interface FilterListItemProps extends CommonProps {
    count?: number
    selected?: boolean
  }

  export const FilterList: React.FunctionComponent<FilterListProps> & {
    Item: React.FunctionComponent<FilterListItemProps>
  }

  export interface FlashProps extends CommonProps {
    full?: boolean
    scheme?: string
  }

  export const Flash: React.FunctionComponent<FlashProps>
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
