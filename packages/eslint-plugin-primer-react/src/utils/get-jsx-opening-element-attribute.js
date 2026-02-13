function getJSXOpeningElementAttribute(openingEl, name) {
  const attributes = openingEl.attributes
  const attribute = attributes.find(attribute => {
    return attribute.name && attribute.name.name === name
  })

  return attribute
}

exports.getJSXOpeningElementAttribute = getJSXOpeningElementAttribute
