import React from 'react'
import { Block, Button, ButtonLink, ButtonDanger, ButtonPrimary, ButtonOutline } from '../../src'

const ButtonExample =
{
  name: 'Buttons',
  element: (
    <div>
      <Block mb={2}>
        <Button> Button </Button>
      </Block>
      <Block mb={2}>
        <Button size='sm'> Button small </Button>
      </Block>
      <Block mb={2}>
        <Button size='large'> Button large </Button>
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
        <ButtonLink href='https://www.goatslive.com/'>This is an {'<a>'} styled as a button</ButtonLink>
      </Block>
    </div>
  )
}

export default ButtonExample
