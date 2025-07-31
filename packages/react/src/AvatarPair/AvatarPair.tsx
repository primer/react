import React, {type HTMLProps} from 'react'
import type {AvatarProps} from '../Avatar'
import Avatar from '../Avatar'
import {SkeletonAvatar} from '../SkeletonAvatar'
import classes from './AvatarPair.module.css'
import {clsx} from 'clsx'

export type AvatarPairProps = HTMLProps<HTMLDivElement>

const AvatarPair = ({children, className, ...rest}: AvatarPairProps) => {
  const avatars = React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child)) {
      return child
    }

    if (i === 0) {
      return React.cloneElement(child as React.ReactElement<AvatarProps>, {size: 40})
    }

    if (child.type === SkeletonAvatar) {
      return <SkeletonAvatar {...child.props} size={20} />
    }

    return <Avatar className={clsx(child.props.className, classes.AvatarChild)} {...child.props} size={20} />
  })

  return (
    <div className={clsx(className, classes.AvatarPair)} {...rest}>
      {avatars}
    </div>
  )
}

AvatarPair.displayName = 'AvatarPair'

export default AvatarPair
