import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {within, userEvent} from '@storybook/testing-library'
import {expect} from '@storybook/jest'
import {Default} from './features.stories'

export default {
  title: 'Drafts/Components/UnderlineNav/Interactions',
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Default.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const item = await canvas.getByText('Code')
  const aElem = await item.closest('a')
  const item2 = await canvas.getByText('Issues')
  const aElem2 = await item2.closest('a')
  userEvent.click(aElem2 as Element)
  expect(aElem2).toHaveAttribute('aria-current', 'page')
  userEvent.click(aElem as Element)
  expect(aElem).toHaveAttribute('aria-current', 'page')
}

export {Default}
