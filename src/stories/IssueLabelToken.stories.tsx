import React from 'react'
import {Meta} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import {get} from '../constants'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'
import IssueLabelToken, {IssueLabelTokenProps} from '../Token/IssueLabelToken'
import Text from '../Text'

export default {
  title: 'Components/IssueLabelToken',
  component: IssueLabelToken,
  argTypes: {
    fillColor: {
      defaultValue: '#0366d6',
      control: {
        type: 'color'
      }
    },
    text: {
      defaultValue: 'good first issue'
    }
  },
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ]
} as Meta

const excludedControlKeys = ['id', 'as', 'tabIndex', 'onRemove']

const SingleExampleContainer: React.FC<React.PropsWithChildren<{label?: string}>> = ({children, label}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'start',
      flexDirection: 'column',
      gap: get('space.0')
    }}
  >
    {label ? (
      <Text fontSize={0} color="fg.muted">
        {label}
      </Text>
    ) : null}
    {children}
  </Box>
)

const ExampleCollectionContainer: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'start',
      flexDirection: 'column',
      gap: get('space.6')
    }}
  >
    <Text fontSize={1} color="fg.subtle">
      Hint: use the &quot;Controls&quot; tab in the Addons panel to change the token properties
    </Text>
    {children}
  </Box>
)

export const DefaultToken = (args: Omit<IssueLabelTokenProps, 'ref'>) => {
  return (
    <ExampleCollectionContainer>
      <IssueLabelToken {...args} />
    </ExampleCollectionContainer>
  )
}
DefaultToken.storyName = 'Default'
DefaultToken.parameters = {controls: {exclude: [...excludedControlKeys, 'hideRemoveButton']}}

export const Interactive = (args: Omit<IssueLabelTokenProps, 'ref' | 'text'>) => {
  return (
    <ExampleCollectionContainer>
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <IssueLabelToken as="a" href="http://google.com/" text="Link" {...args} />
        <IssueLabelToken as="button" onClick={action('clicked')} text="Button" {...args} />
        <IssueLabelToken as="span" tabIndex={0} onFocus={action('focused')} text="Focusable Span" {...args} />
      </Box>
    </ExampleCollectionContainer>
  )
}
Interactive.parameters = {controls: {exclude: [...excludedControlKeys, 'hideRemoveButton', 'text']}}

export const WithOnRemoveFn = (args: Omit<IssueLabelTokenProps, 'ref'>) => {
  return (
    <ExampleCollectionContainer>
      <SingleExampleContainer label="w/ onRemove passed">
        <IssueLabelToken onRemove={action('remove me')} {...args} />
      </SingleExampleContainer>
      <SingleExampleContainer label="w/ onRemove passed and the token is interactive">
        <Box
          display="flex"
          sx={{
            alignItems: 'start',
            gap: get('space.2')
          }}
        >
          <IssueLabelToken as="a" href="http://google.com/" onRemove={action('remove me')} {...args} text="Link" />
          <IssueLabelToken
            as="button"
            onClick={action('clicked')}
            onRemove={action('remove me')}
            {...args}
            text="Button"
          />
          <IssueLabelToken
            as="span"
            tabIndex={0}
            onFocus={action('focused')}
            onRemove={action('remove me')}
            {...args}
            text="Focusable Span"
          />
        </Box>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}
WithOnRemoveFn.parameters = {controls: {exclude: excludedControlKeys}}
