import React from 'react'
import {IconButton} from '../Button/IconButton'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import {getLeftArrowHiddenBtn, getRightArrowHiddenBtn, getLeftArrowVisibleBtn, getRightArrowVisibleBtn} from './styles'
import {OnScrollWithButtonEventType} from './types'
import {useTheme} from '../ThemeProvider'

const LeftArrowButton = ({
  show,
  onScrollWithButton,
  tabIndex
}: {
  show: boolean
  onScrollWithButton: OnScrollWithButtonEventType
  tabIndex?: number
}) => {
  const {theme} = useTheme()
  return (
    <IconButton
      tabIndex={tabIndex}
      aria-label="Scroll Left"
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, -1)}
      icon={ChevronLeftIcon}
      sx={show ? getLeftArrowVisibleBtn(theme) : getLeftArrowHiddenBtn(theme)}
    />
  )
}

const RightArrowButton = ({
  show,
  onScrollWithButton,
  tabIndex
}: {
  show: boolean
  onScrollWithButton: OnScrollWithButtonEventType
  tabIndex?: number
}) => {
  const {theme} = useTheme()
  return (
    <IconButton
      tabIndex={tabIndex}
      aria-label="Scroll Right"
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onScrollWithButton(e, 1)}
      icon={ChevronRightIcon}
      sx={show ? getRightArrowVisibleBtn(theme) : getRightArrowHiddenBtn(theme)}
    />
  )
}

export {LeftArrowButton, RightArrowButton}
