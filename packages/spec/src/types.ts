export type ComponentSpecFormat = 'single' | 'split'

export type SpecSeverity = 'error' | 'warning'

export type SpecDiagnosticCode =
  | 'ambiguous-spec'
  | 'duplicate-feature'
  | 'duplicate-heading'
  | 'empty-description'
  | 'empty-section'
  | 'feature-title-mismatch'
  | 'file-not-found'
  | 'forbidden-heading'
  | 'invalid-entry'
  | 'invalid-feature-link'
  | 'invalid-title'
  | 'missing-default-feature'
  | 'missing-feature-file'
  | 'missing-features'
  | 'missing-title'
  | 'orphan-feature-file'
  | 'read-failed'
  | 'unexpected-heading'

export interface SpecLocation {
  readonly path: string
  readonly line: number
  readonly column: number
}

export interface SpecDiagnostic {
  readonly code: SpecDiagnosticCode
  readonly message: string
  readonly severity: SpecSeverity
  readonly location: SpecLocation
}

export interface SpecSection {
  readonly heading: string
  readonly markdown: string
  readonly location: SpecLocation
}

export interface SpecFeatureSections {
  readonly markup?: SpecSection
  readonly behavior?: SpecSection
  readonly publicApi?: SpecSection
  readonly accessibility?: SpecSection
}

export interface SpecFeature {
  readonly name: string
  readonly description: string
  readonly sections: SpecFeatureSections
  readonly location: SpecLocation
  readonly path: string
}

export interface ComponentSpec {
  readonly name: string
  readonly description: string
  readonly accessibility?: SpecSection
  readonly features: readonly SpecFeature[]
  readonly glossary?: SpecSection
  readonly format: ComponentSpecFormat
  readonly entryPath: string
  readonly files: readonly string[]
}

export interface SpecFeatureLink {
  readonly name: string
  readonly href: string
  readonly location: SpecLocation
}

export interface SpecIndex {
  readonly name: string
  readonly description: string
  readonly accessibility?: SpecSection
  readonly features: readonly SpecFeatureLink[]
  readonly glossary?: SpecSection
  readonly path: string
}

export interface SpecParseResult<T = ComponentSpec> {
  readonly valid: boolean
  readonly value: T | null
  readonly diagnostics: readonly SpecDiagnostic[]
}

export interface SpecCollectionResult {
  readonly valid: boolean
  readonly specs: readonly ComponentSpec[]
  readonly diagnostics: readonly SpecDiagnostic[]
}

export interface FindComponentSpecsOptions {
  readonly ignore?: readonly string[]
}
