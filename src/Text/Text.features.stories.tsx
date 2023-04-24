import React from 'react'
import {ComponentMeta} from '@storybook/react'
import Box from '../Box'
import Text from '.'

export default {
  title: 'Components/Text/Features',
  component: Text,
} as ComponentMeta<typeof Text>

export const Polymorphism = () => (
  <Box sx={{display: 'flex', flexDirection: 'column'}}>
    <Text as="em">Emphasized text</Text>
    <Text as="i">Italicized text</Text>
    <Text as="strong">Strong text</Text>
    <Text as="small">Small text</Text>
    <Text as="u">Text with underline</Text>
  </Box>
)

export const StyledText = () => (
  <Text as="p" sx={{color: 'fg.onEmphasis', bg: 'neutral.emphasis', p: 2}}>
    Stylized text
  </Text>
)
