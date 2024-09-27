import {forwardRef} from 'react'
import type React from 'react'

export type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode

const fixedForwardRef = forwardRef as FixedForwardRef

export {fixedForwardRef as forwardRef}
