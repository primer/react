import Breadcrumbs from '..'
import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('Breadcrumbs', () => {
  it('should support `className` on the outermost element', () => {
    expect(HTMLRender(<Breadcrumbs className={'test-class-name'} />).container.firstChild).toHaveClass(
      'test-class-name',
    )
  })

  it('renders a <nav>', () => {
    const {container} = HTMLRender(<Breadcrumbs />)
    expect(container.firstChild?.nodeName).toEqual('NAV')
  })
})
