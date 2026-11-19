import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'header',
  name: 'Header',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [],
  importPath: '@primer/react',
  props: [],
  subcomponents: [
    {
      name: 'Header.Item',
      props: [
        {
          name: 'full',
          type: 'string',
          defaultValue: '',
          description: 'Stretches item to fill the available space',
          required: false,
        },
      ],
      displayName: 'Item',
    },
    {
      name: 'Header.Link',
      props: [
        {name: 'href', type: 'string', defaultValue: '', description: 'URL to be used for the Link', required: false},
        {
          name: 'as',
          type: 'React.ElementType',
          defaultValue: '"a"',
          description: 'Element or component to render instead of the default anchor.',
          required: false,
        },
      ],
      passthrough: {element: 'a', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes'},
      displayName: 'Link',
    },
  ],
})
