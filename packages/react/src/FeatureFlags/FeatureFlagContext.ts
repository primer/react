import {createContext} from 'react'
import {FeatureFlagScope} from './FeatureFlagScope'
import {GlobalFeatureFlags} from './GlobalFeatureFlags'

export const FeatureFlagContext = createContext<FeatureFlagScope>(GlobalFeatureFlags)
