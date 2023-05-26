import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import {BaseStyles, SSRProvider, ThemeProvider} from '..'
import {ItemInput} from '../FilteredActionList'
import {SelectPanel} from '../SelectPanel'
import theme from '../theme'
import {behavesAsComponent, checkExports} from '../utils/testing'

expect.extend(toHaveNoViolations)

const items = [{text: 'Foo'}, {text: 'Bar'}, {text: 'Baz'}, {text: 'Bon'}] as ItemInput[]

function SimpleSelectPanel(): JSX.Element {
  const [selected, setSelected] = React.useState<ItemInput[]>([])
  const [, setFilter] = React.useState('')
  const [open, setOpen] = React.useState(false)

  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
        <BaseStyles>
          <SelectPanel
            items={items}
            placeholder="Select Items"
            placeholderText="Filter Items"
            selected={selected}
            onSelectedChange={setSelected}
            onFilterChange={setFilter}
            open={open}
            onOpenChange={setOpen}
          />
          <div id="portal-root"></div>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('SelectPanel', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  behavesAsComponent({
    Component: SelectPanel,
    options: {skipAs: true, skipSx: true},
    toRender: () => <SimpleSelectPanel />,
  })

  checkExports('SelectPanel', {
    default: undefined,
    SelectPanel,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleSelectPanel />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
