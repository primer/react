import React from 'react'
import {Meta} from '@storybook/react'
import {MarkGithubIcon} from '@primer/octicons-react'

import {get} from '../constants'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'
import Text from '../Text'

import NewLabel from '../NewLabel/NewLabel'
import NewStateLabel from '../NewLabel/NewStateLabel'

export default {
  title: 'Prototyping/NewLabel',

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
    <Box
      display="flex"
      sx={{
        alignItems: 'start',
        gap: get('space.1')
      }}
    >
      {children}
    </Box>
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

export const label = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Neutral colors">
      <NewLabel>Default</NewLabel>
      <NewLabel color="primary">Primary</NewLabel>
      <NewLabel color="secondary">Secondary</NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Neutral colors (filled)">
      <NewLabel filled>Default</NewLabel>
      <NewLabel color="primary" filled>
        Primary
      </NewLabel>
      <NewLabel color="secondary" filled>
        Secondary
      </NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors">
      <NewLabel color="accent">Info</NewLabel>
      <NewLabel color="success">Success</NewLabel>
      <NewLabel color="attention">Warning</NewLabel>
      <NewLabel color="severe">Severe</NewLabel>
      <NewLabel color="danger">Danger</NewLabel>
      <NewLabel color="done">Done</NewLabel>
      <NewLabel color="sponsors">Sponsors</NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors (filled)">
      <NewLabel color="accent" filled>
        Info
      </NewLabel>
      <NewLabel color="success" filled>
        Success
      </NewLabel>
      <NewLabel color="attention" filled>
        Warning
      </NewLabel>
      <NewLabel color="severe" filled>
        Severe
      </NewLabel>
      <NewLabel color="danger" filled>
        Danger
      </NewLabel>
      <NewLabel color="done" filled>
        Done
      </NewLabel>
      <NewLabel color="sponsors" filled>
        Sponsors
      </NewLabel>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const labelWithLeadingVisual = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Neutral colors">
      <NewLabel leadingVisual={MarkGithubIcon}>Default</NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="primary">
        Primary
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="secondary">
        Secondary
      </NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Neutral colors (filled)">
      <NewLabel leadingVisual={MarkGithubIcon} filled>
        Default
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="primary" filled>
        Primary
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="secondary" filled>
        Secondary
      </NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors">
      <NewLabel leadingVisual={MarkGithubIcon} color="accent">
        Info
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="success">
        Success
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="attention">
        Warning
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="severe">
        Severe
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="danger">
        Danger
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="done">
        Done
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="sponsors">
        Sponsors
      </NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors (filled)">
      <NewLabel leadingVisual={MarkGithubIcon} color="accent" filled>
        Info
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="success" filled>
        Success
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="attention" filled>
        Warning
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="severe" filled>
        Severe
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="danger" filled>
        Danger
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="done" filled>
        Done
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="sponsors" filled>
        Sponsors
      </NewLabel>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

labelWithLeadingVisual.storyName = 'Badge with leadingVisual'

export const asACounter = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Neutral colors">
      <NewLabel filled>42</NewLabel>
      <NewLabel color="primary" filled>
        42
      </NewLabel>
      <NewLabel color="secondary" filled>
        42
      </NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors">
      <NewLabel color="accent" filled>
        42
      </NewLabel>
      <NewLabel color="success" filled>
        42
      </NewLabel>
      <NewLabel color="attention" filled>
        42
      </NewLabel>
      <NewLabel color="severe" filled>
        42
      </NewLabel>
      <NewLabel color="danger" filled>
        42
      </NewLabel>
      <NewLabel color="done" filled>
        42
      </NewLabel>
      <NewLabel color="sponsors" filled>
        42
      </NewLabel>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const asCounterWithLeadingVisual = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Neutral colors">
      <NewLabel leadingVisual={MarkGithubIcon} filled>
        42
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="primary" filled>
        42
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="secondary" filled>
        42
      </NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors">
      <NewLabel leadingVisual={MarkGithubIcon} color="accent" filled>
        42
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="success" filled>
        42
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="attention" filled>
        42
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="severe" filled>
        42
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="danger" filled>
        42
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="done" filled>
        42
      </NewLabel>
      <NewLabel leadingVisual={MarkGithubIcon} color="sponsors" filled>
        42
      </NewLabel>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

asCounterWithLeadingVisual.storyName = 'As A counter with leadingVisual'

export const stateLabel = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="States">
      <NewStateLabel status="issueClosed">Issue Closed</NewStateLabel>
      <NewStateLabel status="pullClosed">Pull Closed</NewStateLabel>
      <NewStateLabel status="pullMerged">Pull Merged</NewStateLabel>
      <NewStateLabel status="issueOpened">Issue Opened</NewStateLabel>
      <NewStateLabel status="pullOpened">Pull Opened</NewStateLabel>
      <NewStateLabel status="draft">Draft</NewStateLabel>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

stateLabel.storyName = 'StateLabel'

export const labelSizes = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Size options">
      <NewLabel size="sm">Small (default)</NewLabel>
      <NewLabel size="md">Medium</NewLabel>
      <NewLabel size="lg">Large</NewLabel>
    </SingleExampleContainer>
    <SingleExampleContainer label="Size options (with leadingVisual)">
      <NewLabel size="sm">Small (default)</NewLabel>
      <NewLabel size="md" leadingVisual={MarkGithubIcon}>
        Medium
      </NewLabel>
      <NewLabel size="lg" leadingVisual={MarkGithubIcon}>
        Large
      </NewLabel>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)
