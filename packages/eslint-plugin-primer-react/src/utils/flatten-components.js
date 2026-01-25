function flattenComponents(componentObj) {
  let result = {}

  for (const key of Object.keys(componentObj)) {
    if (typeof componentObj[key] === 'object') {
      for (const item of Object.keys(componentObj[key])) {
        result = {...result, [`${key}${item !== 'self' ? `.${item}` : ''}`]: componentObj[key][item]}
      }
    } else {
      result = {...result, [key]: componentObj[key]}
    }
  }

  return result
}

exports.flattenComponents = flattenComponents
