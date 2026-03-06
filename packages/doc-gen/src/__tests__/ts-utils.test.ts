import {describe, it, expect} from 'vitest'
import path from 'node:path'
import {parseTypeInfo, generateJSDocString} from '../ts-utils'

const directory = path.resolve(import.meta.dirname)
const FIXTURE_PATH = path.join(directory, 'fixtures')

describe('generateJSDocString', () => {
  const info = parseTypeInfo(FIXTURE_PATH, 'FunctionComponent')

  it('basic props', async () => {
    const jsDocs = generateJSDocString(info.props.foo!, {
      defaultValue: 'new default value',
      name: 'foo',
      required: true,
      description: 'Updated description',
    })

    expect(jsDocs).toMatchInlineSnapshot(`
      "/**
       * Updated description
       *
       * @default "new default value"
       */"
    `)
  })

  it('string escaping', async () => {
    const jsDocs = generateJSDocString(info.props.foo!, {
      defaultValue: '"new default value"',
      name: 'foo',
      required: true,
      description: 'Updated description',
    })

    expect(jsDocs).toMatchInlineSnapshot(`
      "/**
       * Updated description
       *
       * @default "new default value"
       */"
    `)
  })

  it('deprecated', async () => {
    const jsDocs = generateJSDocString(info.props.foo!, {
      defaultValue: 'new default value',
      name: 'foo',
      required: true,
      deprecated: true,
      description: 'Updated description',
    })

    expect(jsDocs).toMatchInlineSnapshot(`
      "/**
       * Updated description
       *
       * @default "new default value"
       * @deprecated
       */"
    `)
  })
})
