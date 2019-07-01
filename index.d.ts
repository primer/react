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

  export interface BoxProps extends BaseProps, CommonProps, LayoutProps {}

  export interface TextProps extends BaseProps, CommonProps, TypographyProps {}
  export interface HeadingProps extends BaseProps, CommonProps, TypographyProps {}

  type DetailsRenderFunction = (args: {open: boolean; toggle: () => void}) => React.ReactElement

  export interface DetailsProps extends CommonProps {
    open?: boolean
    render?: DetailsRenderFunction
    children?: DetailsRenderFunction | React.ReactNode
    overlay?: boolean
  }

  export interface ButtonProps extends BaseProps, CommonProps {
    disabled?: boolean
    grouped?: boolean
    onClick?: Function
    size?: 'sm' | 'large'
  }
}

declare module '@primer/components/src/Box' {
  import {BoxProps} from '@primer/components'

  export {BoxProps}

  const Box: React.FunctionComponent<BoxProps>

  export default Box
}

declare module '@primer/components/src/Text' {
  import {TextProps} from '@primer/components'

  const Text: React.FunctionComponent<TextProps>

  export default Text
}

declare module '@primer/components/src/Heading' {
  import {HeadingProps} from '@primer/components'

  const Heading: React.FunctionComponent<HeadingProps>

  export default Heading
}

declare module '@primer/components/src/ButtonDanger' {
  import {ButtonProps} from '@primer/components'

  const ButtonDanger: React.FunctionComponent<ButtonProps>

  export default ButtonDanger
}

declare module '@primer/components/src/ButtonPrimary' {
  import {ButtonProps} from '@primer/components'

  const ButtonPrimary: React.FunctionComponent<ButtonProps>

  export default ButtonPrimary
}

declare module '@primer/components/src/ButtonOutline' {
  import {ButtonProps} from '@primer/components'

  const ButtonOutline: React.FunctionComponent<ButtonProps>

  export default ButtonOutline
}

declare module '@primer/components/src/Button' {
  import {ButtonProps} from '@primer/components'

  const Button: React.FunctionComponent<ButtonProps>

  export default Button
}

declare module '@primer/components/src/Flex' {
  import {FlexProps, FlexItemProps} from '@primer/components'

  const Flex: React.FunctionComponent<FlexProps> & {
    Item: React.FunctionComponent<FlexItemProps>
  }

  export {FlexProps, FlexItemProps}

  export default Flex
}

declare module '@primer/components/src/Avatar' {
  import {CommonProps} from '@primer/components'

  const Avatar: React.FunctionComponent<
    CommonProps & {
      alt: string
      src: string
      isChild?: boolean
      size?: number
    }
  >

  export default Avatar
}

declare module '@primer/components/src/Details' {
  import {DetailsProps} from '@primer/components'

  const Details: React.FunctionComponent<DetailsProps>

  export default Details
}

declare module '@primer/components/src/BaseStyles' {
  import {TypographyProps, CommonProps} from '@primer/components'

  const BaseStyles: React.FunctionComponent<TypographyProps & CommonProps>

  export default BaseStyles
}

declare module '@primer/components/src/theme' {
  export default Object
}
