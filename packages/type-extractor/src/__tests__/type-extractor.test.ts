import ts from 'typescript'
import {getFileSymbols, getFileSymbol, types} from '../'

describe('getFileSymbols', () => {
  describe('literal types', () => {
    test('numeric literal', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test = 1',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.NumberLiteral,
          value: '1',
        },
      })
    })

    test('boolean literal', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test = true',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.BooleanLiteral,
          value: 'true',
        },
      })
    })

    test('boolean literal (false)', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test = false',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.BooleanLiteral,
          value: 'false',
        },
      })
    })

    test('string literal', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test = "foo"',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.StringLiteral,
          value: '"foo"',
        },
      })
    })
  })

  describe('basic types', () => {
    test('boolean', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: boolean = true',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.Boolean,
        },
      })
    })

    test('number', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: number = 1',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.Number,
        },
      })
    })

    test('string', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: string = "foo"',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.String,
        },
      })
    })

    test('null', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: null = null',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.Null,
        },
      })
    })

    test('undefined', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: undefined = undefined',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.Undefined,
        },
      })
    })

    test('unknown', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: unknown = 1',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.Unknown,
        },
      })
    })

    test('any', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: any = 1',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.Any,
        },
      })
    })

    test('never', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export var test: never',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.Never,
        },
      })
    })

    test.todo('object')

    test.todo('symbol')
  })

  describe('type references', () => {
    test('Array', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: Array<number> = []',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.TypeReference,
          typeName: {
            type: types.Identifier,
            name: 'Array',
          },
          typeArguments: [
            {
              type: types.Number,
            },
          ],
        },
      })
    })

    test.only('Array (with reference type)', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: `
          type Member = number;
          export const test: Array<Member> = []
        `,
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      console.log(sourceFile)
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.TypeReference,
          typeName: {
            type: types.Identifier,
            name: 'Array',
          },
          typeArguments: [
            {
              type: types.TypeReference,
              typeName: {
                type: types.Identifier,
                name: 'Member',
              },
              typeArguments: [],
            },
          ],
        },
      })
    })

    test('Set', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: Set<number> = new Set()',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.TypeReference,
          typeName: {
            type: types.Identifier,
            name: 'Set',
          },
          typeArguments: [
            {
              type: types.Number,
            },
          ],
        },
      })
    })

    test('Map', () => {
      const program = getTypeScriptProgram({
        ['test.ts']: 'export const test: Map<number, string> = new Map()',
      })
      const typeChecker = program.getTypeChecker()
      const sourceFile = program.getSourceFile('test.ts')!
      const symbols = getFileSymbols(typeChecker, sourceFile)
      const symbol = getFileSymbol(symbols, 'test')

      expect(symbol).toEqual({
        id: expect.any(Number),
        exported: true,
        name: 'test',
        type: {
          type: types.TypeReference,
          typeName: {
            type: types.Identifier,
            name: 'Map',
          },
          typeArguments: [
            {
              type: types.Number,
            },
            {
              type: types.String,
            },
          ],
        },
      })
    })
  })

  test.each(
    (
      [
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

        [
          'Object',
          `
            export const test: {
              a: string;
              b: 1;
              c: () => void;
              d(): void;
            } = {
              a: 'test',
              b: 1,
              c: () => {},
              d: () => {},
            }
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.Object,
                properties: [],
              },
            },
          },
        ],

        [
          'Function Declaration with void return type',
          `
            export function test() {}
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.FunctionDeclaration,
                signatures: [
                  {
                    parameters: [],
                    returnType: {
                      type: types.Void,
                    },
                  },
                ],
              },
            },
          },
        ],

        [
          'Function Declaration with parameters',
          `
            export function test(a: number, b: number) {}
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.FunctionDeclaration,
                signatures: [
                  {
                    parameters: [
                      {
                        name: 'a',
                        type: {
                          type: types.Number,
                          restParameter: false,
                        },
                      },
                      {
                        name: 'b',
                        type: {
                          type: types.Number,
                          restParameter: false,
                        },
                      },
                    ],
                    returnType: {
                      type: types.Void,
                    },
                  },
                ],
              },
            },
          },
        ],

        [
          'Function Declaration with explicit return type',
          `
            export function test(): number {
              return 1
            }
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.FunctionDeclaration,
                signatures: [
                  {
                    parameters: [],
                    returnType: {
                      type: types.Number,
                    },
                  },
                ],
              },
            },
          },
        ],

        [
          'Function Declaration with implicit return type',
          `
            export function test(){
              return 1
            }
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.FunctionDeclaration,
                signatures: [
                  {
                    parameters: [],
                    returnType: {
                      type: types.NumberLiteral,
                      value: '1',
                    },
                  },
                ],
              },
            },
          },
        ],

        [
          'Function Declaration with argument spread',
          `
            export function test(a: number, b: number, ...rest: Array<number>) {
              return 1
            }
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.FunctionDeclaration,
                signatures: [
                  {
                    parameters: [
                      {
                        name: 'a',
                        type: {
                          type: types.Number,
                        },
                        restParameter: false,
                      },
                      {
                        name: 'b',
                        type: {
                          type: types.Number,
                        },
                        restParameter: false,
                      },
                      {
                        name: 'rest',
                        type: {
                          type: types.Array,
                          typeArgs: [
                            {
                              type: types.Number,
                            },
                          ],
                        },
                        restParameter: true,
                      },
                    ],
                    returnType: {
                      type: types.Number,
                    },
                  },
                ],
              },
            },
          },
        ],

        [
          'Function Declaration with object binding pattern',
          `
            export function test({ a }: { a: number }) {}
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.FunctionDeclaration,
                signatures: [
                  {
                    parameters: [
                      {
                        type: 'ObjectBindingPattern',
                        elements: [
                          {
                            type: 'NamedBindingElement',
                            name: 'a',
                          },
                        ],
                        symbolType: {
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
                    ],
                    returnType: {
                      type: types.Void,
                    },
                  },
                ],
              },
            },
          },
        ],

        [
          'Function Declaration with array binding pattern',
          `
            export function test([a, b]: Array<number>) {}
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.FunctionDeclaration,
                signatures: [
                  {
                    parameters: [
                      {
                        type: 'ArrayBindingPattern',
                        elements: [
                          {
                            type: 'NamedBindingElement',
                            name: 'a',
                          },
                          {
                            type: 'NamedBindingElement',
                            name: 'b',
                          },
                        ],
                        symbolType: {
                          type: types.Array,
                          typeArgs: [
                            {
                              type: types.Number,
                            },
                          ],
                        },
                      },
                    ],
                    returnType: {
                      type: types.Void,
                    },
                  },
                ],
              },
            },
          },
        ],

        [
          'Function Declaration with optional parameters',
          `
            export function test(a?: number) {}
          `,
          {
            test: {
              name: 'test',
              type: {
                type: types.FunctionDeclaration,
                signatures: [
                  {
                    parameters: [
                      {
                        type: 'NamedParameter',
                        name: 'a',
                        optional: true,
                        symbolType: {
                          type: types.Union,
                          types: [
                            {
                              type: types.Undefined,
                            },
                            {
                              type: types.Number,
                            },
                          ],
                        },
                      },
                    ],
                    returnType: {
                      type: types.Void,
                    },
                  },
                ],
              },
            },
          },
        ],

        // optional parameters
        // overload function
        // function generics

        // object
        // object rest parameter
        // key in object
        // intersection
        // union
        // const
        // class
        // interface
        // function with overloads
        // type
        // generics
        // built-ins
        // utility types (like Extract, Partial, Exclude, etc)
      ] as const
    ).filter(test => {
      // return true
      return test[0] === 'Function Declaration with optional parameters'
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

  describe('Tuples', () => {
    //
  })

  describe('function types', () => {
    //
  })

  describe('Classes', () => {
    //
  })

  describe('Interfaces', () => {
    //
  })

  describe('Type Aliases', () => {
    //
  })

  describe('objects', () => {
    //
  })
})

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
