/**
 * Get the variable declaration for the given identifier
 */
function getVariableDeclaration(scope, identifier) {
  if (scope === null) {
    return null
  }

  for (const variable of scope.variables) {
    if (variable.name === identifier.name) {
      return variable.defs[0]
    }
  }

  return getVariableDeclaration(scope.upper, identifier)
}
exports.getVariableDeclaration = getVariableDeclaration
