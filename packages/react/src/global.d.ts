// eslint-disable-next-line no-var
declare var __DEV__: boolean

// we have to declare this for tsc on the command line
// because tsc doesn't support loading plugins yet
// reference: https://github.com/mrmckeb/typescript-plugin-css-modules/issues/57#issuecomment-544832759
declare module '*.module.css' {
  const classes: {[key: string]: string}
  export default classes
}

declare module '*?raw' {
  const content: string
  export default content
}
