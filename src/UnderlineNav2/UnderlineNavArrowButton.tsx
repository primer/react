import React, {useContext} from 'react'
import {IconButton} from '../Button/IconButton'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import {btnWrapperStyles, getArrowBtnStyles} from './styles'
import {OnScrollWithButtonEventType} from './types'
import {UnderlineNavContext} from './UnderlineNavContext'
import Box from '../Box'

const ArrowButton = ({
  scrollValue,
  type,
  show,
  onScrollWithButton,
  'aria-label': ariaLabel
}: {
  scrollValue: number
  type: 'left' | 'right'
  show: boolean
  onScrollWithButton: OnScrollWithButtonEventType
  'aria-label'?: React.AriaAttributes['aria-label']
}) => {
  const leftBtnRef = React.useRef<HTMLButtonElement>(null)
  const rightBtnRef = React.useRef<HTMLButtonElement>(null)
  const {theme} = useContext(UnderlineNavContext)
  const direction = type === 'left' ? -1 : 1
  const ARROW_BTN_WIDTH = 44 // Min touch target size is 44px

  // re-trigger focus on the button with aria-disabled=true when it becomes hidden to communicate to screen readers that the button is no longer available
  React.useEffect(() => {
    const currentBtn = type === 'left' ? leftBtnRef.current : rightBtnRef.current
    if (currentBtn?.getAttribute('aria-disabled') === 'true') {
      currentBtn.focus()
    } else {
      // eslint-disable-next-line github/no-blur
      currentBtn?.blur()
    }
  }, [show, type])

  let translateX = 0
  let display = 'flex'

  // Determine the translateX value to transform for the slide in/out effect
  if (scrollValue === 0) {
    // If the scrollValue is 0, the buttons should be hidden
    translateX = ARROW_BTN_WIDTH * direction
    // This is mainly needed for the right arrow button. Because hiding translateX value for it is positive (44px) and this positive value was causing button to be visibly overflowed rathan than hiding.
    display = 'none'
  } else if (scrollValue <= ARROW_BTN_WIDTH) translateX = (ARROW_BTN_WIDTH - scrollValue) * direction
  else translateX = 0

  return (
    <Box sx={btnWrapperStyles(theme, type, show, translateX, display)}>
      <IconButton
        tabIndex={show ? 0 : -1}
        ref={type === 'left' ? leftBtnRef : rightBtnRef}
        aria-label={`Scroll ${ariaLabel} navigation ${type}`}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, direction)}
        icon={type === 'left' ? ChevronLeftIcon : ChevronRightIcon}
        sx={getArrowBtnStyles(theme, type)}
        aria-disabled={!show}
      />
    </Box>
  )
}

export {ArrowButton}
