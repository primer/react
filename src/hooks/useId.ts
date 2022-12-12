// eslint-disable-next-line import/no-namespace
import * as React from 'react'
// eslint-disable-next-line no-restricted-imports
import {useSSRSafeId} from '@react-aria/ssr'

/**
 * Detect if `React.useId()` is present. This strategy is a workaround for:
 * https://github.com/webpack/webpack/issues/14814
 *
 * This technique is inspired by Material UI:
 * https://github.com/mui/material-ui/blob/7bc478ec00a3b5625427f36c827e00b0a17be3d0/packages/mui-utils/src/useId.ts#L21
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-useless-concat
const useReactId: undefined | (() => string) = (React as any)['useId' + '']

export function useId(id?: string) {
  // Force useSSRSafeId in test environments to maintain snapshot parity between
  // major versions of React
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSSRSafeId(id)
  }

  if (useReactId !== undefined) {
    if (id) {
      return id
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useReactId()
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSSRSafeId(id)
}
