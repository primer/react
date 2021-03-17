/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import {Meta} from '@storybook/react'
import {ThemeProvider} from 'styled-components'

import {BaseStyles, Text, theme} from '..'
import {TextStyleProps} from 'styled-system'
import {TextProps} from '../Text'
type StrictTextStyleProps = TextStyleProps & {fontSize: TextProps['fontSize']}

export default {
  title: 'Composite components/Text',
  component: Text,
  decorators: [
    Story => {
      return (
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    as: {
      table: {
        disable: true
      }
    },
    theme: {
      table: {
        disable: true
      }
    },
    sx: {
      table: {
        disable: true
      }
    },
    fontSize: {
      control: {
        type: 'radio',
        options: [0, 1, 2, 3, 4, 5, 6, 7]
      }
    }
  }
} as Meta

export const defaultText = (args: StrictTextStyleProps) => <Text {...args}>This is a default text</Text>

defaultText.args = {fontSize: 1}
