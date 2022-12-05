import {Button} from '@primer/react'
import {Button as DeprecatedButton, ButtonClose} from '@primer/react/deprecated'
import {TreeView} from '@primer/react/drafts'
import React from 'react'

export default function IndexPage() {
  return (
    <>
      <article>
        <header>Stable</header>
        <Button>Hello world</Button>
      </article>
      <article>
        <header>Draft</header>
        <TreeView>
          <TreeView.Item id="item-one">Item one</TreeView.Item>
          <TreeView.Item id="item-two">Item two</TreeView.Item>
          <TreeView.Item id="item-three">Item three</TreeView.Item>
        </TreeView>
      </article>
      <article>
        <header>Deprecated</header>
        <DeprecatedButton>Hello world</DeprecatedButton>
        <ButtonClose></ButtonClose>
      </article>
    </>
  )
}
