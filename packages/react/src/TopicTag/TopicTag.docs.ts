import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'TopicTag',
  displayName: 'TopicTag',
  status: 'experimental',
  keywords: [],
  stories: [],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      description: 'Element or component that renders the tag.',
      required: false,
      defaultValue: "'a'",
    },
    {name: 'className', type: 'string', description: 'Class name for the root element.', required: false},
  ],
  subcomponents: [
    {
      name: 'TopicTag.Group',
      displayName: 'TopicTag.Group',
      props: [{name: 'className', type: 'string', description: 'Class name for the group.', required: false}],
    },
  ],
  usage: {description: '', bestPractices: [], anatomy: []},
})
