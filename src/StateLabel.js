import React, {Fragment} from 'react'
import classnames from 'classnames'
import Octicon from '@github/octicons-react'

const stateColorMap = {
  open: 'green',
  opened: 'green',
  reopened: 'green',
  closed: 'red',
  merged: 'purple',
}

const stateOcticonMap = {
  open: 'issue-opened',
  opened: 'issue-opened',
  reopened: 'issue-reopened',
  closed: 'issue-closed',
  merged: 'git-merge'
}

function getOcticon(state) {
  if (!state) {
    return null
  }
  const name = stateOcticonMap[state] || state
  return <Octicon name={name}/>
}

export default function StateLabel(props) {
  const {
    state,
    scheme,
    small,
    children,
  } = props

  let {icon} = props
  if (icon !== false) {
    icon = icon || getOcticon(state)
  }

  const color = scheme || stateColorMap[state]
  return (
    <span className={classnames(
      'State', {
        'State--small': small
      },
      color ? `State--${color}` : null
    )}>
      {icon ? <span className='mr-1'>{icon}</span> : null}
      {children}
    </span>
  )
}
