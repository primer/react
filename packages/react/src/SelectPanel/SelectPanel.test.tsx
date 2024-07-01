import {render as HTMLRender, fireEvent, getByRole, getByText} from '@testing-library/react'
import axe from 'axe-core'

import React from 'react'
import theme from '../theme'
import {SelectPanel} from '../SelectPanel'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, SSRProvider, ThemeProvider} from '..'
import type {ItemInput} from '../deprecated/ActionList/List'

function SimpleSelectPanel(): JSX.Element {
  const items = [
    {text: 'Foo', id: 'foo'},
    {text: 'Bar', id: 'bar'},
    {text: 'Baz', id: 'baz'},
    {text: 'Bon', id: 'bon'},
  ] as ItemInput[]

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
            overlayProps={{width: 'medium', height: 'medium'}}
          />
          <div id="portal-root"></div>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('SelectPanel', () => {
  const originalScrollTo = Element.prototype.scrollTo
  beforeAll(() => {
    Element.prototype.scrollTo = () => {}
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    Element.prototype.scrollTo = originalScrollTo
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
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should render selected items', () => {
    const item = HTMLRender(<SimpleSelectPanel />)
    const {container} = item
    const button = getByRole(container, 'button')
    expect(button).toBeTruthy()

    fireEvent.click(button)
    const selector = getByText(container, 'Foo')
    expect(selector).toBeVisible()

    fireEvent.click(selector)

    const selected = getByRole(container, 'option', {selected: true})
    expect(selected).toBeTruthy()
  })
})
