import React from 'react'
import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from '../constants'
import Spinner from '../Spinner'
import {ComponentProps} from '../utils/types'

const Animation = styled.div<SystemCommonProps>`
  padding: ${get('space.6')} ${get('space.4')};
  text-align: center;
  background-color: ${get('colors.bg.overlay')};
  ${COMMON}
`

export type SelectMenuLoadingAnimationProps = ComponentProps<typeof Animation>

const SelectMenuLoadingAnimation = (props: SelectMenuLoadingAnimationProps) => {
  return (
    <Animation {...props}>
      <Spinner />
    </Animation>
  )
}

export default SelectMenuLoadingAnimation
