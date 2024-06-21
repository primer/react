import * as doctocatComponents from '@primer/gatsby-theme-doctocat'
import * as octicons from '@primer/octicons-react'
import * as primerComponents from '@primer/react'
import * as drafts from '@primer/react/drafts'
import * as deprecated from '@primer/react/deprecated'
import * as experimental from '@primer/react/experimental'
import * as next from '@primer/react/next'
import {Placeholder} from '@primer/react/Placeholder'
import React from 'react'
import State from '../../../components/State'

const ReactRouterLink = ({to, children, ...props}) => {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  )
}

// Exclude octicons-react's default export because it's deprecated
const {default: _, ...octiconComponents} = octicons

export default function resolveScope(metastring) {
  return {
    ...doctocatComponents,
    ...primerComponents,
    ...octiconComponents,
    ...(metastring.includes('drafts') ? drafts : {}),
    ...(metastring.includes('experimental') ? experimental : {}),
    ...(metastring.includes('deprecated') ? deprecated : {}),
    ...(metastring.includes('next') ? next : {}),
    ReactRouterLink,
    State,
    Placeholder,
  }
}
