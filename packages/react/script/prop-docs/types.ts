import type ts from 'typescript'

interface StringIndexedObject<T> {
  [key: string]: T
}

interface ParentType {
  name: string
  fileName: string
}

interface MethodParameterType {
  name: string
}

interface MethodParameter {
  name: string
  description?: string | null
  type: MethodParameterType
}

interface Method {
  name: string
  docblock: string
  modifiers: string[]
  params: MethodParameter[]
  returns?: {
    description?: string | null
    type?: string
  } | null
  description: string
}

interface Props extends StringIndexedObject<PropItem> {}

export interface PropItemType {
  name: string
  value?: unknown
  raw?: string
}

export interface PropItem {
  name: string
  required: boolean
  type: PropItemType
  description: string
  defaultValue: any
  parent?: ParentType
  declarations?: ParentType[]
  tags?: StringIndexedObject<string>
}

export interface Component {
  name: string
}

export interface ComponentDoc {
  expression?: ts.Symbol
  rootExpression?: ts.Symbol
  displayName: string
  filePath: string
  description: string
  props: Props
  methods: Method[]
  tags?: StringIndexedObject<string>
}
