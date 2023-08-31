import React from 'react'
import {IconButton, Button} from '../Button'
import {behavesAsComponent} from '../utils/testing'
import {render, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {SearchIcon, IssueClosedIcon, TriangleDownIcon} from '@primer/octicons-react'
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
  it('overrides the styles declared with data attributes with sx prop', () => {
    const container = render(
      <>
        <Button size="small" sx={{fontSize: '32px'}}>
          Small button
        </Button>
        <Button size="large" sx={{height: '20px'}}>
          Large button
        </Button>
        <Button sx={{width: '80%'}} block>
          Block button
        </Button>
        <Button variant="invisible" sx={{color: 'pink'}}>
          Invisible button
        </Button>
        <Button leadingIcon={IssueClosedIcon} trailingIcon={SearchIcon} sx={{color: 'purple'}}>
          Button with visuals
        </Button>
        <Button trailingAction={TriangleDownIcon} sx={{color: 'purple'}}>
          Button with action
        </Button>
      </>,
    )
    const smallBtn = container.getByRole('button', {name: 'Small button'})
    // [data-size="small"] sets font-size to 12px in the styles, it should be overrideable with sx prop
    expect(smallBtn).toHaveStyle('font-size: 32px')
    const largeBtn = container.getByRole('button', {name: 'Large button'})
    // [data-size="large"] sets height to 40px in the styles, it should be overrideable with sx prop
    expect(largeBtn).toHaveStyle('height: 20px')
    const blockBtn = container.getByRole('button', {name: 'Block button'})
    // [data-block="block"] sets width to 100% in the styles, it should be overrideable with sx prop
    expect(blockBtn).toHaveStyle('width: 80%')
    const noVisualsBtn = container.getByRole('button', {name: 'Invisible button'})
    // [data-no-visuals="true"] sets color to accent.fg for invisible , it should be overrideable with sx prop
    expect(noVisualsBtn).toHaveStyle('color: pink')
    const btnWithVisuals = container.getByRole('button', {name: 'Button with visuals'})
    const leadingIcon = btnWithVisuals.querySelector('[data-component="leadingVisual"]')
    // [data-component="leadingVisual"] sets color to fg.muted  for leading icon for default buttons, it should be overrideable with sx prop
    expect(leadingIcon).toHaveStyle('color: purple')
    const trailingIcon = btnWithVisuals.querySelector('[data-component="trailingVisual"]')
    // [data-component="trailingVisual"] sets color to fg.muted  for trailing icon for default buttons, it should be overrideable with sx prop
    expect(trailingIcon).toHaveStyle('color: purple')
    const btnWithAction = container.getByRole('button', {name: 'Button with action'})
    const trailingAction = btnWithAction.querySelector('[data-component="trailingAction"]')
    // [data-component="trailingAction"] sets color to fg.muted  for trailing action for default buttons, it should be overrideable with sx prop
    expect(trailingAction).toHaveStyle('color: purple')
  })
})
