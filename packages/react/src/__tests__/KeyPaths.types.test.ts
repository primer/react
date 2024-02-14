import type {Union} from 'ts-toolbelt'
import type {KeyPaths} from '../utils/types/KeyPaths'

type NestedObject = {
  a: string
  b: {
    b1: string
    b2: string
  }
}

export function generatesKeyPathsFromObject(x: Union.Diff<KeyPaths<NestedObject>, 'a' | 'b.b1' | 'b.b2'>): never {
  return x
}
