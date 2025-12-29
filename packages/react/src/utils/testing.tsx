import {render as HTMLRender} from '@testing-library/react'
import {it, expect, vi} from 'vitest'

export function implementsClassName(Component: React.ElementType, baseClassName?: string) {
  it('renders with the custom className', () => {
    // Suppress console.warn and console.error during this test since we're only testing className support
    // and the component may have required props we're not providing
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
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
    } finally {
      warnSpy.mockRestore()
      errorSpy.mockRestore()
    }
  })
}
