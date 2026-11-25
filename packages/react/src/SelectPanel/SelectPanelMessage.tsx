import React from 'react'
import Text from '../Text'
import Octicon from '../Octicon'
import {AlertIcon, type IconProps} from '@primer/octicons-react'
import classes from './SelectPanel.module.css'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import {ComposableSelectPanelMessage} from './ComposableSelectPanelMessage'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action?: React.ReactElement<any>
}

export const SelectPanelMessage = React.forwardRef<HTMLDivElement, SelectPanelMessageProps>(function SelectPanelMessage(
  {variant, title, children, className, icon: CustomIcon, action},
  ref,
) {
  const composable = useFeatureFlag('primer_react_select_panel_composable_adapter')
  if (composable)
    return (
      <ComposableSelectPanelMessage
        variant={variant}
        title={title}
        className={className}
        icon={CustomIcon}
        action={action}
        ref={ref}
      >
        {children}
      </ComposableSelectPanelMessage>
    )
  const IconComponent = CustomIcon || (variant !== 'empty' ? AlertIcon : undefined)

  return (
    <div ref={ref} className={clsx(classes.Message, className)} data-component="SelectPanel.Message">
      {IconComponent && (
        <Octicon
          icon={IconComponent}
          className={classes.MessageIcon}
          data-variant={variant}
          data-component="SelectPanel.MessageIcon"
        />
      )}
      <Text className={classes.MessageTitle} data-component="SelectPanel.MessageTitle">
        {title}
      </Text>
      <Text className={classes.MessageBody} data-component="SelectPanel.MessageBody">
        {children}
      </Text>
      {action && (
        <div className={classes.MessageAction} data-component="SelectPanel.MessageAction">
          {action}
        </div>
      )}
    </div>
  )
})
