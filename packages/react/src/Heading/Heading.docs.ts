import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'Heading',
  displayName: 'Heading',
  status: 'stable',
  keywords: [],
  stories: [],
  importPath: '@primer/react',
  props: [
    {
      name: 'as',
      type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
      description: 'Semantic heading level.',
      required: false,
      defaultValue: "'h2'",
    },
    {
      name: 'variant',
      type: "'large' | 'medium' | 'small'",
      description: 'Applies a typography style independently of the heading level.',
      required: false,
    },
  ],
  subcomponents: [],
  usage: {
    // Source: https://primer.style/product/components/heading/
    description: 'Title sections and subsections so readers can understand the structure of the page.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/heading/
        guidance: true,
        description: 'Choose heading levels that reflect how sections are nested.',
      },
      {
        // Source: https://primer.style/product/components/heading/
        guidance: false,
        description: 'Do not use a heading solely to change the appearance of text.',
      },
    ],
    anatomy: [],
  },
})
