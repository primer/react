import React from 'react'
import {IconButton, NewButton as Button} from '../NewButton'
import {render, behavesAsComponent} from '../utils/testing'
import {render as HTMLRender, cleanup, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {SearchIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

describe('Button', () => {
  behavesAsComponent({Component: Button, options: {skipAs: true}})

  it('renders a <button>', async () => {
    const container = HTMLRender(<Button>Default</Button>)
    const button = await container.findByRole('button')
    expect(button.textContent).toEqual('Default')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Button>Click here</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('preserves "onClick" prop', async () => {
    const onClick = jest.fn()
    const container = HTMLRender(<Button onClick={onClick}>Noop</Button>)
    const button = await container.findByRole('button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects width props', async () => {
    const container = HTMLRender(<Button sx={{width: 200}}>Block</Button>)
    const button = await container.findByRole('button')
    expect(button).toHaveStyleRule('width', '200px')
  })

  it('respects the "disabled" prop', async () => {
    const onClick = jest.fn()
    const container = HTMLRender(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>
    )
    const button = await container.findByRole('button')
    expect(button.hasAttribute('disabled')).toEqual(true)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(0)
  })

  it('respects the "variant" prop', async () => {
    const container = HTMLRender(<Button size="small">Smol</Button>)
    const button = await container.findByRole('button')
    expect(button).toHaveStyleRule('font-size', '12px')
  })

  it('respects the "fontSize" prop over the "variant" prop', async () => {
    const container = HTMLRender(
      <Button size="small" sx={{fontSize: 20}}>
        Big Smol
      </Button>
    )
    const button = await container.findByRole('button')
    expect(button).toHaveStyleRule('font-size', '20px')
  })

  it('styles primary button appropriately', async () => {
    const container = HTMLRender(<Button variant="primary">Primary</Button>)
    const button = await container.findByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles invisible button appropriately', async () => {
    const container = HTMLRender(<Button variant="invisible">Invisible</Button>)
    const button = await container.findByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles danger button appropriately', async () => {
    const container = HTMLRender(<Button variant="danger">Danger</Button>)
    const button = await container.findByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles icon only button to make it a square', async () => {
    const container = HTMLRender(<IconButton icon={SearchIcon} iconLabel="Search icon only button" />)
    const IconOnlyButton = await container.findByRole('button')
    expect(IconOnlyButton).toHaveStyleRule('padding-right', '7px')
    expect(IconOnlyButton).toMatchSnapshot()
  })
})
