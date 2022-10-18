import {BetterSystemStyleObject} from '../sx'
export type ChildWidthArray = Array<{text: string; width: number}>
export type ResponsiveProps = {
  items: Array<React.ReactElement>
  actions: Array<React.ReactElement>
  overflowStyles: BetterSystemStyleObject
}
