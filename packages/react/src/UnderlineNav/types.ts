// Maps a React element key (assigned by React.Children.toArray) to the
// measured pixel width of the rendered item. Keyed by `String(element.key)`
// rather than by item text so that items whose `children` aren't a plain
// string (e.g. `<><Icon /> Label</>`) still resolve correctly during swap
// and overflow calculations.
export type ChildWidthMap = Map<string, number>

export type ResponsiveProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Array<React.ReactElement<any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItems: Array<React.ReactElement<any>>
}
