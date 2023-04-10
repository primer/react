import React from 'react'
import {Meta} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import {get} from '../constants'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'
import Token from './Token'
import {GitBranchIcon} from '@primer/octicons-react'
import IssueLabelToken from './IssueLabelToken'

export default {
  title: 'Components/Token/Features',
  component: Token,
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

export const InteractiveToken = () => {
  return (
    <Box
      display="flex"
      sx={{
        alignItems: 'start',
        gap: get('space.2'),
      }}
    >
      <Token as="a" href="http://google.com/" text="Link" />
      <Token as="button" onClick={action('clicked')} text="Button" />
      <Token as="span" tabIndex={0} onFocus={action('focused')} text="Focusable Span" />
    </Box>
  )
}

export const TokenWithLeadingVisual = () => {
  return <Token text="token" leadingVisual={GitBranchIcon} />
}

export const TokenWithOnRemoveFn = () => {
  return (
    <Box
      display="flex"
      sx={{
        alignItems: 'start',
        gap: get('space.2'),
      }}
    >
      <Token text="token" onRemove={action('remove me')} />
      <Token as="a" href="http://google.com/" onRemove={action('remove me')} text="Link" />
      <Token as="button" onClick={action('clicked')} onRemove={action('remove me')} text="Button" />
      <Token as="span" tabIndex={0} onFocus={action('focused')} onRemove={action('remove me')} text="Focusable Span" />
    </Box>
  )
}

TokenWithOnRemoveFn.storyName = 'Token with onRemove fn'

export const DefaultIssueLabelToken = () => {
  return <IssueLabelToken text="good first issue" />
}
DefaultIssueLabelToken.storyName = 'Default IssueLabelToken'

export const InteractiveIssueLabelToken = () => {
  return (
    <Box
      display="flex"
      sx={{
        alignItems: 'start',
        gap: get('space.2'),
      }}
    >
      <IssueLabelToken as="a" href="http://google.com/" text="Link" />
      <IssueLabelToken as="button" onClick={action('clicked')} text="Button" />
      <IssueLabelToken as="span" tabIndex={0} onFocus={action('focused')} text="Focusable Span" />
    </Box>
  )
}

InteractiveIssueLabelToken.storyName = 'Interactive IssueLabelToken'

export const IssueLabelTokenWithOnRemoveFn = () => {
  return (
    <Box
      display="flex"
      sx={{
        alignItems: 'start',
        gap: get('space.2'),
      }}
    >
      <IssueLabelToken text="token" onRemove={action('remove me')} />
      <IssueLabelToken as="a" href="http://google.com/" onRemove={action('remove me')} text="Link" />
      <IssueLabelToken as="button" onClick={action('clicked')} onRemove={action('remove me')} text="Button" />
      <IssueLabelToken
        as="span"
        tabIndex={0}
        onFocus={action('focused')}
        onRemove={action('remove me')}
        text="Focusable Span"
      />
    </Box>
  )
}

IssueLabelTokenWithOnRemoveFn.storyName = 'IssueLabelToken with onRemove fn'

export const SmallToken = () => <Token text="token" size="small" />
export const LargeToken = () => <Token text="token" size="xlarge" />
export const XLargeToken = () => <Token text="token" size="xlarge" />
