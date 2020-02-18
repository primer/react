import * as primerComponents from '@primer/components'
import * as doctocatComponents from '@primer/gatsby-theme-doctocat'
import Octicon, * as Icons from '@primer/octicons-react'
import State from '../../../components/State'

const {Check, Zap, X, Search} = Icons

export default {...primerComponents, ...doctocatComponents, State, Octicon, Check, Search, Zap, X, Icons}
