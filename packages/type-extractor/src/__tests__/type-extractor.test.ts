import ts from 'typescript'
import {getFileSymbols, getFileSymbol, types} from '../'

function getTypeScriptProgram(fsMap: Record<string, string>): ts.Program {
  const memfs = new Map()
  for (const [fileName, content] of Object.entries(fsMap)) {
    memfs.set(fileName, ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true))
  }

  const compilerOptions: ts.CompilerOptions = {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.Latest,
    skipLibCheck: true,
    strict: true,
    isolatedModules: true,
    esModuleInterop: true,
  }
  const host = ts.createCompilerHost(compilerOptions)
  const program = ts.createProgram({
    rootNames: Array.from(memfs.keys()),
    options: compilerOptions,
    host: {
      ...host,
      getSourceFile(fileName, ...args) {
        if (memfs.has(fileName)) {
          return memfs.get(fileName)
        }
        return host.getSourceFile(fileName, ...args)
      },
    },
  })
  const diagnostics = [
    ...program.getSyntacticDiagnostics(),
    ...program.getGlobalDiagnostics(),
    ...program.getSemanticDiagnostics(),
    ...program.getDeclarationDiagnostics(),
  ]
  if (diagnostics.length > 0) {
    throw new Error(diagnostics.map(d => d.messageText).join('\n'))
  }

  return program
}

describe('type-extractor', () => {
  test.each(
    (
      [
        [
          'numeric literal',
          'export const test = 1',
          {
            test: {
              name: 'test',
              type: {
                type: types.NumberLiteral,
                value: '1',
              },
            },
          },
        ],
        [
          'boolean literal',
          'export const test = true',
          {
            test: {
              name: 'test',
              type: {
                type: types.BooleanLiteral,
                value: 'true',
              },
            },
          },
        ],
        [
          'boolean literal (false)',
          'export const test = false',
          {
            test: {
              name: 'test',
              type: {
                type: types.BooleanLiteral,
                value: 'false',
              },
            },
          },
        ],
        [
          'string literal',
          'export const test = "foo"',
          {
            test: {
              name: 'test',
              type: {
                type: types.StringLiteral,
                value: '"foo"',
              },
            },
          },
        ],
        [
          'boolean',
          'export const test: boolean = true',
          {
            test: {
              name: 'test',
              type: {
                type: types.Boolean,
              },
            },
          },
        ],
        [
          'number',
          'export const test: number = 1',
          {
            test: {
              name: 'test',
              type: {
                type: types.Number,
              },
            },
          },
        ],
        [
          'string',
          'export const test: string = "foo"',
          {
            test: {
              name: 'test',
              type: {
                type: types.String,
              },
            },
          },
        ],
        [
          'null',
          'export const test: null = null;',
          {
            test: {
              name: 'test',
              type: {
                type: types.Null,
              },
            },
          },
        ],
        [
          'undefined',
          'export const test: undefined = undefined;',
          {
            test: {
              name: 'test',
              type: {
                type: types.Undefined,
              },
            },
          },
        ],
        [
          'unknown',
          'export const test: unknown = 1;',
          {
            test: {
              name: 'test',
              type: {
                type: types.Unknown,
              },
            },
          },
        ],
        [
          'any',
          'export const test: any = 1;',
          {
            test: {
              name: 'test',
              type: {
                type: types.Any,
              },
            },
          },
        ],
        [
          'Array',
          'export const test: Array<number> = [];',
          {
            test: {
              name: 'test',
              type: {
                type: types.Array,
                typeArgs: [
                  {
                    type: types.Number,
                  },
                ],
              },
            },
          },
        ],
        [
          'Set',
          'export const test: Set<number> = new Set();',
          {
            test: {
              name: 'test',
              type: {
                type: types.Set,
                typeArgs: [
                  {
                    type: types.Number,
                  },
                ],
              },
            },
          },
        ],
        [
          'Map',
          'export const test: Map<number, number> = new Map();',
          {
            test: {
              name: 'test',
              type: {
                type: types.Map,
                typeArgs: [
                  {
                    type: types.Number,
                  },
                  {
                    type: types.Number,
                  },
                ],
              },
            },
          },
        ],
        [
          'Type Alias',
          'export type test = { a: number };',
          {
            test: {
              name: 'test',
              type: {
                type: types.TypeAlias,
                value: {
                  type: types.Object,
                  properties: [
                    {
                      name: 'a',
                      type: {
                        type: types.Number,
                      },
                    },
                  ],
                },
              },
            },
          },
        ],

        // object
        // const
        // class
        // interface
        // type
        // generics
        // built-ins
      ] as const
    ).filter(test => {
      // return true
      return test[0] === 'Type Alias'
    }),
  )('%s', (_name, code, expected) => {
    const program = getTypeScriptProgram({
      'test.ts': code,
    })
    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const info = getFileSymbols(typeChecker, sourceFile)

    for (const [name, expectedSymbol] of Object.entries(expected)) {
      expect(getFileSymbol(info, name)).toEqual({
        id: expect.any(Number),
        exported: true,
        ...expectedSymbol,
      })
    }
  })
})
