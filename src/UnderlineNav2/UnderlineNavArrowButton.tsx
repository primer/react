import React, {useContext} from 'react'
import {IconButton} from '../Button/IconButton'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import {btnWrapperStyles, getArrowBtnStyles, getArrowHiddenBtn} from './styles'
import {OnScrollWithButtonEventType} from './types'
import {UnderlineNavContext} from './UnderlineNavContext'
import Box from '../Box'

const ArrowButton = ({
  type,
  show,
  onScrollWithButton,
  'aria-label': ariaLabel
}: {
  type: 'left' | 'right'
  show: boolean
  onScrollWithButton: OnScrollWithButtonEventType
  'aria-label'?: React.AriaAttributes['aria-label']
}) => {
  const leftBtnRef = React.useRef<HTMLButtonElement>(null)
  const rightBtnRef = React.useRef<HTMLButtonElement>(null)
  const {theme} = useContext(UnderlineNavContext)
  const direction = type === 'left' ? -1 : 1
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
  return (
    <Box sx={btnWrapperStyles(theme, type, show)}>
      <IconButton
        tabIndex={show ? 0 : -1}
        ref={type === 'left' ? leftBtnRef : rightBtnRef}
        aria-label={`Scroll ${ariaLabel} navigation ${type}`}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, direction)}
        icon={type === 'left' ? ChevronLeftIcon : ChevronRightIcon}
        sx={show ? getArrowBtnStyles(theme, type) : getArrowHiddenBtn(theme, type)}
        aria-disabled={!show}
      />
    </Box>
  )
}

export {ArrowButton}
