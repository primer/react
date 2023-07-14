import React, {Meta} from '@storybook/react'
import BaseStyles from '../../BaseStyles'
import ThemeProvider from '../../ThemeProvider'
import {Box, Text} from '../..'
import {ToastUI} from './ToastUI'

const meta: Meta = {
  title: 'Components/Toast/UI/Features',
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <div>{Story()}</div>
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
  component: ToastUI,
}
export default meta

export const Default = () => <ToastUI variant="default">Message</ToastUI>
export const Success = () => <ToastUI variant="success">Message</ToastUI>
export const Attention = () => <ToastUI variant="attention">Message</ToastUI>
export const Danger = () => <ToastUI variant="danger">Message</ToastUI>
export const Loading = () => <ToastUI variant="loading">Message</ToastUI>

export const Dismissible = () => (
  <ToastUI variant="danger" dismissible>
    Message
  </ToastUI>
)
export const Multiline = () => (
  <ToastUI variant="loading" dismissible>
    <Text as="p">
      Toast with longer message. It is advised that the content should <strong>not</strong> go longer than 140
      characters or three message lines.
    </Text>
  </ToastUI>
)
