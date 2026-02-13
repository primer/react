const camelReg = /^[a-z][a-z0-9]*(?:[A-Z][a-z0-9]*)*$/
const pascalReg = /^(?:[A-Z][a-z0-9]*)+$/
const kebabReg = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/

function casingMatches(name, type) {
  switch (type) {
    case 'camel':
      return camelReg.test(name)
    case 'pascal':
      return pascalReg.test(name)
    case 'kebab':
      return kebabReg.test(name)
    default:
      throw new Error(`Invalid case type ${type}`)
  }
}
exports.casingMatches = casingMatches

exports.availableCasings = ['camel', 'pascal', 'kebab']
