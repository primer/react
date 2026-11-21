import {defineComponent} from '../../docs/component'

export default defineComponent({
  id: 'dialog',
  docsId: 'dialog',
  name: 'Dialog',
  status: 'deprecated',
  a11yReviewed: false,
  stories: ['components-dialog--default'],
  importPath: '@primer/react/deprecated',
  props: [
    {name: 'isOpen', type: 'boolean', description: 'Whether or not the dialog is open', required: false},
    {
      name: 'onDismiss',
      type: '() => void',
      description: 'Function that will be called when the dialog is closed',
      required: false,
    },
    {
      name: 'returnFocusRef',
      type: ' React.RefObject<HTMLElement>',
      description: 'The element to restore focus back to after the `Dialog` is closed',
      required: false,
    },
    {
      name: 'initialFocusRef',
      type: ' React.RefObject<HTMLElement>',
      description:
        "Element inside of the `Dialog` you'd like to be focused when the Dialog is opened. If nothing is passed to `initialFocusRef` the close button is focused.",
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description:
        'Pass an id to use for the aria-label. Use either a `aria-label` or an `aria-labelledby` but not both.',
      required: false,
    },
    {
      name: 'aria-label',
      type: 'string',
      description:
        'Pass a label to be used to describe the Dialog. Use either a `aria-label` or an `aria-labelledby` but not both.',
      required: false,
    },
    {
      name: 'narrow',
      type: 'boolean',
      description: 'Use the narrow dialog width unless `wide` is set.',
      required: false,
    },
    {name: 'wide', type: 'boolean', description: 'Use the wide dialog width.', required: false},
  ],
  subcomponents: [{name: 'Dialog.Header', props: [], displayName: 'Header'}],
})
