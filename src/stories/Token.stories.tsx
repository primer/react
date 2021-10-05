import React from 'react'
import {Meta} from '@storybook/react'
import {VerifiedIcon} from '@primer/octicons-react'

import {get} from '../constants'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'
import Token from '../Token/Token'
import ProfileToken from '../Token/ProfileToken'
import IssueLabelToken from '../Token/IssueLabelToken'
import Text from '../Text'

export default {
  title: 'Prototyping/Token',

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

const SingleExampleContainer: React.FC<{label?: string}> = ({children, label}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'start',
      flexDirection: 'column',
      gap: get('space.0')
    }}
  >
    {label ? (
      <Text fontSize={0} color="text.tertiary">
        {label}
      </Text>
    ) : null}
    {children}
  </Box>
)

const ExampleCollectionContainer: React.FC = ({children}) => (
  <Box
    display="flex"
    sx={{
      alignItems: 'start',
      flexDirection: 'column',
      gap: get('space.6')
    }}
  >
    {children}
  </Box>
)

export const defaultToken = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Resting">
      <Token text="Default Token" />
    </SingleExampleContainer>
    <SingleExampleContainer label="Interactive">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <Token as="a" href="http://google.com/" text="Link" />
        <Token as="button" onClick={() => console.log('clicked')} text="Button" />
        <Token as="span" tabIndex={0} onFocus={() => console.log('focused')} text="Focusable Span" />
      </Box>
    </SingleExampleContainer>
    <SingleExampleContainer label="w/ onRemove passed">
      <Token
        text="Default Token"
        onRemove={() => {
          console.log('remove me')
        }}
      />
    </SingleExampleContainer>
    <SingleExampleContainer label="w/ onRemove passed and the token is clickable">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <Token
          as="a"
          href="http://google.com/"
          text="Link"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <Token
          as="button"
          onClick={() => console.log('clicked')}
          text="Button"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <Token
          as="span"
          tabIndex={0}
          onFocus={() => console.log('focused')}
          text="Focusable Span"
          onRemove={() => {
            console.log('remove me')
          }}
        />
      </Box>
    </SingleExampleContainer>
    <SingleExampleContainer label="w/ leadingVisual passed">
      <Token text="Default Token" leadingVisual={() => <VerifiedIcon size={12} />} />
    </SingleExampleContainer>
    <SingleExampleContainer label="isSelected">
      <Token text="Default Token" isSelected={true} />
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const profileToken = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Resting">
      <ProfileToken size="lg" avatarSrc="https://avatars.githubusercontent.com/mperrotti" text="Mike Perrotti" />
    </SingleExampleContainer>
    <SingleExampleContainer label="w/ onRemove passed">
      <ProfileToken
        size="lg"
        avatarSrc="https://avatars.githubusercontent.com/mperrotti"
        text="Mike Perrotti"
        onRemove={() => {
          console.log('remove me')
        }}
      />
    </SingleExampleContainer>
    <SingleExampleContainer label="isSelected">
      <ProfileToken
        size="lg"
        avatarSrc="https://avatars.githubusercontent.com/mperrotti"
        text="Mike Perrotti"
        isSelected={true}
      />
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const labelToken = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Interactive">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <IssueLabelToken as="a" href="http://google.com/" text="Link" />
        <IssueLabelToken as="button" onClick={() => console.log('clicked')} text="Button" />
        <IssueLabelToken as="span" tabIndex={0} onFocus={() => console.log('focused')} text="Focusable Span" />
      </Box>
    </SingleExampleContainer>
    <SingleExampleContainer label="Interactive (#656BFE fill color passed)">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <IssueLabelToken fillColor="#656BFE" as="a" href="http://google.com/" text="Link" />
        <IssueLabelToken fillColor="#656BFE" as="button" onClick={() => console.log('clicked')} text="Button" />
        <IssueLabelToken
          fillColor="#656BFE"
          as="span"
          tabIndex={0}
          onFocus={() => console.log('focused')}
          text="Focusable Span"
        />
      </Box>
    </SingleExampleContainer>
    <SingleExampleContainer label="Default (#656BFE fill color passed)">
      <IssueLabelToken text="good first issue" fillColor="#656BFE" />
    </SingleExampleContainer>
    <SingleExampleContainer label="w/ onRemove passed">
      <IssueLabelToken
        text="good first issue"
        fillColor="#656BFE"
        onRemove={() => {
          console.log('remove me')
        }}
      />
    </SingleExampleContainer>
    <SingleExampleContainer label="w/ onRemove passed and the token is clickable">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <IssueLabelToken
          as="a"
          href="http://google.com/"
          text="good first issue"
          fillColor="#656BFE"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <IssueLabelToken
          as="button"
          onClick={() => console.log('clicked')}
          text="good first issue"
          fillColor="#656BFE"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <IssueLabelToken
          as="span"
          tabIndex={0}
          onFocus={() => console.log('focused')}
          text="good first issue"
          fillColor="#656BFE"
          onRemove={() => {
            console.log('remove me')
          }}
        />
      </Box>
    </SingleExampleContainer>
    <SingleExampleContainer label="isSelected">
      <IssueLabelToken
        text="good first issue"
        fillColor="#656BFE"
        isSelected={true}
      />
    </SingleExampleContainer>
    <SingleExampleContainer label="Automatically picks a readable text color based on fill color">
      <Box display="flex" sx={{gap: get('space.2')}}>
        <IssueLabelToken text="good first issue" fillColor="#656BFE" />
        <IssueLabelToken text="bug" fillColor="#FFF06C" />
      </Box>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const sizes = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="default Token component">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <Token size="sm" text="SM Token" />
        <Token size="md" text="MD Token" />
        <Token size="lg" text="LG Token (default)" />
        <Token size="xl" text="XL Token" />
      </Box>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)
