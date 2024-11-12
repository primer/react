import React, {useId} from 'react'
import Box from '../Box'
import Spinner from '../Spinner'
import {Stack} from '../Stack/Stack'
import {SkeletonBox} from '../experimental/Skeleton/SkeletonBox'

export type LoadingTypes = 'spinner' | 'skeleton'

export const Loading = ({type = 'spinner', ...props}: {type?: LoadingTypes}) => {
  if (type === 'spinner') {
    return <LoadingSpinner {...props} />
  } else {
    return <LoadingSkeleton {...props} />
  }
}

function LoadingSpinner({...props}): JSX.Element {
  return (
    <Box
      sx={{display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%', padding: '40px 16px 48px'}}
    >
      <Spinner {...props} />
    </Box>
  )
}

function LoadingSkeleton({rows = 10, ...props}: {rows?: number}): JSX.Element {
  const id = useId()
  return (
    <Box p={2} display="flex" flexGrow={1} flexDirection="column">
      <Stack id={id} direction="vertical" justify="center" gap="condensed" {...props}>
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
