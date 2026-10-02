import {Dialog} from './Dialog'
import React from 'react'
import {FeatureFlags} from '../FeatureFlags'

/* Dialog Version 2? */

export function shouldAcceptCallWithNoProps() {
  return <Dialog onClose={() => null} />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Dialog onClose={() => null} backgroundColor="tomato" />
}

export function shouldForwardNativeDialogRef() {
  const ref = React.createRef<HTMLDialogElement>()
  return (
    <FeatureFlags flags={{primer_react_use_native_dialog: true}}>
      <Dialog ref={ref} onClose={() => {}} />
    </FeatureFlags>
  )
}

export function shouldForwardLegacyDialogRef() {
  const ref = React.createRef<HTMLDivElement>()
  return <Dialog ref={ref} onClose={() => {}} />
}
