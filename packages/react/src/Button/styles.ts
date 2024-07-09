import type {VariantType, AlignContent} from './types'
import type {Theme} from '../ThemeProvider'

export const getVariantStyles = (variant: VariantType = 'default', theme?: Theme) => {
  return {}
}

export const getAlignContentSize = (alignContent: AlignContent = 'center') => ({
  justifyContent: alignContent === 'center' ? 'center' : 'flex-start',
})
