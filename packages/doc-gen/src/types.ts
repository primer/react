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
  subcomponents?: Array<DocsFile>
}

export interface AuthoredDocsFile extends DocsFile {
  props: AuthoredDocsPropInfo[]
}

export interface AuthoredDocsPropInfo extends DocsPropInfo {
  /**
   * Set to true when the property should be taking default values from TS
   * Any additional properties specified in the docs.json file will override the TS defaults
   */
  derive?: boolean
}
