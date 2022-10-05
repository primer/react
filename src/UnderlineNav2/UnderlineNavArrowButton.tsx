import React, {useContext} from 'react'
import {IconButton} from '../Button/IconButton'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import {getLeftArrowHiddenBtn, getRightArrowHiddenBtn, getLeftArrowVisibleBtn, getRightArrowVisibleBtn} from './styles'
import {OnScrollWithButtonEventType} from './types'
import {UnderlineNavContext} from './UnderlineNavContext'

const ArrowButton = ({
  type,
  show,
  onScrollWithButton,
  ariaLabel = 'navigation'
}: {
  type: 'left' | 'right'
  show: boolean
  onScrollWithButton: OnScrollWithButtonEventType
  ariaLabel: string
}) => {
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const {theme} = useContext(UnderlineNavContext)
  const direction = type === 'left' ? -1 : 1
  const leftBtnStyle = show ? getLeftArrowVisibleBtn(theme) : getLeftArrowHiddenBtn(theme)
  const rightBtnStyle = show ? getRightArrowVisibleBtn(theme) : getRightArrowHiddenBtn(theme)
  // re-trigger focus on the button with aria-disabled=true when it becomes hidden to communicate to screen readers that the button is no longer available
  React.useEffect(() => {
    if (btnRef.current?.getAttribute('aria-disabled') === 'true') {
      btnRef.current.focus()
    }
  }, [show])
  return (
    <IconButton
      ref={btnRef}
      aria-label={`Scroll ${ariaLabel} navigation ${type}`}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, direction)}
      icon={type === 'left' ? ChevronLeftIcon : ChevronRightIcon}
      sx={type === 'left' ? leftBtnStyle : rightBtnStyle}
      aria-disabled={!show}
    />
  )
}

export {ArrowButton}
