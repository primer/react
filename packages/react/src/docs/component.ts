type BuiltInBehavior = {
  id: string
  description: string
  related?: Array<string>
}

type DefaultBehavior = {
  id: string
  description: string
  overriddenBy: Array<string>
  related?: Array<string>
}

type UsageGuideline = {
  id: string
  guidance: 'do' | 'dont'
  check: 'runtime' | 'review'
  description: string
  related?: Array<string>
}

type ComponentDocs = {
  id: string
  name: string
  docsId?: string
  status: ComponentStatus
  a11yReviewed: boolean | string
  importPath: string
  props: Array<ComponentProp>
  subcomponents: Array<Subcomponent>
  relatedTypes?: Array<{
    name: string
    displayName?: string
    props: Array<ComponentProp>
  }>
  stories: Array<string>
  passthrough?: Passthrough
  builtInBehaviors?: Array<BuiltInBehavior>
  defaultBehaviors?: Array<DefaultBehavior>
  usageGuidelines?: Array<UsageGuideline>
}

type ComponentStatus = 'stable' | 'draft' | 'alpha' | 'beta' | 'deprecated'

type Subcomponent = {
  name: string
  displayName: string
  props: Array<ComponentProp>
  passthrough?: Passthrough
}

type Passthrough = {
  element: string
  url: string
}

type ComponentProp = {
  name: string
  type: string
  description: string
  required: boolean
  defaultValue?: string
}

function defineComponent<const T extends ComponentDocs>(component: T): T {
  return component
}

export {defineComponent}
export type {BuiltInBehavior, ComponentDocs, DefaultBehavior, UsageGuideline}
