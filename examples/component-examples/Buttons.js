import React from 'react'
import ExampleHeading from '../doc-components/ExampleHeading'
import {Block, Button, ButtonLink, ButtonDanger, ButtonPrimary, ButtonOutline, OcticonButton, Text} from '../../src'
import {Hubot, Pencil, X} from '@githubprimer/octicons-react'

const ButtonExample = {
  name: 'Buttons',
  element: (
    <Block p={4}>
      <Block mb={2}>
        <Button> Button </Button>
      </Block>
      <Block mb={2}>
        <Button size="sm"> Button small </Button>
      </Block>
      <Block mb={2}>
        <Button size="large"> Button large </Button>
      </Block>
      <Block mb={2}>
        <ButtonDanger> ButtonDanger </ButtonDanger>
      </Block>
      <Block mb={2}>
        <ButtonPrimary> ButtonPrimary </ButtonPrimary>
      </Block>
      <Block mb={2}>
        <ButtonOutline> ButtonOutline </ButtonOutline>
      </Block>
      <Block mb={2}>
        <Button block> Button block </Button>
      </Block>
      <Block mb={2}>
        <Button linkStyle> Button linkStyle </Button>
      </Block>
      <Block mb={2}>
        <ButtonLink href="https://www.goatslive.com/">This is an {'<a>'} styled as a button</ButtonLink>
      </Block>
      <Block mb={2}>
        <ExampleHeading>Octicon Buttons</ExampleHeading>
        <OcticonButton icon={Pencil} label="Edit" onClick={() => alert('edit')} mr={3} />
        <Text color="red">
          <OcticonButton icon={X} label="Close" onClick={() => alert('close')} mr={3} />
        </Text>
        <Block>
          <OcticonButton icon={Hubot} size="large" label="ROBOT" onClick={() => alert('beep boop')} />
        </Block>
      </Block>
    </Block>
  )
}

export default ButtonExample
