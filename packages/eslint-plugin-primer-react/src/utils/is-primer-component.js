const {isImportedFrom} = require('./is-imported-from')

/**
 * Check if `name` is a JSX component that is imported from `@primer/react`,
 * `@primer/styled-react`, or a subpath of either.
 * @returns {boolean}
 */
function isPrimerComponent(name, scope) {
  let identifier

  switch (name.type) {
    case 'JSXIdentifier':
      identifier = name
      break
    case 'JSXMemberExpression':
      identifier = name.object
      break
    default:
      return false
  }
  return isImportedFrom(/^@primer\/(?:styled-)?react(?:$|\/)/, identifier, scope)
}
exports.isPrimerComponent = isPrimerComponent
