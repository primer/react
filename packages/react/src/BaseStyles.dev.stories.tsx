import {BaseStyles} from '.'
import type {Meta} from '@storybook/react'
import type {ComponentProps} from './utils/types'
import React from 'react'

export default {
  title: 'Behaviors/BaseStyles/Dev',
  component: BaseStyles,
} as Meta<ComponentProps<typeof BaseStyles>>

export const Default = () => 'Hello'

export const WithSxProps = () => (
  <BaseStyles
    sx={{
      color: 'red',
      backgroundColor: 'blue',
      fontFamily: 'Arial',
      lineHeight: '1.5',
    }}
  >
    Hello
  </BaseStyles>
)

export const WithSystemProps = () => (
  <BaseStyles color="red" backgroundColor="blue" fontFamily="Arial" fontSize="14px" lineHeight="1.5" display="flex">
    Hello
  </BaseStyles>
)

export const WithStyleProps = () => (
  <BaseStyles
    style={{
      color: 'red',
      backgroundColor: 'blue',
      fontFamily: 'Arial',
      lineHeight: '1.5',
    }}
  >
    Hello
  </BaseStyles>
)
