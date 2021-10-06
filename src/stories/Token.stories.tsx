import React from 'react'
import {Meta} from '@storybook/react'
import {VerifiedIcon} from '@primer/octicons-react'
import {withKnobs, color} from '@storybook/addon-knobs'

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
    withKnobs,
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
    <SingleExampleContainer label="w/ leadingVisual passed">
      <Token text="Default Token" leadingVisual={() => <VerifiedIcon size={12} />} />
    </SingleExampleContainer>
    <SingleExampleContainer label="isSelected">
      <Token text="Default Token" isSelected={true} />
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
    <SingleExampleContainer label="w/ onRemove passed and the token is interactive">
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
    <SingleExampleContainer label="size options">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <Token
          size="small"
          text="'small' Token"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <Token
          size="medium"
          text="'medium' Token"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <Token
          size="large"
          text="'large' Token (default)"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <Token
          size="xlarge"
          text="'xlarge' Token"
          onRemove={() => {
            console.log('remove me')
          }}
        />
      </Box>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const profileToken = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Resting">
      <ProfileToken avatarSrc="https://avatars.githubusercontent.com/mperrotti" text="Mike Perrotti" />
    </SingleExampleContainer>
    <SingleExampleContainer label="isSelected">
      <ProfileToken
        avatarSrc="https://avatars.githubusercontent.com/mperrotti"
        text="Mike Perrotti"
        isSelected={true}
      />
    </SingleExampleContainer>
    <SingleExampleContainer label="Interactive">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <ProfileToken
          as="a"
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          href="http://google.com/"
          text="Link"
        />
        <ProfileToken
          as="button"
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          onClick={() => console.log('clicked')}
          text="Button"
        />
        <ProfileToken
          as="span"
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          tabIndex={0}
          onFocus={() => console.log('focused')}
          text="Focusable Span"
        />
      </Box>
    </SingleExampleContainer>
    <SingleExampleContainer label="w/ onRemove passed">
      <ProfileToken
        avatarSrc="https://avatars.githubusercontent.com/mperrotti"
        text="Mike Perrotti"
        onRemove={() => {
          console.log('remove me')
        }}
      />
    </SingleExampleContainer>
    <SingleExampleContainer label="w/ onRemove passed and the token is interactive">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <ProfileToken
          as="a"
          href="http://google.com/"
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          text="Link"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <ProfileToken
          as="button"
          onClick={() => console.log('clicked')}
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          text="Button"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <ProfileToken
          as="span"
          tabIndex={0}
          onFocus={() => console.log('focused')}
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          text="Focusable Span"
          onRemove={() => {
            console.log('remove me')
          }}
        />
      </Box>
    </SingleExampleContainer>
    <SingleExampleContainer label="size options">
      <Box
        display="flex"
        sx={{
          alignItems: 'start',
          gap: get('space.2')
        }}
      >
        <ProfileToken
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          size="small"
          text="'small' Token"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <ProfileToken
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          size="medium"
          text="'medium' Token"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <ProfileToken
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          size="large"
          text="'large' Token (default)"
          onRemove={() => {
            console.log('remove me')
          }}
        />
        <ProfileToken
          avatarSrc="https://avatars.githubusercontent.com/mperrotti"
          size="xlarge"
          text="'xlarge' Token"
          onRemove={() => {
            console.log('remove me')
          }}
        />
      </Box>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const labelToken = () => {
  const label = 'Color'
  const defaultValue = '#0366d6'
  const groupId = 'labelToken'
  const value = color(label, defaultValue, groupId)

  return (
    <ExampleCollectionContainer>
      <Text fontSize={1} color="fg.subtle">
        Hint: use the "Knobs" tab in the Addons panel to change the token colors
      </Text>
      <SingleExampleContainer label="Default">
        <IssueLabelToken text="good first issue" fillColor={value} />
      </SingleExampleContainer>
      <SingleExampleContainer label="isSelected">
        <IssueLabelToken text="good first issue" fillColor={value} isSelected={true} />
      </SingleExampleContainer>
      <SingleExampleContainer label="Interactive">
        <Box
          display="flex"
          sx={{
            alignItems: 'start',
            gap: get('space.2')
          }}
        >
          <IssueLabelToken fillColor={value} as="a" href="http://google.com/" text="Link" />
          <IssueLabelToken fillColor={value} as="button" onClick={() => console.log('clicked')} text="Button" />
          <IssueLabelToken
            fillColor={value}
            as="span"
            tabIndex={0}
            onFocus={() => console.log('focused')}
            text="Focusable Span"
          />
        </Box>
      </SingleExampleContainer>
      <SingleExampleContainer label="w/ onRemove passed">
        <IssueLabelToken
          text="good first issue"
          fillColor={value}
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
            fillColor={value}
            onRemove={() => {
              console.log('remove me')
            }}
          />
          <IssueLabelToken
            as="button"
            onClick={() => console.log('clicked')}
            text="good first issue"
            fillColor={value}
            onRemove={() => {
              console.log('remove me')
            }}
          />
          <IssueLabelToken
            as="span"
            tabIndex={0}
            onFocus={() => console.log('focused')}
            text="good first issue"
            fillColor={value}
            onRemove={() => {
              console.log('remove me')
            }}
          />
        </Box>
      </SingleExampleContainer>
      <SingleExampleContainer label="size options">
        <Box
          display="flex"
          sx={{
            alignItems: 'start',
            gap: get('space.2')
          }}
        >
          <IssueLabelToken
            fillColor={value}
            size="small"
            text="'small' Token"
            onRemove={() => {
              console.log('remove me')
            }}
          />
          <IssueLabelToken
            fillColor={value}
            size="medium"
            text="'medium' Token"
            onRemove={() => {
              console.log('remove me')
            }}
          />
          <IssueLabelToken
            fillColor={value}
            size="large"
            text="'large' Token (default)"
            onRemove={() => {
              console.log('remove me')
            }}
          />
          <IssueLabelToken
            fillColor={value}
            size="xlarge"
            text="'xlarge' Token"
            onRemove={() => {
              console.log('remove me')
            }}
          />
        </Box>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}
