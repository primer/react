import type React from 'react'
import Text from '../Text'
import Octicon from '../Octicon'
import {AlertIcon, type IconProps} from '@primer/octicons-react'
import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'

export type SelectPanelMessageProps = {
  children: React.ReactNode
  title: string
  variant: 'empty' | 'error' | 'warning'
  className?: string
  /**
   * Custom icon to display above the title.
   * When not provided, uses AlertIcon for error/warning states and no icon for empty state.
   */
  icon?: React.ComponentType<IconProps>
  /**
   * Custom action element to display below the message body.
   * This can be used to render interactive elements like buttons or links.
   * Ensure the action element is accessible by providing appropriate ARIA attributes
   * and making it keyboard-navigable.
   */
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
  const IconComponent = CustomIcon || (variant !== 'empty' ? AlertIcon : undefined)

  return (
    <div className={clsx(classes.Message, className)}>
      {IconComponent && <Octicon icon={IconComponent} className={classes.MessageIcon} data-variant={variant} />}
      <Text className={classes.MessageTitle}>{title}</Text>
      <Text className={classes.MessageBody}>{children}</Text>
      {action && <div className={classes.MessageAction}>{action}</div>}
    </div>
  )
}
