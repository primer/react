import type {Meta, StoryFn} from '@storybook/react-vite'
import {BaseDialog} from '../experimental'

const meta: Meta<typeof BaseDialog> = {
  title: 'Experimental/Components/BaseDialog',
  component: BaseDialog,
  subcomponents: {
    'BaseDialog.Trigger': BaseDialog.Trigger,
    'BaseDialog.Dialog': BaseDialog.Dialog,
    'BaseDialog.Close': BaseDialog.Close,
    'BaseDialog.Heading': BaseDialog.Heading,
    'BaseDialog.Content': BaseDialog.Content,
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
}

export default meta

export const Default = () => (
  <BaseDialog>
    <BaseDialog.Trigger>Open dialog</BaseDialog.Trigger>
    <BaseDialog.Dialog>
      <BaseDialog.Heading>Base dialog</BaseDialog.Heading>
      <BaseDialog.Content>This dialog is opened and closed with declarative button commands.</BaseDialog.Content>
      <BaseDialog.Close>Close</BaseDialog.Close>
    </BaseDialog.Dialog>
  </BaseDialog>
)

export const Playground: StoryFn<typeof BaseDialog> = args => (
  <BaseDialog {...args}>
    <BaseDialog.Trigger>Open dialog</BaseDialog.Trigger>
    <BaseDialog.Dialog>
      <BaseDialog.Heading>Base dialog</BaseDialog.Heading>
      <BaseDialog.Content>
        Set <code>nonmodal</code> to open the dialog without making it modal.
      </BaseDialog.Content>
      <BaseDialog.Close>Close</BaseDialog.Close>
    </BaseDialog.Dialog>
  </BaseDialog>
)

Playground.args = {
  nonmodal: false,
}

Playground.argTypes = {
  nonmodal: {
    control: {
      type: 'boolean',
    },
  },
}
