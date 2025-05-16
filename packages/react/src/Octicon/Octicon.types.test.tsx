import {MoonIcon} from '@primer/octicons-react'
import Octicon from '../Octicon'

export function shouldAcceptCallWithNoProps() {
  return <Octicon icon={MoonIcon} />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Octicon backgroundColor="wheat" />
}
