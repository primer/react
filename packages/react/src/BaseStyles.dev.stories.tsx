import {BaseStyles} from '.'
import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from './utils/types'

export default {
  title: 'Behaviors/BaseStyles/Dev',
  component: BaseStyles,
} as Meta<ComponentProps<typeof BaseStyles>>

export const Default = () => 'Hello'

export const WithSystemProps = () => (
  <BaseStyles color="red" fontFamily="Arial" fontSize="14px">
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
