import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'announce',
  name: 'Announce',
  status: 'alpha',
  a11yReviewed: false,
  importPath: '@primer/react/experimental',
  stories: [
    'experimental-components-announce--default',
    'experimental-components-announce--playground',
    'experimental-components-announce-features--visually-hidden-story',
    'experimental-components-announce-features--with-delay',
  ],
  props: [
    {
      name: 'as',
      type: 'React.ElementType',
      description:
        'Element or component to render. A custom component must attach the supplied ref to its DOM element.',
      required: false,
      defaultValue: "'div'",
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Content to render. Changes to its text can be announced to screen readers.',
      required: false,
    },
    {
      name: 'aria-label',
      type: 'string',
      description: 'Text to announce instead of the text content of the element.',
      required: false,
    },
    {
      name: 'announceOnShow',
      type: 'boolean',
      description: 'Announce the initial content if it is visible when the component mounts.',
      required: false,
      defaultValue: 'true',
    },
    {
      name: 'hidden',
      type: 'boolean',
      description: 'Suppress announcements without hiding the rendered content.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'delayMs',
      type: 'number',
      description: 'Delay in milliseconds before a polite announcement. Ignored for assertive announcements.',
      required: false,
    },
    {
      name: 'politeness',
      type: "'assertive' | 'polite'",
      description: 'Politeness level to use for the announcement.',
      required: false,
      defaultValue: "'polite'",
    },
  ],
  subcomponents: [],
})
