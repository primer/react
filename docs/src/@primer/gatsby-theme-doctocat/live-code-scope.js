import * as doctocatComponents from '@primer/gatsby-theme-doctocat'
import * as octicons from '@primer/octicons-react'
import * as primerComponents from '@primer/react'
import * as drafts from '@primer/react/drafts'
import * as deprecated from '@primer/react/deprecated'
import {Placeholder} from '@primer/react/Placeholder'
import React from 'react'
import State from '../../../components/State'

const ReactRouterLink = ({to, ...props}) => {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a href={to} {...props} />
}

export default function resolveScope(metastring) {
  return {
    ...doctocatComponents,
    ...primerComponents,
    ...octicons,
    ...(metastring.includes('drafts') ? drafts : {}),
    ...(metastring.includes('deprecated') ? deprecated : {}),
    ReactRouterLink,
    State,
    Placeholder
  }
}
