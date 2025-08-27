import {describe, expect, it} from 'vitest'
import {createComparisonSummary} from '..'
import type ts from 'typescript'
import type {AuthoredDocsFile} from '../types'
import type {TSParsedComponentInfo} from '../ts-utils'

describe('compareProps', () => {
  it('Marks props that match as the same', () => {
    const docs: AuthoredDocsFile = {
      name: 'TestComponent',
      props: [
        {
          name: 'testProp',
          type: 'string',
          required: true,
          defaultValue: 'default',
          description: 'A test prop',
        },
      ],
    }

    const parsedTSInfo: TSParsedComponentInfo = {
      componentName: 'TestComponent',
      componentPath: '../TestComponent',
      sourceFile: '../TestComponent.tsx',
      props: {
        testProp: {
          name: 'testProp',
          propSymbol: null as unknown as ts.Symbol,
          type: 'string',
          required: true,
          defaultValue: 'default',
          description: 'A test prop',
        },
      },
    }

    const comparison = createComparisonSummary(docs, parsedTSInfo)

    expect(comparison).toEqual({
      testProp: {
        name: 'testProp',
        missingInTS: false,
        missingInDocs: false,
        mismatchedType: false,
        mismatchedRequired: false,
        mismatchedDefaultValue: false,
        missingJSDoc: false,
      },
    })
  })

  it('Marks prop missing in TS', () => {
    const docs: AuthoredDocsFile = {
      name: 'TestComponent',
      props: [
        {
          name: 'onlyInDocs',
          type: 'string',
          required: false,
          defaultValue: '',
          description: 'Docs only prop',
        },
      ],
    }
    const parsedTSInfo: TSParsedComponentInfo = {
      componentName: 'TestComponent',
      componentPath: '../TestComponent',
      sourceFile: '../TestComponent.tsx',
      props: {},
    }
    const comparison = createComparisonSummary(docs, parsedTSInfo)
    expect(comparison).toEqual({
      onlyInDocs: expect.objectContaining({
        missingInTS: true,
        missingInDocs: false,
      }),
    })
  })

  it('Marks prop missing in Docs', () => {
    const docs: AuthoredDocsFile = {
      name: 'TestComponent',
      props: [],
    }
    const parsedTSInfo: TSParsedComponentInfo = {
      componentName: 'TestComponent',
      componentPath: '../TestComponent',
      sourceFile: '../TestComponent.tsx',
      props: {
        onlyInTS: {
          name: 'onlyInTS',
          propSymbol: null as unknown as ts.Symbol,
          type: 'number',
          required: false,
          defaultValue: undefined,
          description: 'TS only prop',
        },
      },
    }
    const comparison = createComparisonSummary(docs, parsedTSInfo)
    expect(comparison).toEqual({
      onlyInTS: expect.objectContaining({
        missingInTS: false,
        missingInDocs: true,
      }),
    })
  })

  it('Detects mismatched type', () => {
    const docs: AuthoredDocsFile = {
      name: 'TestComponent',
      props: [
        {
          name: 'foo',
          type: 'string',
          required: false,
          defaultValue: '',
          description: '',
        },
      ],
    }
    const parsedTSInfo: TSParsedComponentInfo = {
      componentName: 'TestComponent',
      componentPath: '../TestComponent',
      sourceFile: '../TestComponent.tsx',
      props: {
        foo: {
          name: 'foo',
          propSymbol: null as unknown as ts.Symbol,
          type: 'number',
          required: false,
          defaultValue: undefined,
          description: '',
        },
      },
    }
    const comparison = createComparisonSummary(docs, parsedTSInfo)
    expect(comparison.foo.mismatchedType).toBe(true)
  })

  it('Detects mismatched required', () => {
    const docs: AuthoredDocsFile = {
      name: 'TestComponent',
      props: [
        {
          name: 'bar',
          type: 'string',
          required: true,
          defaultValue: '',
          description: '',
        },
      ],
    }
    const parsedTSInfo: TSParsedComponentInfo = {
      componentName: 'TestComponent',
      componentPath: '../TestComponent',
      sourceFile: '../TestComponent.tsx',
      props: {
        bar: {
          name: 'bar',
          propSymbol: null as unknown as ts.Symbol,
          type: 'string',
          required: false,
          defaultValue: undefined,
          description: '',
        },
      },
    }
    const comparison = createComparisonSummary(docs, parsedTSInfo)
    expect(comparison.bar.mismatchedRequired).toBe(true)
  })

  it('Detects mismatched default value', () => {
    const docs: AuthoredDocsFile = {
      name: 'TestComponent',
      props: [
        {
          name: 'baz',
          type: 'string',
          required: false,
          defaultValue: 'abc',
          description: '',
        },
      ],
    }
    const parsedTSInfo: TSParsedComponentInfo = {
      componentName: 'TestComponent',
      componentPath: '../TestComponent',
      sourceFile: '../TestComponent.tsx',
      props: {
        baz: {
          name: 'baz',
          propSymbol: null as unknown as ts.Symbol,
          type: 'string',
          required: false,
          defaultValue: 'def',
          description: '',
        },
      },
    }
    const comparison = createComparisonSummary(docs, parsedTSInfo)
    expect(comparison.baz.mismatchedDefaultValue).toBe(true)
  })

  it('Detects missing JSDoc', () => {
    const docs: AuthoredDocsFile = {
      name: 'TestComponent',
      props: [
        {
          name: 'qux',
          type: 'string',
          required: false,
          defaultValue: '',
          description: 'Should have JSDoc',
        },
      ],
    }
    const parsedTSInfo: TSParsedComponentInfo = {
      componentName: 'TestComponent',
      componentPath: '../TestComponent',
      sourceFile: '../TestComponent.tsx',
      props: {
        qux: {
          name: 'qux',
          propSymbol: null as unknown as ts.Symbol,
          type: 'string',
          required: false,
          defaultValue: '',
          description: '',
        },
      },
    }
    const comparison = createComparisonSummary(docs, parsedTSInfo)
    expect(comparison.qux.missingJSDoc).toBe(true)
  })
})
