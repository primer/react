import {type RenderResult, render as HTMLRender} from '@testing-library/react'
import {it, expect} from 'vitest'

export function implementsClassNameBehavior(
  Component: React.ComponentType<any>,
  baseClassName?: string,
  getClassNameElement: (component: RenderResult) => HTMLElement = component =>
    component.container.firstChild as HTMLElement,
  renderComponent: (props: any) => React.JSX.Element = props => <Component {...props} />,
) {
  it('renders with the base className', () => {
    const component = HTMLRender(renderComponent({}))
    if (baseClassName) {
      expect(getClassNameElement(component)).toHaveClass(baseClassName)
    }
  })
  it('renders with the custom className', () => {
    const component = HTMLRender(renderComponent({className: 'test-class'}))
    expect(getClassNameElement(component)).toHaveClass('test-class')
    if (baseClassName) {
      expect(getClassNameElement(component)).toHaveClass(baseClassName)
    }
  })
}
