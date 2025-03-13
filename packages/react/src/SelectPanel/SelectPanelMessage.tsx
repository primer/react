import React, {useContext} from 'react'
import Text from '../Text'
import Octicon from '../Octicon'
import {AlertIcon} from '@primer/octicons-react'
import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'
import {SelectPanelContext} from './SelectPanel'

export type SelectPanelMessageProps = {
  children: React.ReactNode
  title: string
  variant: 'empty' | 'no-results' | 'error' | 'warning'
  className?: string
}

export const SelectPanelMessage: React.FC<SelectPanelMessageProps> = ({variant, title, children, className}) => {
  const {status} = useContext(SelectPanelContext)
  if (status !== variant) {
    return null
  }
  return (
    <div className={clsx(classes.Message, className)}>
      {variant !== 'empty' && variant !== 'no-results' ? (
        <Octicon icon={AlertIcon} className={classes.MessageIcon} data-variant={variant} />
      ) : null}
      <Text className={classes.MessageTitle}>{title}</Text>
      <Text className={classes.MessageBody}>{children}</Text>
    </div>
  )
}
