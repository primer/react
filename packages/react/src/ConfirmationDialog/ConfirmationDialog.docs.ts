import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'ConfirmationDialog',
  displayName: 'ConfirmationDialog',
  status: 'stable',
  keywords: [],
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'onClose',
      type: "(gesture: 'confirm' | 'close-button' | 'cancel' | 'escape') => void",
      description: 'Receives the gesture that requested dismissal.',
      required: true,
    },
    {name: 'title', type: 'React.ReactNode', description: 'Dialog title, usually a short question.', required: true},
    {
      name: 'cancelButtonContent',
      type: 'React.ReactNode',
      description: 'Content of the cancel button.',
      required: false,
      defaultValue: "'Cancel'",
    },
    {
      name: 'confirmButtonContent',
      type: 'React.ReactNode',
      description: 'Content of the confirm button.',
      required: false,
      defaultValue: "'OK'",
    },
    {
      name: 'confirmButtonType',
      type: "'normal' | 'primary' | 'danger'",
      description: 'Variant of the confirm button.',
      required: false,
      defaultValue: "'normal'",
    },
    {
      name: 'overrideButtonFocus',
      type: "'cancel' | 'confirm'",
      description:
        'Overrides initial focus. By default, danger confirmations focus cancel; other variants focus confirm.',
      required: false,
    },
    {name: 'className', type: 'string', description: 'Additional class name for the dialog.', required: false},
    {
      name: 'width',
      type: 'DialogWidth',
      description: 'Dialog width preset or CSS width.',
      required: false,
      defaultValue: "'medium'",
    },
    {
      name: 'height',
      type: 'DialogHeight',
      description: 'Dialog height preset.',
      required: false,
      defaultValue: "'auto'",
    },
    {
      name: 'cancelButtonLoading',
      type: 'boolean',
      description: 'Shows a loading state in the cancel button.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'confirmButtonLoading',
      type: 'boolean',
      description: 'Shows a loading state in the confirm button.',
      required: false,
      defaultValue: 'false',
    },
    {name: 'children', type: 'React.ReactNode', description: '', required: false},
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/confirmation-dialog/
    description: 'Give users a choice to confirm or cancel an important action.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/confirmation-dialog/guidelines/
        guidance: true,
        description:
          'Ask for confirmation when an action is destructive, irreversible, or has significant consequences.',
      },
    ],
    anatomy: [],
  },
})
