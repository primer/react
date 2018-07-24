import React from 'react'
import {Hubot, Pencil, X} from '@githubprimer/octicons-react'
import {LiveEditor} from '@compositor/kit'
import ExampleHeading from '../doc-components/ExampleHeading'
import {Block, Button, ButtonLink, ButtonDanger, ButtonPrimary, ButtonOutline, OcticonButton, Text} from '../../src'

const ButtonExample = {
  name: 'Buttons',
  element: (
    <div>
      <Block mb={2}>
        <LiveEditor code={`<Button> Button </Button>`} scope={{Button}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<Button size="sm"> Button small </Button>`} scope={{Button}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<Button size="large"> Button large </Button>`} scope={{Button}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<ButtonDanger> ButtonDanger </ButtonDanger>`} scope={{ButtonDanger}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<ButtonPrimary> ButtonPrimary </ButtonPrimary>`} scope={{ButtonPrimary}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<ButtonOutline> ButtonOutline </ButtonOutline>`} scope={{ButtonOutline}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<Button block> Button block </Button>`} scope={{Button}} />
      </Block>
      <Block mb={2}>
        <LiveEditor code={`<Button linkStyle> Button linkStyle </Button>`} scope={{Button}} />
      </Block>
      <Block mb={2}>
        <LiveEditor
          code={`<ButtonLink href="https://www.goatslive.com/">This is an {'<a>'} styled as a button</ButtonLink>`}
          scope={{ButtonLink}}
        />
      </Block>
      <Block mb={2}>
        <ExampleHeading>Octicon Buttons</ExampleHeading>
        <LiveEditor
          code={`<OcticonButton icon={Pencil} label="Edit" onClick={() => alert('edit')} mr={3} />`}
          scope={{OcticonButton, Pencil}}
        />
        <LiveEditor
          code={`<Text color="red"><OcticonButton icon={X} label="Close" onClick={() => alert('close')} mr={3} /></Text>`}
          scope={{OcticonButton, Text, X}}
        />
        <Block>
          <LiveEditor
            code={`<OcticonButton icon={Hubot} size="large" label="ROBOT" onClick={() => alert('beep boop')} />`}
            scope={{OcticonButton, Hubot}}
          />
        </Block>
      </Block>
    </div>
  )
}

export default ButtonExample
