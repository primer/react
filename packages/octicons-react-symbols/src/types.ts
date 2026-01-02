import type {HTMLAttributes, PropsWithChildren, ReactElement} from 'react'

export type OcticonReferenceProps = HTMLAttributes<SVGElement> &
  PropsWithChildren<{
    'aria-label'?: string
    'aria-labelledby'?: string
    className?: string
    fill?: string
    id?: string
    size?: number | 'small' | 'medium' | 'large'
    tabIndex?: number
    title?: string | ReactElement<any>
  }>
