import React from 'react'
import {SxProp} from '../../sx'
import {BaseSkeletonBone} from './_BaseSkeletonBone'

type SkeletonBoneProps = {
  height?: React.CSSProperties['height']
  width?: React.CSSProperties['width']
}

export const SkeletonBone: React.FC<SkeletonBoneProps & SxProp> = ({height = '1rem', ...rest}) => (
  <BaseSkeletonBone data-component="SkeletonBone" height={height} {...rest} />
)
