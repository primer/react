import * as PrimerReactLibrary from '../index'
import {makeLiveEditStory} from 'storybook-addon-code-editor'
import type {Meta, StoryObj} from '@storybook/react'
import storyCode from './Avatar.source.tsx?raw'

const meta = {
  // Story defaults
  title: 'Components/Avatar',
} satisfies Meta<typeof PrimerReactLibrary.Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  // Story config
}

makeLiveEditStory(Default, {
  availableImports: {'@primer/react': PrimerReactLibrary},
  code: storyCode,
})
