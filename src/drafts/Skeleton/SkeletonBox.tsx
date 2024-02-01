import React from 'react'
import {SxProp} from '../../sx'
import {BaseSkeletonBox} from './_BaseSkeletonBox'

type SkeletonBoxProps = {
  /** Height of the skeleton "box". Accepts any valid CSS `height` value. */
  height?: React.CSSProperties['height']
  /** Width of the skeleton "box". Accepts any valid CSS `width` value. */
  width?: React.CSSProperties['width']
}

export const SkeletonBox: React.FC<SkeletonBoxProps & SxProp> = ({height = '1rem', ...rest}) => (
  <BaseSkeletonBox data-component="SkeletonBox" height={height} {...rest} />
)
