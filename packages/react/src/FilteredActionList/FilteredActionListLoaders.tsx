import React from 'react'
import Box from '../Box'
import Spinner from '../Spinner'
import {Stack} from '../Stack/Stack'
import {SkeletonBox} from '../experimental/Skeleton/SkeletonBox'

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

export function FilteredActionListBodyLoader({loadingType}: {loadingType: FilteredActionListLoadingType}): JSX.Element {
  switch (loadingType) {
    case FilteredActionListLoadingTypes.bodySpinner:
      return <LoadingSpinner data-testid="filtered-action-list-spinner" />
    case FilteredActionListLoadingTypes.bodySkeleton:
      return <LoadingSkeleton data-testid="filtered-action-list-skeleton" rows={10} />
    default:
      return <></>
  }
}

function LoadingSpinner({...props}): JSX.Element {
  return (
    <Box p={3}>
      <Stack direction="horizontal" justify="center">
        <Spinner {...props} />
      </Stack>
    </Box>
  )
}

function LoadingSkeleton({rows = 10, ...props}: {rows: number}): JSX.Element {
  return (
    <Box p={2}>
      <Stack direction="vertical" justify="center" gap="condensed" {...props}>
        {Array.from({length: rows}, (_, i) => (
          <Stack key={i} direction="horizontal" gap="condensed" align="center">
            <SkeletonBox width="16px" height="16px" />
            <SkeletonBox height="10px" width={`${Math.random() * 60 + 20}%`} sx={{borderRadius: '4px'}} />
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
