import {BaseStyles} from '.'
import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from './utils/types'
import {clsx} from 'clsx'
import classes from './BaseStyles.dev.stories.module.css'

export default {
  title: 'Behaviors/BaseStyles/Dev',
  component: BaseStyles,
} as Meta<ComponentProps<typeof BaseStyles>>

export const Default = () => 'Hello'

export const WithSxProps = () => <div className={clsx(classes.WithSxProps)}>Hello</div>

export const WithSystemProps = () => <div className={clsx(classes.WithSystemProps)}>Hello</div>

export const WithStyleProps = () => (
  <div
    style={{
      color: 'red',
      backgroundColor: 'blue',
      fontFamily: 'Arial',
      lineHeight: '1.5',
    }}
  >
    Hello
  </div>
)
