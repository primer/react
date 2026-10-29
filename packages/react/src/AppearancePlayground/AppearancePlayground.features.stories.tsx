import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {AppearancePlayground} from '../experimental'
import {Button} from '../Button'

const meta = {
  title: 'Components/AppearancePlayground/Features',
  component: AppearancePlayground,
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof AppearancePlayground>

export default meta
type Story = StoryObj<typeof meta>

export const IndependentInstances: Story = {
  render: () => {
    const [mounted, setMounted] = useState(true)
    return (
      <>
        <Button onClick={() => setMounted(value => !value)}>Toggle first preview</Button>
        {mounted && (
          <AppearancePlayground aria-label="First preview" style={{minHeight: 0}}>
            <Button>First app</Button>
          </AppearancePlayground>
        )}
        <AppearancePlayground aria-label="Second preview" style={{minHeight: 0}}>
          <Button>Second app</Button>
        </AppearancePlayground>
      </>
    )
  },
}
