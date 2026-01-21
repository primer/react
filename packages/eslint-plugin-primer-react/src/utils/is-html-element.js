function isHTMLElement(jsxNode) {
  if (jsxNode.name.type === 'JSXIdentifier') {
    // this is a very silly proxy, but it works
    // React components are capitalised, html elements are not
    const firstLetter = jsxNode.name.name
    if (firstLetter === firstLetter.toLowerCase()) return true
  }

  return false
}
exports.isHTMLElement = isHTMLElement
