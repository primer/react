import styled from 'styled-components'
import type {SystemCommonProps, SystemTypographyProps} from '../constants'
import {COMMON, TYPOGRAPHY} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

type StyledTextProps = {
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
} & SystemTypographyProps &
  SystemCommonProps &
  SxProp

const Text = styled.span.attrs<StyledTextProps>(({size, weight}) => ({
  'data-size': size,
  'data-weight': weight,
}))<StyledTextProps>`
  ${TYPOGRAPHY};
  ${COMMON};

  &:where([data-size='small']) {
    font-size: var(--text-body-size-small, 0.75rem);
    line-height: var(--text-body-lineHeight-small, 1.6666);
  }

  &:where([data-size='medium']) {
    font-size: var(--text-body-size-medium, 0.875rem);
    line-height: var(--text-body-lineHeight-medium, 1.4285);
  }

  &:where([data-size='large']) {
    font-size: var(--text-body-size-large, 1rem);
    line-height: var(--text-body-lineHeight-large, 1.5);
  }

  &:where([data-weight='light']) {
    font-weight: var(--base-text-weight-light, 300);
  }

  &:where([data-weight='normal']) {
    font-weight: var(--base-text-weight-normal, 400);
  }

  &:where([data-weight='medium']) {
    font-weight: var(--base-text-weight-medium, 500);
  }

  &:where([data-weight='semibold']) {
    font-weight: var(--base-text-weight-semibold, 600);
  }

  ${sx};
`
export type TextProps = ComponentProps<typeof Text>
export default Text
