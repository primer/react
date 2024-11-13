import React from 'react'
import Box from '../../Box'
import Spinner from '../../Spinner'
import {clsx} from 'clsx'
import type {TextInputNonPassthroughProps} from '../../TextInput'

import styles from './TextInputInnerVisualSlot.module.css'
import {useFeatureFlag} from '../../FeatureFlags'
import {TEXT_INPUT_CSS_MODULES_FEATURE_FLAG} from './UnstyledTextInput'

const TextInputInnerVisualSlot: React.FC<
  React.PropsWithChildren<{
    /** Whether the input is expected to ever show a loading indicator */
    hasLoadingIndicator: boolean
    /** Whether the to show the loading indicator */
    showLoadingIndicator: TextInputNonPassthroughProps['loading']
    /** Which side of this visual is being rendered */
    visualPosition: 'leading' | 'trailing'
    /** Used to provide a reference for usage with `aria-describedby` */
    id?: string
  }>
> = ({children, hasLoadingIndicator, showLoadingIndicator, visualPosition, id}) => {
  const enabled = useFeatureFlag(TEXT_INPUT_CSS_MODULES_FEATURE_FLAG)
  const isLeading = visualPosition === 'leading'
  if ((!children && !hasLoadingIndicator) || (isLeading && !children && !showLoadingIndicator)) {
    return null
  }

  if (!hasLoadingIndicator) {
    return (
      <span className="TextInput-icon" id={id} aria-hidden="true">
        {children}
      </span>
    )
  }

  const boxStyleProps = enabled
    ? {className: clsx(showLoadingIndicator ? styles.SpinnerHidden : styles.SpinnerVisible)}
    : {
        sx: {
          visibility: showLoadingIndicator ? 'hidden' : 'visible',
        },
      }

  const spinnerStyleProps = enabled
    ? {
        className: clsx(
          showLoadingIndicator ? styles.SpinnerVisible : styles.SpinnerHidden,
          children && styles.Spinner,
          children && isLeading && styles.SpinnerLeading,
        ),
      }
    : {
        sx: children
          ? {
              position: 'absolute',
              top: 0,
              height: '100%',
              maxWidth: '100%',
              visibility: showLoadingIndicator ? 'visible' : 'hidden',
              ...(isLeading ? {left: 0} : {right: 0}),
            }
          : {visibility: showLoadingIndicator ? 'visible' : 'hidden'},
      }

  return (
    <span className="TextInput-icon">
      <Box display="flex" position="relative" id={id}>
        {children && <Box {...boxStyleProps}>{children}</Box>}
        <Spinner srText={null} {...spinnerStyleProps} size={children ? undefined : 'small'} />
      </Box>
    </span>
  )
}

export default TextInputInnerVisualSlot
