import React from 'react'
import styled from 'styled-components'
import {COMMON, TYPOGRAPHY} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

type StyledTextProps = {
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
  as?: React.ElementType
} & SxProp

const StyledText = styled.span<StyledTextProps>`
  ${TYPOGRAPHY};
  ${COMMON};

  &:where([data-size='small']) {
    font-size: var(--text-body-size-small);
    line-height: var(--text-body-lineHeight-small);
  }

  &:where([data-size='medium']) {
    font-size: var(--text-body-size-medium);
    line-height: var(--text-body-lineHeight-medium);
  }

  &:where([data-size='large']) {
    font-size: var(--text-body-size-large);
    line-height: var(--text-body-lineHeight-large);
  }

  &:where([data-weight='light']) {
    font-weight: var(--base-text-weight-light);
  }

  &:where([data-weight='normal']) {
    font-weight: var(--base-text-weight-normal);
  }

  &:where([data-weight='medium']) {
    font-weight: var(--base-text-weight-medium);
  }

  &:where([data-weight='semibold']) {
    font-weight: var(--base-text-weight-semibold);
  }

  ${sx};
`

const Text = ({as: Component = 'span', size, weight, ...props}: StyledTextProps) => {
  return <StyledText as={Component} {...props} data-size={size} data-weight={weight} />
}

export type TextProps = ComponentProps<typeof Text>
export default Text
