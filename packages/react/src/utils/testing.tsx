import {render as HTMLRender} from '@testing-library/react'
import {it, expect, vi} from 'vitest'
import {reactMajorVersion} from './environment'

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

export function withExpectedConsoleError(callback: () => void) {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  try {
    callback()
    if (reactMajorVersion < 19) {
      expect(consoleSpy).toHaveBeenCalled()
    }
  } finally {
    consoleSpy.mockRestore()
  }
}

export function withExpectedConsoleWarning(callback: () => void) {
  const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  try {
    callback()
    expect(consoleSpy).toHaveBeenCalled()
  } finally {
    consoleSpy.mockRestore()
  }
}
