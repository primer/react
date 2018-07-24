import React from 'react'
import PropTypes from 'prop-types'
import Octicon, {GitMerge, IssueClosed, IssueOpened, IssueReopened} from '@githubprimer/octicons-react'
import classnames from 'classnames'
import {colors} from './theme'
import {spacing} from './mappers'

const stateColorMap = {
  open: 'green',
  opened: 'green',
  reopened: 'green',
  closed: 'red',
  merged: 'purple'
}

const stateOcticonMap = {
  open: IssueOpened,
  opened: IssueOpened,
  reopened: IssueReopened,
  closed: IssueClosed,
  merged: GitMerge
}

function getOcticon(state) {
  if (!state) {
    return null
  }
  return <Octicon icon={stateOcticonMap[state]} />
}

function getIconComponent(icon, children) {
  if (icon && children) {
    return <span className="mr-1">{icon}</span>
  } else if (icon) {
    return <span className="d-flex m-1">{icon}</span>
  }
  return null
}

const StateLabel = ({state, scheme, icon, small, children, ...rest}) => {
  const {className} = spacing(rest)
  if (icon !== false) {
    icon = icon || getOcticon(state)
  }

  const color = scheme || stateColorMap[state]
  const styleProps = {}
  if (color === 'yellow') {
    styleProps.style = {backgroundColor: colors.yellow[7]}
  }
  const iconComponent = getIconComponent(icon, children)
  return (
    <span
      className={classnames(
        className,
        'State',
        {
          'State--small': small
        },
        color && color !== 'yellow' ? `State--${color}` : null
      )}
      {...styleProps}
    >
      {iconComponent}
      {children}
    </span>
  )
}

StateLabel.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  scheme: PropTypes.string,
  small: PropTypes.bool,
  state: PropTypes.oneOf(Object.keys(stateOcticonMap))
}

export default StateLabel
