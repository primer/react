import React from 'react'
import {Prose} from './'
import {render} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {KitchenSinkChildren} from './_ProseStorybookHelpers'
import Heading from '../../Heading'

expect.extend(toHaveNoViolations)

describe('Prose', () => {
  it('renders a <div> by default', () => {
    expect(
      render(
        <Prose>
          <h2>Heading level 2</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor lectus ipsum, consectetur convallis diam
            pretium quis. Proin ut felis ut eros tristique tincidunt.
          </p>
        </Prose>,
      ).container.firstChild?.nodeName,
    ).toBe('DIV')
  })

  it('renders a <section> when passed to "as"', () => {
    expect(
      render(
        <Prose as="section">
          <h2>Heading level 2</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor lectus ipsum, consectetur convallis diam
            pretium quis. Proin ut felis ut eros tristique tincidunt.
          </p>
        </Prose>,
      ).container.firstChild?.nodeName,
    ).toBe('SECTION')
  })

  it('respects fullWidth prop', () => {
    expect(
      render(
        <Prose fullWidth>
          <h2>Heading level 2</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor lectus ipsum, consectetur convallis diam
            pretium quis. Proin ut felis ut eros tristique tincidunt.
          </p>
        </Prose>,
      ),
    ).not.toHaveStyleRule('max-width', '70ch')
  })

  it('does not override styles set on the PRC Heading component', async () => {
    // TODO: check that it preserves some custom styles that we set on the Heading component
    const prose = render(
      <Prose fullWidth>
        <Heading as="h2" sx={{fontSize: '20px'}}>
          PRC Heading
        </Heading>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tempor lectus ipsum, consectetur convallis diam
          pretium quis. Proin ut felis ut eros tristique tincidunt.
        </p>
      </Prose>,
    )
    const headingEl = await prose.findByText('PRC Heading')

    expect(headingEl).toHaveStyleRule('font-size', '20px')
  })

  it('should have no axe violations', async () => {
    const {container} = render(
      <Prose>
        <KitchenSinkChildren />
      </Prose>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
