import {createContext} from 'react'
import type {FeatureFlagScope} from './FeatureFlagScope'
import {DefaultFeatureFlags} from './DefaultFeatureFlags'

export const FeatureFlagContext = createContext<FeatureFlagScope>(DefaultFeatureFlags)
