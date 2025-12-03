import Breadcrumbs from './Breadcrumbs'
import figma from '@figma/code-connect'

figma.connect(
  Breadcrumbs,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?m=auto&node-id=20135-70690&t=39jWyeflbJqVh77d-1',
  {
    props: {
      children: figma.children([
        '1st parent',
        '2nd parent',
        '3rd parent',
        '4th parent',
        '5th parent',
        '6th parent',
        '7th parent',
        '8th parent',
        '9th parent',
        'Current page',
      ]),
    },
    example: ({children}) => <Breadcrumbs>{children}</Breadcrumbs>,
  },
)

/**
 * BreadcrumbsItem
 */
figma.connect(Breadcrumbs.Item, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=34258-144883', {
  props: {
    selected: figma.boolean('selected'),
    label: figma.textContent('label'),
  },
  example: ({selected, label}) => (
    <Breadcrumbs.Item href="#" selected={selected}>
      {label}
    </Breadcrumbs.Item>
  ),
})
