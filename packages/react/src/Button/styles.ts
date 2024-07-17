import type {AlignContent} from './types'

export const getAlignContentSize = (alignContent: AlignContent = 'center') => ({
  justifyContent: alignContent === 'center' ? 'center' : 'flex-start',
})
