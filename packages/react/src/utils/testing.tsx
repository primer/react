import {render as HTMLRender} from '@testing-library/react'
import {it, expect} from 'vitest'

export function implementsClassName(Component: React.ElementType, baseClassName?: string) {
  it('renders with the custom className', () => {
    const component = HTMLRender(<Component className="test-class" />)
    if (baseClassName) {
      // account for elements rendering in root portals
      const baseElement = component.container.parentElement?.getElementsByClassName(baseClassName)
      expect(baseElement).toHaveLength(1)
      expect(baseElement?.[0]).toHaveClass('test-class')
    } else {
      // account for elements rendering in root portals
      const classNameElement = component.container.parentElement?.getElementsByClassName('test-class')
      expect(classNameElement).toHaveLength(1)
    }
  })
}
