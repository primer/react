import path from 'path'
import {describe, it, expect} from 'vitest'
import {parseTypeInfo} from '../ts-utils'

const directory = path.resolve(import.meta.dirname)
const FIXTURE_PATH = path.join(directory, 'fixtures')

describe('getPropTypeForComponent', () => {
  it('extracts props for FunctionComponent', () => {
    const info = parseTypeInfo(FIXTURE_PATH, 'FunctionComponent')
    expect(info.props.foo).toMatchObject({name: 'foo', type: 'string', required: true})
    expect(info.props.bar).toMatchObject({name: 'bar', type: 'number', required: false})
    expect(info.props.baz).toMatchObject({name: 'baz', type: 'boolean', required: false})
  }, 10000)

  it('extracts props for ArrowComponent', () => {
    const info = parseTypeInfo(FIXTURE_PATH, 'ArrowComponent')
    expect(info.props.alpha).toMatchObject({name: 'alpha', type: 'number', required: true})
    expect(info.props.beta).toMatchObject({name: 'beta', type: 'string', required: false})
  }, 10000)

  it('extracts props for DefaultExportComponent', () => {
    const info = parseTypeInfo(FIXTURE_PATH, 'DefaultExportComponent')
    expect(info.props.a).toMatchObject({name: 'a', type: 'string', required: true})
    expect(info.props.b).toMatchObject({name: 'b', type: 'boolean', required: false})
  }, 10000)

  it('extracts props for ArrowComponent w/ indirection', () => {
    const info = parseTypeInfo(path.join(FIXTURE_PATH, 'exports'), 'ArrowComponent')
    expect(info.props.alpha).toMatchObject({name: 'alpha', type: 'number', required: true})
    expect(info.props.beta).toMatchObject({name: 'beta', type: 'string', required: false})
  }, 10000)

  it('extracts props for NestedComponent', () => {
    const info = parseTypeInfo(FIXTURE_PATH, 'NestedComponent')
    expect(info.props.bar).toMatchObject({name: 'bar', type: 'string', required: true})

    expect(info.subComponents).toHaveProperty('SubComponent')
    expect(info.subComponents?.SubComponent.props.foo).toMatchObject({name: 'foo', type: 'string', required: true})

    expect(info.subComponents).toHaveProperty('SubComponent2')
    expect(info.subComponents?.SubComponent2.props.baz).toMatchObject({name: 'baz', type: 'number', required: true})
  }, 10000)
})
