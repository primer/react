import React from 'react'
import {Meta} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import {get} from '../constants'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'
import Token, {TokenProps} from '../Token/Token'
import Text from '../Text'
import {GitBranchIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Token',
  component: Token,
  args: {
    text: 'Token',
    size: 'medium',
  },
  argTypes: {
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large', 'xlarge'],
    },
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
    },
  ],
} as Meta

const excludedControlKeys = ['id', 'as', 'tabIndex', 'onRemove', 'leadingVisual']

const SingleExampleContainer: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'start',
      flexDirection: 'column',
      gap: get('space.0'),
    }}
  >
    {children}
  </Box>
)

const ExampleCollectionContainer: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'start',
      flexDirection: 'column',
      gap: get('space.6'),
    }}
  >
    {children}
  </Box>
)

export const DefaultToken = (args: Omit<TokenProps, 'ref'>) => {
  return (
    <ExampleCollectionContainer>
      <Token {...args} />
    </ExampleCollectionContainer>
  )
}
DefaultToken.storyName = 'Default'
DefaultToken.parameters = {controls: {exclude: [...excludedControlKeys, 'hideRemoveButton']}}

export const Interactive = (args: Omit<TokenProps, 'ref' | 'text'>) => {
  return (
    <ExampleCollectionContainer>
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2'),
        }}
      >
        <Token as="a" href="http://google.com/" {...args} text="Link" />
        <Token as="button" onClick={action('clicked')} {...args} text="Button" />
        <Token as="span" tabIndex={0} onFocus={action('focused')} {...args} text="Focusable Span" />
      </Box>
    </ExampleCollectionContainer>
  )
}
Interactive.parameters = {controls: {exclude: [...excludedControlKeys, 'hideRemoveButton', 'text']}}

export const WithLeadingVisual = (args: Omit<TokenProps, 'ref'>) => {
  return (
    <ExampleCollectionContainer>
      <Token {...args} leadingVisual={GitBranchIcon} />
    </ExampleCollectionContainer>
  )
}
WithLeadingVisual.storyName = 'with leadingVisual'
WithLeadingVisual.parameters = {controls: {exclude: [...excludedControlKeys, 'hideRemoveButton']}}

export const WithOnRemoveFn = (args: Omit<TokenProps, 'ref'>) => {
  return (
    <ExampleCollectionContainer>
      <SingleExampleContainer>
        <Token onRemove={action('remove me')} {...args} />
      </SingleExampleContainer>
      <SingleExampleContainer>
        <Box
          display="flex"
          sx={{
            alignItems: 'start',
            gap: get('space.2'),
          }}
        >
          <Token as="a" href="http://google.com/" onRemove={action('remove me')} {...args} text="Link" />
          <Token as="button" onClick={action('clicked')} onRemove={action('remove me')} {...args} text="Button" />
          <Token
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
