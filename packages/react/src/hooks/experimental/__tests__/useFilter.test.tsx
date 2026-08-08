import {renderHook, act} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {useFilter} from '../useFilter'

const branches = [{name: 'main'}, {name: 'develop'}, {name: 'feature/tabs'}]
const tags = [{name: 'v1.0'}, {name: 'v2.0'}]

describe('useFilter', () => {
  it('matches case-insensitively by substring', () => {
    const {result} = renderHook(() => useFilter())
    act(() => result.current.setQuery('FEAT'))
    expect(result.current.matches('feature/tabs')).toBe(true)
    expect(result.current.matches('main')).toBe(false)
  })

  it('an empty query matches everything', () => {
    const {result} = renderHook(() => useFilter())
    expect(result.current.matches('anything')).toBe(true)
  })

  it('one query filters multiple datasets', () => {
    const {result} = renderHook(() => useFilter())
    act(() => result.current.setQuery('v'))
    expect(result.current.filter(branches, b => b.name).map(b => b.name)).toEqual(['develop'])
    expect(result.current.filter(tags, t => t.name).map(t => t.name)).toEqual(['v1.0', 'v2.0'])
  })

  it('count returns per-dataset match counts (for tab badges)', () => {
    const {result} = renderHook(() => useFilter())
    act(() => result.current.setQuery('e'))
    expect(result.current.count(branches, b => b.name)).toBe(2) // develop, feature/tabs
    expect(result.current.count(tags, t => t.name)).toBe(0)
  })

  it('supports a controlled query', () => {
    const {result, rerender} = renderHook(({q}) => useFilter({query: q}), {initialProps: {q: 'ma'}})
    expect(result.current.matches('main')).toBe(true)
    rerender({q: 'zzz'})
    expect(result.current.matches('main')).toBe(false)
  })
})
