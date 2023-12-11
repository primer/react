import React from 'react'
import {SxProp} from '../../sx'
import {BaseSkeletonBone} from './_BaseSkeletonBone'

type SkeletonBoneProps = {
  /** Height of the skeleton "bone". Accepts any valid CSS `height` value. */
  height?: React.CSSProperties['height']
  /** Width of the skeleton "bone". Accepts any valid CSS `width` value. */
  width?: React.CSSProperties['width']
}

export const SkeletonBone: React.FC<SkeletonBoneProps & SxProp> = ({height = '1rem', ...rest}) => (
  <BaseSkeletonBone data-component="SkeletonBone" height={height} {...rest} />
)
