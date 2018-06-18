import React from 'react'
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live'
import Page from './Page'
import {
  Avatar,
  Block,
  Box,
  Button,
  ButtonDanger,
  ButtonPrimary,
  ButtonOutline,
  ButtonLink,
  BranchName,
  Caret,
  CaretBox,
  CircleOcticon,
  CounterLabel,
  Details,
  DonutChart,
  DonutSlice,
  Dropdown,
  Flash,
  Heading,
  TextInput,
  Label,
  Link,
  MergeStatus,
  StateLabel,
  Text,
  Tooltip,
  theme
} from '../src'

const scope = {
  Avatar,
  Block,
  Box,
  Button,
  ButtonDanger,
  ButtonPrimary,
  ButtonOutline,
  ButtonLink,
  BranchName,
  Caret,
  CaretBox,
  CircleOcticon,
  CounterLabel,
  Details,
  DonutChart,
  DonutSlice,
  Dropdown,
  Flash,
  Heading,
  TextInput,
  Label,
  Link,
  MergeStatus,
  StateLabel,
  Text,
  Tooltip,
  theme
}

const code = `
  <Block>
    <Heading>Hello World!</Heading>
    <Text>To get started with the Sandbox, start adding some primer-react components</Text>
  </Block>`

const SandboxPage = () => (
  <Page>
    <LiveProvider code={code} scope={scope}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  </Page>
)

export default SandboxPage
