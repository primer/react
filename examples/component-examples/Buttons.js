import React from 'react'
import {Hubot, Pencil, X} from '@githubprimer/octicons-react'
import {LiveEditor} from '@compositor/kit'
import {ExampleHeading} from '../doc-components'
import {Box, Button, ButtonLink, ButtonDanger, ButtonPrimary, ButtonOutline, OcticonButton, Text} from '../../src'

const ButtonExample = {
  name: 'Buttons',
  element: (
    <div>
      <Box mb={2}>
        <LiveEditor code={`<Button> Button </Button>`} scope={{Button}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<Button size="sm"> Button small </Button>`} scope={{Button}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<Button size="large"> Button large </Button>`} scope={{Button}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<ButtonDanger> ButtonDanger </ButtonDanger>`} scope={{ButtonDanger}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<ButtonPrimary> ButtonPrimary </ButtonPrimary>`} scope={{ButtonPrimary}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<ButtonOutline> ButtonOutline </ButtonOutline>`} scope={{ButtonOutline}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<Button block> Button block </Button>`} scope={{Button}} />
      </Box>
      <Box mb={2}>
        <LiveEditor code={`<Button linkStyle> Button linkStyle </Button>`} scope={{Button}} />
      </Box>
      <Box mb={2}>
        <LiveEditor
          code={`<ButtonLink href="https://www.goatslive.com/">This is an {'<a>'} styled as a button</ButtonLink>`}
          scope={{ButtonLink}}
        />
      </Box>
      <Box mb={2}>
        <ExampleHeading>Octicon Buttons</ExampleHeading>
        <LiveEditor
          code={`<OcticonButton icon={Pencil} label="Edit" onClick={() => alert('edit')} mr={3} />`}
          scope={{OcticonButton, Pencil}}
        />
        <LiveEditor
          code={`<Text color="red.5"><OcticonButton icon={X} label="Close" onClick={() => alert('close')} mr={3} /></Text>`}
          scope={{OcticonButton, Text, X}}
        />
        <Box>
          <LiveEditor
            code={`<OcticonButton icon={Hubot} size="large" label="ROBOT" onClick={() => alert('beep boop')} />`}
            scope={{OcticonButton, Hubot}}
          />
        </Box>
      </Box>
    </div>
  )
}

export default ButtonExample
