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

const getOcticon = state => {
  const name = stateOcticonMap[state]
  return name
    ? (
        /* return a fragment including the trailing space */
        <Fragment>
          <span className={`octicon octicon-${name}`}>
            <Octicon name={name}/>
          </span>
          {' '}
        </Fragment>
      )
    : null
}

export default function StateLabel(props) {
  const {
    state,
    bg,
    small,
    icon,
    className,
    children,
    ...rest
  } = props

  const color = bg || stateColorMap[state]
  const octicon = (!state || icon === false)
    ? null
    : icon || getOcticon(state)

  return (
    <span {...rest} className={classnames(
      className,
      'State', {
        'State--small': small
      },
      color ? `State--${color}` : null
    )}>
      {octicon}
      {children}
    </span>
  )
}

export {
  stateColorMap,
  stateOcticonMap,
  getOcticon
}
