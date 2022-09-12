import React from 'react'
import {IconButton, Box} from '..'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import {
  arrowParentStyles,
  hiddenBtn,
  leftArrowFadeEffectStyles,
  rightArrowFadeEffectStyles,
  arrowBtnStyles
} from './styles'
import {OnScrollWithButtonEventType} from './types'

const LeftArrowButton = ({
  show,
  onScrollWithButton
}: {
  show: boolean
  onScrollWithButton: OnScrollWithButtonEventType
}) => {
  return (
    <Box as="span" sx={arrowParentStyles}>
      <IconButton
        aria-label="Scroll Left"
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, -1)}
        icon={ChevronLeftIcon}
        sx={show ? arrowBtnStyles : hiddenBtn}
      />
      {show && <Box as="span" sx={leftArrowFadeEffectStyles} />}
    </Box>
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
    <Box as="span" sx={arrowParentStyles}>
      {show && <Box as="span" sx={rightArrowFadeEffectStyles} />}
      <IconButton
        aria-label="Scroll Right"
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, 1)}
        icon={ChevronRightIcon}
        sx={show ? arrowBtnStyles : hiddenBtn}
      />
    </Box>
  )
}

export {LeftArrowButton, RightArrowButton}
