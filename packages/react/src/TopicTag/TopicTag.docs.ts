import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'topic_tag',
  name: 'TopicTag',
  status: 'draft',
  a11yReviewed: false,
  stories: [],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'The HTML element or React component to render as the root element',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Provide a class name for styling on the outermost element',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'TopicTag.Group',
      props: [
        {
          name: 'className',
          type: 'string',
          description: 'Provide a class name for styling on the outermost element',
          required: false,
        },
      ],
      displayName: 'Group',
    },
  ],
})
