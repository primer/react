const {flattenComponents} = require('../utils/flatten-components')

const components = flattenComponents({
  Button: 'button',
  IconButton: 'button',
  ToggleSwitch: 'button',
  Radio: 'input',
  Checkbox: 'input',
  Text: 'span',
  TextInput: {
    Action: 'button',
    self: 'input',
  },
  Select: {
    Option: 'option',
    self: 'select',
  },
  TabNav: {
    self: 'nav',
  },
})

// We want to avoid setting a jsx-a11y mapping from `Box` to `div` until polymorphic linting is enabled for jsx-a11y.
// However, polymorphic linting is enabled for the github plugin, so we can safely map `Box` to `div` (while also having it properly interpret the `as` prop)
const githubMapping = Object.assign({}, components)
githubMapping['Box'] = 'div'

module.exports = {
  jsxA11yMapping: components,
  githubMapping,
}
