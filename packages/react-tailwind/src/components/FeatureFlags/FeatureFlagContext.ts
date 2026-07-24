import {createContext} from 'react'
import {DefaultFeatureFlags} from './DefaultFeatureFlags'
import type {FeatureFlagScope} from './FeatureFlagScope'

export const FeatureFlagContext = createContext<FeatureFlagScope>(DefaultFeatureFlags)
