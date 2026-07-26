'use client'

import {useContext} from 'react'
import {FeatureFlagContext} from './FeatureFlagContext'

export function useFeatureFlag(name: string): boolean {
  return useContext(FeatureFlagContext).enabled(name)
}
;('use client')
