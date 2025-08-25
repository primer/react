export interface DocsPropInfo {
  name: string
  required: boolean
  type?: string
  description?: string
  defaultValue?: string
}

export interface DocsFile {
  name: string
  props: DocsPropInfo[]
}
