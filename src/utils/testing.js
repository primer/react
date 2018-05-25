import renderer from 'react-test-renderer'

export function render(component) {
  return renderer.create(component).toJSON()
}

export function renderClasses(component) {
  const {props: {className}} = render(component)
  return className ? className.trim().split(' ') : []
}
