/** Convert JSXOpeningElement name to string */
function getJSXOpeningElementName(jsxNode) {
  if (jsxNode.name.type === 'JSXIdentifier') {
    return jsxNode.name.name
  } else if (jsxNode.name.type === 'JSXMemberExpression') {
    return `${jsxNode.name.object.name}.${jsxNode.name.property.name}`
  }
}

exports.getJSXOpeningElementName = getJSXOpeningElementName
