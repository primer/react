import React from 'react'
import {IconButton, NewButton as Button} from '../NewButton'
import {behavesAsComponent} from '../utils/testing'
import {render, cleanup, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {SearchIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

describe('Button', () => {
  behavesAsComponent({Component: Button, options: {skipAs: true}})

  it('renders a <button>', async () => {
    const container = render(<Button>Default</Button>)
    const button = await container.findByRole('button')
    expect(button.textContent).toEqual('Default')
  })

  it('should have no axe violations', async () => {
    const {container} = render(<Button>Click here</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('preserves "onClick" prop', async () => {
    const onClick = jest.fn()
    const container = render(<Button onClick={onClick}>Noop</Button>)
    const button = await container.findByRole('button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects width props', async () => {
    const container = render(<Button sx={{width: 200}}>Block</Button>)
    const button = await container.findByRole('button')
    expect(button).toHaveStyleRule('width', '200px')
  })

  it('respects the "disabled" prop', async () => {
    const onClick = jest.fn()
    const container = render(
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
    const container = render(<Button size="small">Smol</Button>)
    const button = await container.findByRole('button')
    expect(button).toHaveStyleRule('font-size', '12px')
  })

  it('respects the "fontSize" prop over the "variant" prop', async () => {
    const container = render(
      <Button size="small" sx={{fontSize: 20}}>
        Big Smol
      </Button>
    )
    const button = await container.findByRole('button')
    expect(button).toHaveStyleRule('font-size', '20px')
  })

  it('styles primary button appropriately', async () => {
    const container = render(<Button variant="primary">Primary</Button>)
    const button = await container.findByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles invisible button appropriately', async () => {
    const container = render(<Button variant="invisible">Invisible</Button>)
    const button = await container.findByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles danger button appropriately', async () => {
    const container = render(<Button variant="danger">Danger</Button>)
    const button = await container.findByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles outline button appropriately', async () => {
    const container = render(<Button variant="outline">Outline</Button>)
    const button = await container.findByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles icon only button to make it a square', async () => {
    const container = render(<IconButton icon={SearchIcon} iconLabel="Search icon only button" />)
    const IconOnlyButton = await container.findByRole('button')
    expect(IconOnlyButton).toHaveStyleRule('padding-right', '7px')
  })
})
