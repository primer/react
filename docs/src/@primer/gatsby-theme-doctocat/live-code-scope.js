import * as primerComponents from '@primer/components'
import * as doctocatComponents from '@primer/gatsby-theme-doctocat'
import Octicon, {Check, GitCommit, Zap, Flame, X, Search} from '@primer/octicons-react'
import State from '../../../components/State'

export default {...primerComponents, ...doctocatComponents, State, Octicon, Check, Search, GitCommit, Flame, Zap, X}
