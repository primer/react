import React, {Fragment} from 'react'
import classnames from 'classnames'
import Octicon from '@github/octicons-react'
import theme from './theme'

const { colors } = theme

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

const getIconComponent = (icon, children) => {
  if (icon && children) {
    return <span className='mr-1'>{icon}</span>
  } else if (icon) {
    return <span className='d-flex m-1'>{icon}</span>
  }
  return null
}

export default function StateLabel(props) {
  const {
    state,
    scheme,
    small,
    children,
  } = props

  let { icon } = props
  if (icon !== false) {
    icon = icon || getOcticon(state)
  }

  const color = scheme || stateColorMap[state]
  let styles = ''
  if (color === 'yellow') {
    styles = {backgroundColor: colors.yellow[7]}
  }
  const iconComponent = getIconComponent(icon, children)
  return (
    <span className={classnames(
      'State', {
        'State--small': small
      },
      color && color !== 'yellow' ? `State--${color}` : null,
    )} style={styles}>
      {iconComponent}
      {children}
    </span>
  )
}
