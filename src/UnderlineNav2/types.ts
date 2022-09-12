export type ChildWidthArray = Array<{width: number}>
export type ResponsiveProps = {
  items: Array<React.ReactElement>
  actions: Array<React.ReactElement>
  overflowStyles: React.CSSProperties
}

export type OnScrollWithButtonEventType = (event: React.MouseEvent<HTMLButtonElement>, direction: -1 | 1) => void
