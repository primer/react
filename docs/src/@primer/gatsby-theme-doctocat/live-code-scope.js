import * as primerComponents from '@primer/components'
import * as doctocatComponents from '@primer/gatsby-theme-doctocat'
import Octicon, {iconsByName} from '@primer/octicons-react'

const iconComponents = Object.keys(iconsByName).reduce((map, key) => {
  map[iconsByName[key].name] = iconsByName[key]
  return map
}, {})

export default {...primerComponents, ...doctocatComponents, ...iconComponents}
