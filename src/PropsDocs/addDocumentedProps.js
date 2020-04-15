function getPropTypesFromArray(ary, propTypes) {
  return ary.reduce((acc, item) => {
    Object.assign(acc, item[propTypes])
    return acc
  }, {})
}

export default function addDocumentedProps(Component, props) {
  const system = props.system || []
  const inherited = props.inherited || []
  const own = props.own || {}

  Component.propTypes = {
    ...getPropTypesFromArray(system, 'propTypes'),
    ...getPropTypesFromArray(inherited, 'propTypes'),
    ...own
  }

  Component.propTypesDocumented = {
    system,
    inherited,
    own
  }
}
