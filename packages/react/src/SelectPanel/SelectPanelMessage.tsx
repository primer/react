import type React from 'react'
import Text from '../Text'
import Octicon from '../Octicon'
import {AlertIcon, NoEntryIcon, type IconProps} from '@primer/octicons-react'
import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'

export type SelectPanelMessageProps = {
  children: React.ReactNode
  title: string
  variant: 'empty' | 'error' | 'warning'
  className?: string
  /**
   * Custom icon to display above the title.
   * When not provided, uses NoEntryIcon for empty states and AlertIcon for error/warning states.
   */
  icon?: React.ComponentType<IconProps>
  action?: React.ReactElement
}

export const SelectPanelMessage: React.FC<SelectPanelMessageProps> = ({
  variant,
  title,
  children,
  className,
  icon: CustomIcon,
  action,
}) => {
  const IconComponent = CustomIcon || (variant === 'empty' ? NoEntryIcon : AlertIcon)

  return (
    <div className={clsx(classes.Message, className)}>
      <Octicon icon={IconComponent} className={classes.MessageIcon} data-variant={variant} />
      <Text className={classes.MessageTitle}>{title}</Text>
      <Text className={classes.MessageBody}>{children}</Text>
      {action && <div className={classes.MessageAction}>{action}</div>}
    </div>
  )
}
