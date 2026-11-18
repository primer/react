import {defineComponent} from '../../docs/components'

export default defineComponent({
  name: 'Dialog',
  displayName: 'Dialog',
  status: 'deprecated',
  keywords: [],
  stories: ['components-dialog--default'],
  importPath: '@primer/react/deprecated',
  props: [
    {name: 'isOpen', type: 'boolean', description: 'Renders the dialog and overlay when true.', required: false},
    {name: 'onDismiss', type: '() => void', description: 'Called when dismissal is requested.', required: false},
    {
      name: 'returnFocusRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Element to focus after dismissal.',
      required: false,
    },
    {
      name: 'initialFocusRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Element to focus when the dialog opens.',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'References the element providing the accessible name.',
      required: false,
    },
    {name: 'aria-label', type: 'string', description: 'Sets the accessible name directly.', required: false},
    {name: 'narrow', type: 'boolean', description: 'Uses the narrow width unless `wide` is set.', required: false},
    {name: 'wide', type: 'boolean', description: 'Uses the wide width.', required: false},
    {name: 'as', type: 'React.ElementType', description: '', required: false, defaultValue: "'div'"},
  ],
  subcomponents: [
    {
      name: 'Dialog.Header',
      displayName: 'Dialog.Header',
      props: [{name: 'as', type: 'React.ElementType', description: '', required: false, defaultValue: "'div'"}],
    },
  ],
  usage: {description: '', bestPractices: [], anatomy: []},
})
