import React from 'react'
import 'babel-polyfill'
import {Tooltip, TooltipContext} from '../Tooltip'
import {SSRProvider} from '..'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import '@testing-library/jest-dom'
expect.extend(toHaveNoViolations)

const Fixture = () => {
  return (
    <SSRProvider>
      <Tooltip text="tooltip text">
        <button>Save</button>
      </Tooltip>
    </SSRProvider>
  )
}

describe('Tooltip', () => {
  behavesAsComponent({
    Component: Tooltip,
    options: {skipAs: true, skipSx: true},
    toRender: () => <Fixture />
  })

  checkExports('Tooltip', {default: undefined, Tooltip, TooltipContext})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Fixture />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('tooltip should not be visible by default', () => {
    const component = HTMLRender(<Fixture />)
    expect(component.getByText('tooltip text')).not.toBeVisible()
    cleanup()
  })

  checkStoriesForAxeViolations('Tooltip/fixtures')
  checkStoriesForAxeViolations('Tooltip/examples')
})
