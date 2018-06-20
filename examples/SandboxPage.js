import React from 'react'
import { LiveEditor } from '@compositor/kit'
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
  <Block p={4}>
    <Heading>Hello World!</Heading>
    <Text>To get started with the Sandbox, start adding some primer-react components</Text>
  </Block>`

const SandboxPage = () => <LiveEditor code={code} scope={scope}/>

export default SandboxPage
