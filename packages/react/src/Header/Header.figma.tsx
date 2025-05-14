import {Header} from '../'
import figma from '@figma/code-connect'

figma.connect(Header, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=26738%3A6196', {
  example: () => <Header />,
})
