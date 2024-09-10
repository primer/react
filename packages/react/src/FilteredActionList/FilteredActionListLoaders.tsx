import React from 'react'
import Box from '../Box'
import Spinner from '../Spinner'
import {SkeletonBox} from '../drafts'

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
  let loader: JSX.Element

  switch (loadingType) {
    case FilteredActionListLoadingTypes.bodySpinner:
      loader = <Spinner data-testid="filtered-action-list-spinner" />
      break
    case FilteredActionListLoadingTypes.bodySkeleton:
      loader = <LoadingSkeleton data-testid="filtered-action-list-skeleton" rows={10} />
      break
    default:
      return <></>
  }

  return (
    <Box width="100%" display="flex" flexDirection="column" justifyContent="center" p={2} sx={{gap: 2}}>
      {loader}
    </Box>
  )
}

function LoadingSkeleton({rows = 10, ...props}: {rows: number}): JSX.Element {
  return (
    <Box {...props}>
      {Array.from({length: rows}, (_, i) => (
        <Box key={i} display="flex" sx={{gap: 2}} alignItems="center">
          <SkeletonBox width="16px" height="16px" />
          <SkeletonBox height="10px" width={`${Math.random() * 70 + 10}%`} borderRadius={2} />
        </Box>
      ))}
    </Box>
  )
}
