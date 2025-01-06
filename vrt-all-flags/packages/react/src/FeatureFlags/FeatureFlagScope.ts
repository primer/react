export type FeatureFlags = {
  [key: string]: boolean | undefined
}

export class FeatureFlagScope {
  static create(flags?: FeatureFlags): FeatureFlagScope {
    return new FeatureFlagScope(flags)
  }

  static merge(a: FeatureFlagScope, b: FeatureFlagScope): FeatureFlagScope {
    const merged = new FeatureFlagScope()

    for (const [key, value] of a.flags) {
      merged.flags.set(key, value)
    }

    for (const [key, value] of b.flags) {
      merged.flags.set(key, value)
    }

    return merged
  }

  flags: Map<string, boolean>

  constructor(flags: FeatureFlags = {}) {
    this.flags = new Map()
    for (const [key, value] of Object.entries(flags)) {
      this.flags.set(key, value ?? false)
    }
  }

  /**
   * Enable a feature flag
   */
  public enable(name: string): void {
    this.flags.set(name, true)
  }

  /**
   * Disable a feature flag
   */
  public disable(name: string): void {
    this.flags.set(name, false)
  }

  /**
   * Check if a feature flag is enabled
   */
  public enabled(name: string): boolean {
    return this.flags.get(name) ?? false
  }
}
