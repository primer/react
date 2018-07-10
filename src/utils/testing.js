import renderer from 'react-test-renderer'
import enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({adapter: new Adapter()})

/**
 * Render the component (a React.createElement() or JSX expression)
 * into its intermediate object representation with 'type',
 * 'props', and 'children' keys
 *
 * The returned object can be matched with expect().toEqual(), e.g.
 *
 * ```js
 * expect(render(<Foo />)).toEqual(render(<div foo='bar' />))
 * ```
 */
export function render(component) {
  return renderer.create(component).toJSON()
}

/**
 * Get the HTML class names rendered by the component instance
 * as an array.
 *
 * ```js
 * expect(renderClasses(<div className='a b' />))
 *   .toEqual(['a', 'b'])
 * ```
 */
export function renderClasses(component) {
  const {
    props: {className}
  } = render(component)
  return className ? className.trim().split(' ') : []
}

/**
 * console.error() is ugly af in jest; mock it with a noop,
 * and return the mock so that you can restore it:
 *
 * ```js
 * const mock = silenceConsoleError(jest)
 * // do stuff that calls console.error()
 * mock.mockRestore() // restore console.error()
 * ```
 *
 * Note: we need to pass `jest` as a reference here because
 * jest's mocking functions are bound to a module at runtime, and
 * need to be called as methods rather than pure functions
 * exported from the jest-mock module.
 */
export function silenceConsoleError(jest) {
  return jest.spyOn(console, 'error').mockImplementation(jest.fn())
}

export function mount(component) {
  return enzyme.mount(component)
}
