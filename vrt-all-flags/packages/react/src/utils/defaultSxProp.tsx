import type {BetterSystemStyleObject} from '../sx'

export const defaultSxProp: Readonly<BetterSystemStyleObject> = __DEV__
  ? Object.freeze<BetterSystemStyleObject>({})
  : {}
