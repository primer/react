import type {Meta, StoryObj} from '@storybook/react-vite'
import {Blankslate, BlankslateDescription, BlankslateHeading} from './Blankslate'
const meta = {
  title: 'Content/Blankslate',
  component: Blankslate,
  render: args => (
    <Blankslate {...args}>
      <BlankslateHeading>No results</BlankslateHeading>
      <BlankslateDescription>Try a different search.</BlankslateDescription>
    </Blankslate>
  ),
} satisfies Meta<typeof Blankslate>
export default meta
export const Default: StoryObj<typeof meta> = {}
export const Playground: StoryObj<typeof meta> = {args: {border: true, spacious: true}}
