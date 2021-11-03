import React from 'react'
import {Meta} from '@storybook/react'
import {MarkGithubIcon} from '@primer/octicons-react'

import {get} from '../constants'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'
import Text from '../Text'

import Label2 from '../Label2/Label2'
import StateLabel2 from '../Label2/StateLabel2'

export default {
  title: 'Prototyping/Label2',

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
      <Text fontSize={0} color="fg.muted">
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
      <Label2>Default</Label2>
      <Label2 color="primary">Primary</Label2>
      <Label2 color="secondary">Secondary</Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Neutral colors (filled)">
      <Label2 filled>Default</Label2>
      <Label2 color="primary" filled>
        Primary
      </Label2>
      <Label2 color="secondary" filled>
        Secondary
      </Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors">
      <Label2 color="accent">Info</Label2>
      <Label2 color="success">Success</Label2>
      <Label2 color="attention">Warning</Label2>
      <Label2 color="severe">Severe</Label2>
      <Label2 color="danger">Danger</Label2>
      <Label2 color="done">Done</Label2>
      <Label2 color="sponsors">Sponsors</Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors (filled)">
      <Label2 color="accent" filled>
        Info
      </Label2>
      <Label2 color="success" filled>
        Success
      </Label2>
      <Label2 color="attention" filled>
        Warning
      </Label2>
      <Label2 color="severe" filled>
        Severe
      </Label2>
      <Label2 color="danger" filled>
        Danger
      </Label2>
      <Label2 color="done" filled>
        Done
      </Label2>
      <Label2 color="sponsors" filled>
        Sponsors
      </Label2>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const labelWithLeadingVisual = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Neutral colors">
      <Label2 leadingVisual={MarkGithubIcon}>Default</Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="primary">
        Primary
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="secondary">
        Secondary
      </Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Neutral colors (filled)">
      <Label2 leadingVisual={MarkGithubIcon} filled>
        Default
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="primary" filled>
        Primary
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="secondary" filled>
        Secondary
      </Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors">
      <Label2 leadingVisual={MarkGithubIcon} color="accent">
        Info
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="success">
        Success
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="attention">
        Warning
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="severe">
        Severe
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="danger">
        Danger
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="done">
        Done
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="sponsors">
        Sponsors
      </Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors (filled)">
      <Label2 leadingVisual={MarkGithubIcon} color="accent" filled>
        Info
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="success" filled>
        Success
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="attention" filled>
        Warning
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="severe" filled>
        Severe
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="danger" filled>
        Danger
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="done" filled>
        Done
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="sponsors" filled>
        Sponsors
      </Label2>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

labelWithLeadingVisual.storyName = 'Badge with leadingVisual'

export const asACounter = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Neutral colors">
      <Label2 filled>42</Label2>
      <Label2 color="primary" filled>
        42
      </Label2>
      <Label2 color="secondary" filled>
        42
      </Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors">
      <Label2 color="accent" filled>
        42
      </Label2>
      <Label2 color="success" filled>
        42
      </Label2>
      <Label2 color="attention" filled>
        42
      </Label2>
      <Label2 color="severe" filled>
        42
      </Label2>
      <Label2 color="danger" filled>
        42
      </Label2>
      <Label2 color="done" filled>
        42
      </Label2>
      <Label2 color="sponsors" filled>
        42
      </Label2>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

export const asCounterWithLeadingVisual = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Neutral colors">
      <Label2 leadingVisual={MarkGithubIcon} filled>
        42
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="primary" filled>
        42
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="secondary" filled>
        42
      </Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Functional colors">
      <Label2 leadingVisual={MarkGithubIcon} color="accent" filled>
        42
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="success" filled>
        42
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="attention" filled>
        42
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="severe" filled>
        42
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="danger" filled>
        42
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="done" filled>
        42
      </Label2>
      <Label2 leadingVisual={MarkGithubIcon} color="sponsors" filled>
        42
      </Label2>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

asCounterWithLeadingVisual.storyName = 'As A counter with leadingVisual'

export const stateLabel = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="States">
      <StateLabel2 status="issueClosed">Issue Closed</StateLabel2>
      <StateLabel2 status="pullClosed">Pull Closed</StateLabel2>
      <StateLabel2 status="pullMerged">Pull Merged</StateLabel2>
      <StateLabel2 status="issueOpened">Issue Opened</StateLabel2>
      <StateLabel2 status="pullOpened">Pull Opened</StateLabel2>
      <StateLabel2 status="draft">Draft</StateLabel2>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)

stateLabel.storyName = 'StateLabel'

export const labelSizes = () => (
  <ExampleCollectionContainer>
    <SingleExampleContainer label="Size options">
      <Label2 size="sm">Small (default)</Label2>
      <Label2 size="md">Medium</Label2>
      <Label2 size="lg">Large</Label2>
    </SingleExampleContainer>
    <SingleExampleContainer label="Size options (with leadingVisual)">
      <Label2 size="sm">Small (default)</Label2>
      <Label2 size="md" leadingVisual={MarkGithubIcon}>
        Medium
      </Label2>
      <Label2 size="lg" leadingVisual={MarkGithubIcon}>
        Large
      </Label2>
    </SingleExampleContainer>
  </ExampleCollectionContainer>
)
