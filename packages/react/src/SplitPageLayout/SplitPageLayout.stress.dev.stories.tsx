import React from 'react'

import type {Meta} from '@storybook/react'
import type {ComponentProps} from '../utils/types'
import {StressTest} from '../utils/StressTest'
import {SplitPageLayout} from './SplitPageLayout'
import Heading from '../Heading'
import {NavList} from '../NavList'

export default {
  title: 'StressTests/Components/SplitPageLayout',
  component: SplitPageLayout,
} as Meta<ComponentProps<typeof SplitPageLayout>>

const totalIterations = 20

const scrollPaneToTop = () => {
  const pane = document.getElementById('pane')
  pane?.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const scrollPaneToBottom = () => {
  const pane = document.getElementById('pane')
  pane?.scrollTo({
    top: pane.scrollHeight,
    behavior: 'smooth',
  })
}

export const ScrollPane = () => {
  function getItems() {
    return Array.from({length: 200}, (_, i) => (
      <NavList.Item key={i} href="#" aria-current={i === 0 ? 'page' : undefined}>
        {`Item ${i + 1}`}
      </NavList.Item>
    ))
  }

  return (
    <StressTest
      componentName="SplitPageLayout"
      title="Simple pane scroll"
      description="Scrolling pane up and down with a lot of items."
      totalIterations={totalIterations}
      renderIteration={() => (
        <SplitPageLayout>
          <SplitPageLayout.Pane id="pane" position="start" aria-label="Navigation Pane">
            <Heading as="h2">Pane</Heading>
            <NavList aria-label="Pane navlist">{getItems()}</NavList>
          </SplitPageLayout.Pane>
          <SplitPageLayout.Content>
            <Heading as="h2">Content</Heading>
            <NavList aria-label="Content navlist">{getItems()}</NavList>
          </SplitPageLayout.Content>
        </SplitPageLayout>
      )}
      onIteration={count => {
        count % 2 === 0 ? scrollPaneToBottom() : scrollPaneToTop()
      }}
      ms={1000}
    />
  )
}
