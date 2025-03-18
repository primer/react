import React from 'react'
import Text from '../Text'
import Octicon from '../Octicon'
import {AlertIcon} from '@primer/octicons-react'
import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'

export type SelectPanelMessageProps = {
  children: React.ReactNode
  title: string
  variant: 'empty' | 'error' | 'warning'
  className?: string
}

export const SelectPanelMessage: React.FC<SelectPanelMessageProps> = ({variant, title, children, className}) => {
  return (
    <div className={clsx(classes.Message, className)}>
      {variant !== 'empty' ? <Octicon icon={AlertIcon} className={classes.MessageIcon} data-variant={variant} /> : null}
      <Text className={classes.MessageTitle}>{title}</Text>
      <Text className={classes.MessageBody}>{children}</Text>
    </div>
  )
}
