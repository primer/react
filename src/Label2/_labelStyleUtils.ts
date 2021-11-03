import {variant} from 'styled-system'

export type LabelSizeKeys = 'sm' | 'md' | 'lg'

// TODO: consider moving to Primitives
export const badgeSizes: Record<LabelSizeKeys, number> = {
  sm: 20,
  md: 24,
  lg: 32
}

export const labelVariants = variant<
  {fontSize: number; height: string; paddingLeft: number; paddingRight: number},
  LabelSizeKeys
>({
  prop: 'size',
  variants: {
    sm: {
      fontSize: 0,
      height: `${badgeSizes.sm}px`,
      paddingLeft: 2,
      paddingRight: 2
    },
    md: {
      fontSize: 0,
      height: `${badgeSizes.md}px`,
      paddingLeft: 2,
      paddingRight: 2
    },
    lg: {
      fontSize: 1,
      height: `${badgeSizes.lg}px`,
      paddingLeft: 3,
      paddingRight: 3
    }
  }
})
