import React from 'react'
import Box from '../../Box'
import Spinner from '../../Spinner'
import type {TextInputNonPassthroughProps} from '../../TextInput'

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
> = ({children, hasLoadingIndicator, showLoadingIndicator, visualPosition, id, ...props}) => {
  if ((!children && !hasLoadingIndicator) || (visualPosition === 'leading' && !children && !showLoadingIndicator)) {
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
    <span className="TextInput-icon" {...props}>
      <Box display="flex" position="relative" id={id}>
        {children && <Box sx={{visibility: showLoadingIndicator ? 'hidden' : 'visible'}}>{children}</Box>}
        <Spinner
          srText={null}
          sx={
            children
              ? {
                  position: 'absolute',
                  top: 0,
                  height: '100%',
                  maxWidth: '100%',
                  visibility: showLoadingIndicator ? 'visible' : 'hidden',
                  ...(visualPosition === 'leading' ? {left: 0} : {right: 0}),
                }
              : {visibility: showLoadingIndicator ? 'visible' : 'hidden'}
          }
          size={children ? undefined : 'small'}
        />
      </Box>
    </span>
  )
}

export default TextInputInnerVisualSlot
