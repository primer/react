import React from 'react'
import Text from '../Text'
import Octicon from '../Octicon'
import Spinner from '../Spinner'
import {AlertIcon, type IconProps} from '@primer/octicons-react'
import {AriaStatus} from '../live-region'
import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'

interface SelectPanelMessageBaseProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  children: React.ReactNode
  variant: 'empty' | 'error' | 'warning'
  icon?: React.ComponentType<IconProps>
  action?: React.ReactNode
}

export type ComposableSelectPanelMessageProps = SelectPanelMessageBaseProps &
  ({size?: 'full'; title: string} | {size: 'inline'; title?: string})

export const ComposableSelectPanelMessage = React.forwardRef<HTMLDivElement, ComposableSelectPanelMessageProps>(
  function ComposableSelectPanelMessage(
    {variant, title, size = 'full', children, className, icon: CustomIcon, action, hidden, ...props},
    ref,
  ) {
    const IconComponent = CustomIcon ?? (variant !== 'empty' ? AlertIcon : undefined)
    return (
      <div
        {...props}
        ref={ref}
        hidden={hidden}
        className={clsx(classes.Message, className)}
        data-size={size}
        data-variant={variant}
        data-has-icon={IconComponent ? '' : undefined}
        data-component="SelectPanel.Message"
      >
        {IconComponent && (
          <Octicon
            icon={IconComponent}
            className={classes.MessageIcon}
            data-variant={variant}
            data-component="SelectPanel.MessageIcon"
          />
        )}
        <AriaStatus
          key={hidden ? 'hidden' : 'visible'}
          announceOnShow
          hidden={hidden}
          className={classes.MessageContent}
        >
          {title && (
            <Text className={classes.MessageTitle} data-component="SelectPanel.MessageTitle">
              {title}{' '}
            </Text>
          )}
          <Text className={classes.MessageBody} data-component="SelectPanel.MessageBody">
            {children}
          </Text>
        </AriaStatus>
        {action && (
          <div className={classes.MessageAction} data-component="SelectPanel.MessageAction">
            {action}
          </div>
        )}
      </div>
    )
  },
)

export interface SelectPanelLoadingProps extends React.ComponentPropsWithoutRef<'div'> {
  size?: 'inline' | 'full'
}

export const SelectPanelLoading = React.forwardRef<HTMLDivElement, SelectPanelLoadingProps>(function SelectPanelLoading(
  {children = 'Loading items...', size = 'full', className, hidden, ...props},
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      hidden={hidden}
      className={clsx(classes.Loading, className)}
      data-component="SelectPanel.Loading"
      data-size={size}
    >
      <Spinner size={size === 'inline' ? 'small' : 'medium'} srText={null} />
      <AriaStatus key={hidden ? 'hidden' : 'visible'} announceOnShow hidden={hidden} className={classes.MessageBody}>
        {children}
      </AriaStatus>
    </div>
  )
})
