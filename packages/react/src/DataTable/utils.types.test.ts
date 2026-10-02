import {expectTypeOf} from 'vitest'
import type {Column} from './column'
import type {ObjectPaths} from './utils'

export function shouldPreserveObjectPaths() {
  expectTypeOf<ObjectPaths<{id: number; owner: {login: string}}>>().toEqualTypeOf<'id' | 'owner' | 'owner.login'>()
  expectTypeOf<ObjectPaths<{owner?: {login: string}}>>().toEqualTypeOf<'owner' | 'owner.login'>()
  expectTypeOf<ObjectPaths<{id: number} | {name: string}>>().toEqualTypeOf<'id' | 'name'>()
  expectTypeOf<ObjectPaths<{owners: readonly [string, {login: string}]}>>().toEqualTypeOf<
    'owners' | 'owners.0' | 'owners.1' | 'owners.1.login'
  >()
  expectTypeOf<ObjectPaths<{createdAt: Date; names: string[]}>>().toEqualTypeOf<'createdAt' | 'names'>()
  expectTypeOf<ObjectPaths<unknown>>().toEqualTypeOf<never>()
  expectTypeOf<ObjectPaths<never>>().toEqualTypeOf<never>()
}

export function shouldPreserveAnyObjectPathsWithoutRecursing() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectTypeOf<ObjectPaths<any>>().toEqualTypeOf<string | number>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectTypeOf<ObjectPaths<{id: number; metadata: any}>>().toEqualTypeOf<'id' | 'metadata' | `metadata.${string}`>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectTypeOf<Column<any>['field']>().toEqualTypeOf<string | number | undefined>()
}
