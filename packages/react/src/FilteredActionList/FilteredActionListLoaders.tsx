import Spinner from '../Spinner'
import {Stack} from '../Stack/Stack'
import {SkeletonBox} from '../Skeleton/SkeletonBox'
import classes from './FilteredActionListLoaders.module.css'
import {FilteredActionListLoadingType, FilteredActionListLoadingTypes} from './constants'

import type {JSX} from 'react'

export {FilteredActionListLoadingType, FilteredActionListLoadingTypes}

const SKELETON_ROW_HEIGHT = 24
const SKELETON_MIN_ROWS = 3

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
    <div className={classes.LoadingSpinner} data-component="FilteredActionList.Spinner">
      <Spinner {...props} />
    </div>
  )
}

function LoadingSkeleton({rows = 10, ...props}: {rows: number}): JSX.Element {
  return (
    <div className={classes.LoadingSkeletonContainer} data-component="FilteredActionList.Skeleton">
      <Stack direction="vertical" justify="center" gap="condensed" {...props}>
        {Array.from({length: rows}, (_, i) => (
          <Stack key={i} direction="horizontal" gap="condensed" align="center">
            <SkeletonBox width="16px" height="16px" />
            <SkeletonBox height="10px" width={`${20 + ((i * 17) % 61)}%`} className={classes.LoadingSkeleton} />
          </Stack>
        ))}
      </Stack>
    </div>
  )
}
