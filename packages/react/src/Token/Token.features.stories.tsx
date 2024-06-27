import React from 'react'
import type {Meta} from '@storybook/react'
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
      <Token as="a" href="/?path=/story/components-token-features--issue-label-token-custom-colors" text="Link" />
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
      <Token
        as="a"
        href="/?path=/story/components-token-features--issue-label-token-custom-colors"
        onRemove={action('remove me')}
        text="Link"
      />
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
      <IssueLabelToken
        as="a"
        href="/?path=/story/components-token-features--issue-label-token-custom-colors"
        text="Link"
      />
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
      <IssueLabelToken
        as="a"
        href="/?path=/story/components-token-features--issue-label-token-custom-colors"
        onRemove={action('remove me')}
        text="Link"
      />
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

export const IssueLabelTokenCustomColors = () => {
  return (
    <Box
      display="flex"
      sx={{
        flexDirection: 'column',
        alignItems: 'start',
        gap: get('space.2'),
      }}
    >
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2'),
        }}
      >
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Link"
          fillColor="#0366d6"
        />
        <IssueLabelToken as="button" onClick={action('clicked')} text="Button" fillColor="lightpink" />
        <IssueLabelToken as="span" tabIndex={0} onFocus={action('focused')} text="Focusable Span" fillColor="coral" />
      </Box>
      <h3>Color examples</h3>
      <Box
        display="flex"
        flexWrap="wrap"
        sx={{
          alignItems: 'start',
          gap: get('space.2'),
        }}
      >
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="😀 Link"
          fillColor="#8c50c8"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Token"
          fillColor="#a9d3bc"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="🚨 Problem"
          fillColor="#98afa7"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="📥 Inbox"
          fillColor="#573807"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="deeppink"
          fillColor="#b7b41e"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="👹 Link"
          fillColor="#0f65b1"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Tiger"
          fillColor="#e7bc68"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="🐛 coral"
          fillColor="#D6F2DE"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Long label"
          fillColor="#161E37"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="✅ Done"
          fillColor="#232323"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Hello"
          fillColor="#E0E0E0"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Lorem"
          fillColor="#aed531"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Lorem"
          fillColor="#d980fc"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Lorem"
          fillColor="#e7f922"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="🚀 Lorem"
          fillColor="#ef70e9"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Lorem"
          fillColor="#72ea84"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="Lorem"
          fillColor="#87e50b"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="🤷 Lorem"
          fillColor="#fcf646"
        />
        <IssueLabelToken
          as="a"
          href="/?path=/story/components-token-features--issue-label-token-custom-colors"
          text="💡 Light"
          fillColor="#E40C74"
        />
      </Box>
    </Box>
  )
}
