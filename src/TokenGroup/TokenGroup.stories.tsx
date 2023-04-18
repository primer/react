import React from 'react'
import TokenGroup from './TokenGroup'
import {Meta, Story} from '@storybook/react'

const meta: Meta = {
  title: 'Components/TokenGroup',
  component: TokenGroup,
  decorators: [
    Story => {
      return (
        <>
          <Story />
        </>
      )
    },
  ],
}

export const Default: Story = args => (
  <TokenGroup {...args}>
    <button key="One" data-targetid="One">
      One
    </button>
    <button key="Two" data-targetid="Two">
      Two
    </button>
    <button key="Three" data-targetid="Three">
      Three
    </button>
    <button key="Four" data-targetid="Four">
      Four
    </button>
    <button key="Five" data-targetid="Five">
      Five
    </button>
    <button key="Six" data-targetid="Six">
      Six
    </button>
    <button key="Seven" data-targetid="Seven">
      Seven
    </button>
    <button key="Eight" data-targetid="Eight">
      Eight
    </button>
    <button key="Nine" data-targetid="Nine">
      Nine
    </button>
    <button key="Ten" data-targetid="Ten">
      Ten
    </button>
  </TokenGroup>
)

export default meta
