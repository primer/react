import React from 'react'
import type {Meta} from '@storybook/react'
import Box from '../Box'
import Text from '.'

export default {
  title: 'Components/Text/Features',
  component: Text,
} as Meta<typeof Text>

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
  <Text as="p" sx={{color: 'fg.onEmphasis', bg: 'neutral.emphasis', p: 2}} size="small">
    Stylized text
  </Text>
)

export const SizeSmall = () => (
  <Text as="span" size="small">
    Stylized text
  </Text>
)

export const SizeMedium = () => (
  <Text as="span" size="medium">
    Stylized text
  </Text>
)

export const SizeLarge = () => (
  <Text as="span" size="large">
    Stylized text
  </Text>
)

export const LightWeight = () => (
  <Text as="span" weight="light">
    Stylized text
  </Text>
)

export const NormalWeight = () => (
  <Text as="span" weight="normal">
    Stylized text
  </Text>
)

export const MediumWeight = () => (
  <Text as="span" weight="medium">
    Stylized text
  </Text>
)

export const SemiboldWeight = () => (
  <Text as="span" weight="semibold">
    Stylized text
  </Text>
)
