const {getVariableDeclaration} = require('./get-variable-declaration')

/**
 * Check if the given identifier is imported from the given module
 */
function isImportedFrom(moduleRegex, identifier, scope) {
  const definition = getVariableDeclaration(scope, identifier)

  // Return true if the variable was imported from the given module
  return definition && definition.type === 'ImportBinding' && moduleRegex.test(definition.parent.source.value)
}
exports.isImportedFrom = isImportedFrom
