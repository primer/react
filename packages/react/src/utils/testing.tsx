import {render as HTMLRender} from '@testing-library/react'
import {it, expect} from 'vitest'

export function implementsClassName(Component: React.ElementType, baseClassName?: string) {
  it('renders with the custom className', () => {
    const component = HTMLRender(<Component className="test-class" />)
    if (baseClassName) {
      const baseElement = component.container.getElementsByClassName(baseClassName)
      expect(baseElement).toHaveLength(1)
      expect(baseElement[0]).toHaveClass('test-class')
    } else {
      const classNameElement = component.container.getElementsByClassName('test-class')
      expect(classNameElement).toHaveLength(1)
    }
  })
}
