import Spinner from '../Spinner'
import {Stack} from '../Stack/Stack'
import {SkeletonBox} from '../Skeleton/SkeletonBox'
import classes from './FilteredActionListLoaders.module.css'

import type {JSX} from 'react'

export class FilteredActionListLoadingType {
  public name: string
  public appearsInBody: boolean

  constructor(name: string, appearsInBody: boolean) {
    this.name = name
    this.appearsInBody = appearsInBody
  }
}

export const FilteredActionListLoadingTypes = {
  bodySpinner: new FilteredActionListLoadingType('body-spinner', true),
  bodySkeleton: new FilteredActionListLoadingType('body-skeleton', true),
  input: new FilteredActionListLoadingType('input', false),
}

const SKELETON_ROW_HEIGHT = 24
const SKELETON_MIN_ROWS = 3

// Deterministic widths to avoid hydration mismatch from Math.random()
// Pattern creates visual variety while being consistent across server/client
const SKELETON_WIDTHS = [65, 45, 80, 35, 55, 70, 40, 60, 50, 75]

export function FilteredActionListBodyLoader({
  loadingType,
  height,
}: {
  loadingType: FilteredActionListLoadingType
  height: number
}): JSX.Element {
  switch (loadingType) {
    case FilteredActionListLoadingTypes.bodySpinner:
      return <LoadingSpinner data-testid="filtered-action-list-spinner" />
    case FilteredActionListLoadingTypes.bodySkeleton: {
      const rows = height < SKELETON_ROW_HEIGHT ? SKELETON_MIN_ROWS : height / SKELETON_ROW_HEIGHT
      return <LoadingSkeleton data-testid="filtered-action-list-skeleton" rows={rows} />
    }
    default:
      return <></>
  }
}

function LoadingSpinner({...props}): JSX.Element {
  return (
    <div className={classes.LoadingSpinner}>
      <Spinner {...props} />
    </div>
  )
}

function LoadingSkeleton({rows = 10, ...props}: {rows: number}): JSX.Element {
  return (
    <div className={classes.LoadingSkeletonContainer}>
      <Stack direction="vertical" justify="center" gap="condensed" {...props}>
        {Array.from({length: rows}, (_, i) => (
          <Stack key={i} direction="horizontal" gap="condensed" align="center">
            <SkeletonBox width="16px" height="16px" />
            <SkeletonBox
              height="10px"
              width={`${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%`}
              className={classes.LoadingSkeleton}
            />
          </Stack>
        ))}
      </Stack>
    </div>
  )
}
