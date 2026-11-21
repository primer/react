import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'button_base',
  name: 'ButtonBase',
  status: 'stable',
  a11yReviewed: false,
  importPath: '@primer/react',
  stories: [],
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Render a different element or component. The result should be a button, anchor, or summary.',
      required: false,
      defaultValue: "'button'",
    },
    {name: 'children', type: 'React.ReactNode', description: 'The button label.', required: false},
    {
      name: 'variant',
      type: "'default' | 'primary' | 'invisible' | 'danger' | 'link'",
      description: 'The visual style of the button.',
      required: false,
      defaultValue: "'default'",
    },
    {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      description: 'The size of the button and its text.',
      required: false,
      defaultValue: "'medium'",
    },
    {
      name: 'alignContent',
      type: "'start' | 'center'",
      description: 'How to align the label and visuals within the button.',
      required: false,
      defaultValue: "'center'",
    },
    {
      name: 'block',
      type: 'boolean',
      description: 'Fill the width of the container.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: 'Disable the default native button. This prop does not disable an anchor.',
      required: false,
    },
    {
      name: 'inactive',
      type: 'boolean',
      description: 'Use inactive styling without disabling interaction.',
      required: false,
    },
    {
      name: 'labelWrap',
      type: 'boolean',
      description: 'Allow the label to wrap onto multiple lines.',
      required: false,
    },
    {
      name: 'loading',
      type: 'boolean',
      description:
        'Show a spinner, announce loading to screen readers, and suppress the supplied click handler. This does not prevent the default action of the rendered element.',
      required: false,
    },
    {
      name: 'loadingAnnouncement',
      type: 'string',
      description: 'The text that screen readers announce while loading.',
      required: false,
      defaultValue: "'Loading'",
    },
    {
      name: 'icon',
      type: 'React.ReactNode | React.ComponentType<IconProps> | React.ExoticComponent<IconProps>',
      description:
        'Render an icon instead of the label and visuals. Provide an accessible name for an icon-only button.',
      required: false,
    },
    {
      name: 'leadingVisual',
      type: 'React.ElementType | React.ReactElement | null',
      description: 'A visual before the label.',
      required: false,
    },
    {
      name: 'trailingVisual',
      type: 'React.ElementType | React.ReactElement | null',
      description: 'A visual after the label. It takes the place of the counter when both are supplied.',
      required: false,
    },
    {
      name: 'trailingAction',
      type: 'React.ElementType | null',
      description: 'A visual at the end of the button, after the trailing visual.',
      required: false,
    },
    {
      name: 'count',
      type: 'number | string',
      description: 'A count after the label when no trailing visual is supplied.',
      required: false,
    },
    {
      name: 'notificationIndicator',
      type: "'button' | 'leadingVisual' | 'icon'",
      description:
        'Show a visual indicator for new activity on the button or leading visual. Use `leadingVisual` with a leading visual. The `icon` placement uses `IconButton` styling. Communicate the meaning through an accessible name or description.',
      required: false,
    },
    {
      name: 'onClick',
      type: 'React.MouseEventHandler<HTMLButtonElement>',
      description: 'Handle a click on the rendered element. This handler is not attached while loading.',
      required: false,
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLButtonElement> | React.Ref<HTMLAnchorElement>',
      description: 'A ref to the rendered button or anchor. For a different `as` target, use its ref type.',
      required: false,
    },
  ],
  subcomponents: [],
  passthrough: {element: 'button', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes'},
})
