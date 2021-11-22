import React from 'react'
import {NewButton as Button} from '../NewButton'
import {render, behavesAsComponent} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {SearchIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

describe('Button', () => {
  behavesAsComponent({Component: Button})

  it('renders a <button>', () => {
    expect(render(<Button>Default</Button>).type).toEqual('button')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Button>Click here</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('preserves "onClick" prop', () => {
    expect(render(<Button onClick={noop}>Noop</Button>).props.onClick).toEqual(noop)
  })

  it('respects width props', () => {
    expect(render(<Button sx={{width: 200}}>Block</Button>)).toHaveStyleRule('width', '200px')
  })

  it('respects the "disabled" prop', () => {
    const item = render(<Button disabled> Disabled</Button>)
    expect(item.props.disabled).toEqual(true)
    expect(item).toMatchSnapshot()
  })

  it('respects the "variant" prop', () => {
    expect(render(<Button size="small">Smol</Button>)).toHaveStyleRule('font-size', '12px')
    expect(render(<Button size="large">Large</Button>)).toHaveStyleRule('font-size', '16px')
  })

  it('respects the "fontSize" prop over the "variant" prop', () => {
    expect(
      render(
        <Button size="small" sx={{fontSize: 20}}>
          Big Smol
        </Button>
      )
    ).toHaveStyleRule('font-size', '20px')
  })

  it('styles primary button appropriately', () => {
    expect(render(<Button variant="primary">Primary</Button>)).toHaveStyleRule('background-color', '#2da44e')
  })
  it('styles invisible button appropriately', () => {
    expect(render(<Button variant="invisible">Invisible</Button>)).toHaveStyleRule('background-color', 'transparent')
  })
  it('styles danger button appropriately', () => {
    expect(render(<Button variant="danger">Danger</Button>)).toHaveStyleRule('background-color', '#f6f8fa')
  })
  it('styles icon only button to make it a square', () => {
    const IconOnlyButton = render(<Button icon={SearchIcon}>Search icon only button</Button>)
    expect(IconOnlyButton).toHaveStyleRule('padding-right', '7px')
    expect(IconOnlyButton).toMatchSnapshot()
  })
})
