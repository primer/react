import React from 'react'
import styled from 'styled-components'
import {get} from '../../constants'
import Spinner from '../../Spinner'
import sx, {SxProp} from '../../sx'
import {ComponentProps} from '../../utils/types'

const Animation = styled.div<SxProp>`
  padding: ${get('space.6')} ${get('space.4')};
  text-align: center;
  background-color: ${get('colors.canvas.overlay')};
  ${sx}
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
