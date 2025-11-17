export type ChildSize = {
  text: string
  width: number
}
export type ChildWidthArray = Array<ChildSize>
export type ResponsiveProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Array<React.ReactElement<any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItems: Array<React.ReactElement<any>>
}
