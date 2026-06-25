import {forwardRef, type HTMLAttributes} from 'react'
import type {OcticonReferenceProps} from './types'

const sizeMap = {
  small: 16,
  medium: 32,
  large: 64,
}

type Size = 'small' | 'medium' | 'large'

type IconProps = HTMLAttributes<SVGSVGElement> &
  OcticonReferenceProps & {
    size?: Size | number
    sizes: Record<
      string,
      {
        id: string
        width: number
      }
    >
  }

const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  {'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, className, size = 16, sizes, tabIndex, title, ...rest},
  ref,
) {
  const height = typeof size === 'number' ? size : sizeMap[size]
  const heights = Object.keys(sizes)
  const naturalHeight = closestNaturalHeight(heights, height)
  const naturalWidth = sizes[naturalHeight].width
  const width = height * (naturalWidth / naturalHeight)
  const id = sizes[naturalHeight].id
  const labelled = ariaLabel || ariaLabelledBy
  const role = labelled ? 'img' : undefined

  return (
    <svg
      {...rest}
      ref={ref}
      aria-hidden={labelled ? undefined : 'true'}
      tabIndex={tabIndex}
      focusable={tabIndex !== undefined && tabIndex >= 0 ? 'true' : 'false'}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={className}
      role={role}
      viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
      width={width}
      height={height}
    >
      {title ? <title>{title}</title> : null}
      <use href={`#${id}`} />
    </svg>
  )
})

function closestNaturalHeight(naturalHeights: Array<string>, height: number): number {
  const parsed = naturalHeights.map(naturalHeight => parseInt(naturalHeight, 10))

  return parsed.reduce((acc, naturalHeight) => {
    return naturalHeight <= height ? naturalHeight : acc
  }, parsed[0])
}

export {Icon}
export type {IconProps}
