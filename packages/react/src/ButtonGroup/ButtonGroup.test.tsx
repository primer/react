import {Button} from '../Button'
import {render, screen} from '@testing-library/react'
import axe from 'axe-core'
import {FeatureFlags} from '../FeatureFlags'
import {behavesAsComponent} from '../utils/testing'
import type {ButtonGroupProps} from './ButtonGroup'
import ButtonGroup from './ButtonGroup'
import React from 'react'

const TestButtonGroup = (props: ButtonGroupProps) => (
  <ButtonGroup {...props}>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
    <Button>Button 3</Button>
  </ButtonGroup>
)

describe('ButtonGroup', () => {
  behavesAsComponent({
    Component: TestButtonGroup,
    options: {skipSx: true, skipAs: true},
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <ButtonGroup className={'test-class-name'} />
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_staff: true,
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
    expect(render(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <div>', () => {
    const container = render(<ButtonGroup data-testid="button-group" />)
    expect(container.getByTestId('button-group').tagName).toBe('DIV')
  })

  it('should have no axe violations', async () => {
    const {container} = render(<TestButtonGroup />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should respect role prop', () => {
    render(<ButtonGroup role="toolbar" />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })
})
