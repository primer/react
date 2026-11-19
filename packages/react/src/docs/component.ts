type ComponentDocs = {
  id: string
  name: string
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
export type {ComponentDocs}
