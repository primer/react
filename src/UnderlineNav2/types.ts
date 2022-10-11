import {BetterSystemStyleObject} from '../sx'
export type ChildWidthArray = Array<{text: string; width: number}>
export type ResponsiveProps = {
  items: Array<React.ReactElement>
  actions: Array<React.ReactElement>
  overflowStyles: BetterSystemStyleObject
}

export type OnScrollWithButtonEventType = (event: React.MouseEvent<HTMLButtonElement>, direction: -1 | 1) => void
