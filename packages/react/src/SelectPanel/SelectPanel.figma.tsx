import {SelectPanel} from '../'
import figma from '@figma/code-connect'

figma.connect(SelectPanel, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=35402%3A46691', {
  example: () => (
    <SelectPanel
      items={[]}
      onOpenChange={() => {}}
      onFilterChange={() => {}}
      open={false}
      onSelectedChange={() => {}}
      selected={[]}
    />
  ),
})
