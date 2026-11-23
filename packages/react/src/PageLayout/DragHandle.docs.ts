import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'drag_handle',
  name: 'DragHandle',
  status: 'stable',
  a11yReviewed: false,
  importPath: '@primer/react',
  stories: ['components-pagelayout-dev--standalone-resize'],
  props: [
    {
      name: 'handleRef',
      type: 'React.RefObject<HTMLDivElement>',
      description: 'Ref to the slider element for updating its ARIA values during drag.',
      required: true,
    },
    {
      name: 'onDragStart',
      type: '(clientX: number) => void',
      description: 'Called when a pointer drag starts, with the initial horizontal pointer position.',
      required: true,
    },
    {
      name: 'onDrag',
      type: '(value: number, isKeyboard: boolean) => void',
      description:
        'Update the pane width in this callback. Pointer drags report the horizontal pointer position. Arrow keys report a signed change of three pixels.',
      required: true,
    },
    {
      name: 'onDragEnd',
      type: '() => void',
      description: 'Called when the pointer loses capture or an arrow key is released.',
      required: true,
    },
    {
      name: 'onDoubleClick',
      type: 'React.MouseEventHandler<HTMLDivElement>',
      description: 'Handle a double-click on the slider, for example to reset the pane width.',
      required: false,
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Accessible name for the slider. Ignored when `aria-labelledby` is provided.',
      required: false,
      defaultValue: "'Draggable pane splitter'",
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'ID of an element that names the slider. Takes precedence over `aria-label`.',
      required: false,
    },
    {
      name: 'aria-valuemin',
      type: 'number',
      description: 'Minimum value of the slider.',
      required: false,
    },
    {
      name: 'aria-valuemax',
      type: 'number',
      description: 'Maximum value of the slider.',
      required: false,
    },
    {
      name: 'aria-valuenow',
      type: 'number',
      description: 'Current value of the slider.',
      required: false,
    },
    {
      name: 'dragTargetRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to the pane or other element that receives temporary styles while dragging.',
      required: false,
    },
    {
      name: 'contentWrapperRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to a content wrapper that receives temporary CSS containment while dragging.',
      required: false,
    },
    {
      name: 'formatValueText',
      type: '(valueNow: number) => string',
      description: 'Formats the current width for `aria-valuetext`.',
      required: false,
      defaultValue: 'valueNow => `Pane width ${valueNow} pixels`',
    },
    {
      name: 'data-component',
      type: 'string',
      description: 'Value for the `data-component` attribute.',
      required: false,
      defaultValue: "'PageLayout.DragHandle'",
    },
  ],
  subcomponents: [],
})
