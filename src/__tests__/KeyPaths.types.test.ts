import {KeyPaths} from '../utils/types/KeyPaths'

type NestedObject = {
  a: string
  b: {
    b1: string
    b2: string
  }
}

export function generatesKeyPathsFromObject(x: KeyPaths<NestedObject>): 'a' | 'b.b1' | 'b.b2' {
  return x
}
