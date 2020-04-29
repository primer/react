/* eslint-disable no-console */

const Deprecated = ({componentName, message, children}) => {
  console.warn(`WARNING! ${componentName} will be deprecated soon. ${message}`)
  return children
}

export default Deprecated
