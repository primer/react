import * as primerComponents from '@primer/components'
import * as doctocatComponents from '@primer/gatsby-theme-doctocat'
import Octicon, {iconsByName} from '@primer/octicons-react'
import State from '../../../components/State'

const iconComponents = Object.keys(iconsByName).reduce((map, key) => {
  map[iconsByName[key].name] = iconsByName[key]
  return map
}, {})

export default {...primerComponents, ...doctocatComponents, Octicon, ...iconComponents, State}
