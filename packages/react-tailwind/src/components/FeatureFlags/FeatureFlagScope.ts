export interface FeatureFlagValues {
  readonly [name: string]: boolean | undefined
}

export class FeatureFlagScope {
  private readonly flags: ReadonlyMap<string, boolean>

  private constructor(flags: ReadonlyMap<string, boolean>) {
    this.flags = flags
  }

  static create(flags: FeatureFlagValues = {}): FeatureFlagScope {
    return new FeatureFlagScope(new Map(Object.entries(flags).map(([name, enabled]) => [name, enabled ?? false])))
  }

  static merge(parent: FeatureFlagScope, child: FeatureFlagScope): FeatureFlagScope {
    return new FeatureFlagScope(new Map([...parent.flags, ...child.flags]))
  }

  enabled(name: string): boolean {
    return this.flags.get(name) ?? false
  }
}
