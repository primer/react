import type React from 'react'
import Spinner from '../../Spinner'
import {clsx} from 'clsx'
import type {TextInputNonPassthroughProps} from '../../TextInput'

import styles from './TextInputInnerVisualSlot.module.css'

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

  return (
    <span className="TextInput-icon">
      <div className={styles.Box} id={id}>
        {children && (
          <div className={clsx(showLoadingIndicator ? styles.SpinnerHidden : styles.SpinnerVisible)}>{children}</div>
        )}
        <Spinner
          srText={null}
          className={clsx(
            showLoadingIndicator ? styles.SpinnerVisible : styles.SpinnerHidden,
            children && styles.Spinner,
            children && isLeading && styles.SpinnerLeading,
          )}
          size={children ? undefined : 'small'}
        />
      </div>
    </span>
  )
}

export default TextInputInnerVisualSlot
