import React from 'react'
import {IconButton, Button} from '../Button'
import {behavesAsComponent} from '../utils/testing'
import {render, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {SearchIcon} from '@primer/octicons-react'
expect.extend(toHaveNoViolations)

describe('Button', () => {
  behavesAsComponent({Component: Button, options: {skipSx: true}})

  it('renders a <button>', () => {
    const container = render(<Button>Default</Button>)
    const button = container.getByRole('button')
    expect(button.textContent).toEqual('Default')
  })

  it('should have no axe violations', async () => {
    const {container} = render(<Button>Click here</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('preserves "onClick" prop', () => {
    const onClick = jest.fn()
    const container = render(<Button onClick={onClick}>Noop</Button>)
    const button = container.getByRole('button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects block prop', () => {
    const container = render(<Button block>Block</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('respects the "disabled" prop', () => {
    const onClick = jest.fn()
    const container = render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    )
    const button = container.getByRole('button')
    expect(button.hasAttribute('disabled')).toEqual(true)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(0)
  })

  it('respects the small size prop', () => {
    const container = render(<Button size="small">Smol</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('respects the large size prop', () => {
    const container = render(<Button size="large">Smol</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles primary button appropriately', () => {
    const container = render(<Button variant="primary">Primary</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles invisible button appropriately', () => {
    const container = render(<Button variant="invisible">Invisible</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles danger button appropriately', () => {
    const container = render(<Button variant="danger">Danger</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('makes sure icon button has an aria-label', () => {
    const container = render(<IconButton icon={SearchIcon} aria-label="Search button" />)
    const IconOnlyButton = container.getByLabelText('Search button')
    expect(IconOnlyButton).toBeTruthy()
  })

  it('respects the alignContent prop', () => {
    const container = render(<Button alignContent="start">Align start</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })
})
