import React from 'react'
import {IconButton} from '../Button/IconButton'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import {leftArrawHiddenBtn, rightArrowHiddenBtn, leftArrowVisibleBtn, rightArrowVisibleBtn} from './styles'
import {OnScrollWithButtonEventType} from './types'

const LeftArrowButton = ({
  show,
  onScrollWithButton
}: {
  show: boolean
  onScrollWithButton: OnScrollWithButtonEventType
}) => {
  return (
    <IconButton
      aria-label="Scroll Left"
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, -1)}
      icon={ChevronLeftIcon}
      sx={show ? leftArrowVisibleBtn : leftArrawHiddenBtn}
    />
  )
}

const RightArrowButton = ({
  show,
  onScrollWithButton
}: {
  show: boolean
  onScrollWithButton: OnScrollWithButtonEventType
}) => {
  return (
    <IconButton
      aria-label="Scroll Right"
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, 1)}
      icon={ChevronRightIcon}
      sx={show ? rightArrowVisibleBtn : rightArrowHiddenBtn}
    />
  )
}

export {LeftArrowButton, RightArrowButton}
