import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {Relative} from './Position'
import Avatar from './Avatar'
import theme from './theme'

const ChildAvatar = styled(Avatar)`
  position: absolute;
  right: -15%;
  bottom: -9%;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.8);
`
const AvatarPair = ({children, ...rest}) => {
  const avatars = React.Children.map(children, (child, i) => {
    return i === 0 ? React.cloneElement(child, {size: 40}) : <ChildAvatar bg="white" {...child.props} size={20} />
  })
  return <Relative display="inline-flex" {...rest}>{avatars}</Relative>
}

// styled() changes this
AvatarPair.displayName = 'AvatarPair'

AvatarPair.defaultProps = {theme}
AvatarPair.propTypes = {
  ...Relative.propTypes,
  theme: PropTypes.object
}

export default AvatarPair
