import type {Meta} from '@storybook/react-vite'
import {BaseDialog} from '../experimental'

export default {
  title: 'Experimental/Components/BaseDialog/Features',
} as Meta

export const FocusOnHeading = () => (
  <BaseDialog>
    <BaseDialog.Trigger>Open dialog</BaseDialog.Trigger>
    <BaseDialog.Dialog>
      <BaseDialog.Heading autoFocus>Focus on heading</BaseDialog.Heading>
      <BaseDialog.Content>
        When this dialog opens, focus is placed on the heading instead of the close button.
      </BaseDialog.Content>
      <BaseDialog.Close>Close</BaseDialog.Close>
    </BaseDialog.Dialog>
  </BaseDialog>
)

export const Nonmodal = () => (
  <BaseDialog nonmodal>
    <BaseDialog.Trigger>Open dialog</BaseDialog.Trigger>
    <BaseDialog.Dialog>
      <BaseDialog.Heading>Non-modal dialog</BaseDialog.Heading>
      <BaseDialog.Content>
        This dialog opens as a non-modal, allowing interaction with the rest of the page while open.
      </BaseDialog.Content>
      <BaseDialog.Close>Close</BaseDialog.Close>
    </BaseDialog.Dialog>
  </BaseDialog>
)
