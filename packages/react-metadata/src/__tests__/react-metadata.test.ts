import ts from 'typescript'
import {describe, test, expect} from 'vitest'
import {getMetadataFromSourceFile} from '../'

describe('keywords', () => {
  test('any', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = any
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Any',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('boolean', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = boolean
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Boolean',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('never', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = never
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Never',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('null', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = null
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Null',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('number', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = number
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Number',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('string', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = string
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'String',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('undefined', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = undefined
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Undefined',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('unknown', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = unknown
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Unknown',
          },
          typeParameters: [],
        },
      ],
    })
  })
})

describe('literals', () => {
  test('boolean literal', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t1 = true
      export type t2 = false
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't1',
          type: {
            kind: 'BooleanLiteral',
            value: 'true',
          },
          typeParameters: [],
        },
        {
          kind: 'TypeAlias',
          name: 't2',
          type: {
            kind: 'BooleanLiteral',
            value: 'false',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('numeric literal', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = 1
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'NumericLiteral',
            value: '1',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('string literal', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = 'test'
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'StringLiteral',
            value: 'test',
          },
          typeParameters: [],
        },
      ],
    })
  })
})

describe('functions', () => {
  test('function declaration', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export function t(): void {}
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'FunctionDeclaration',
          name: 't',
          signatures: [
            {
              kind: 'Signature',
              parameters: [],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [],
            },
          ],
        },
      ],
    })
  })

  test('function declaration with inferred return type', () => {
    const program = getTypeScriptProgram({
      'test.tsx': `
        import React from 'react'

        export function t1() {}

        export function t2() {
          return 1
        }

        export function t3() {
          return [1, 2, 3]
        }

        export function t4() {
          return <div />
        }
      `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.tsx')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'FunctionDeclaration',
          name: 't1',
          signatures: [
            {
              kind: 'Signature',
              parameters: [],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [],
            },
          ],
        },
        {
          kind: 'FunctionDeclaration',
          name: 't2',
          signatures: [
            {
              kind: 'Signature',
              parameters: [],
              returnType: {
                kind: 'Number',
              },
              typeParameters: [],
            },
          ],
        },
        {
          kind: 'FunctionDeclaration',
          name: 't3',
          signatures: [
            {
              kind: 'Signature',
              parameters: [],
              returnType: {
                kind: 'TypeReference',
                typeName: {
                  kind: 'Identifier',
                  name: 'Array',
                },
                typeArguments: [
                  {
                    kind: 'Number',
                  },
                ],
              },
              typeParameters: [],
            },
          ],
        },
        {
          kind: 'FunctionDeclaration',
          name: 't4',
          signatures: [
            {
              kind: 'Signature',
              parameters: [],
              returnType: {
                kind: 'TypeReference',
                typeName: {
                  kind: 'QualifiedName',
                  left: {
                    kind: 'QualifiedName',
                    left: {
                      kind: 'Identifier',
                      name: 'React',
                    },
                    right: {
                      kind: 'Identifier',
                      name: 'JSX',
                    },
                  },
                  right: {
                    kind: 'Identifier',
                    name: 'Element',
                  },
                },
                typeArguments: [],
              },
              typeParameters: [],
            },
          ],
        },
      ],
    })
  })

  test('parameters', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export function t1(a: number) {}
        export function t2(a?: number) {}
        export function t3(a: React.ReactNode) {}
        export function t4(a: number, ...rest: Array<string>) {}
        export function t5({a, b: renamed, ...rest}: {a: number; b: number; c: number}) {}
        export function t6([a, ...rest]: [number, number]) {}
      `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'FunctionDeclaration',
          name: 't1',
          signatures: [
            {
              kind: 'Signature',
              parameters: [
                {
                  kind: 'Parameter',
                  name: {
                    kind: 'Identifier',
                    name: 'a',
                  },
                  type: {
                    kind: 'Number',
                  },
                  optional: false,
                  rest: false,
                },
              ],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [],
            },
          ],
        },
        {
          kind: 'FunctionDeclaration',
          name: 't2',
          signatures: [
            {
              kind: 'Signature',
              parameters: [
                {
                  kind: 'Parameter',
                  name: {
                    kind: 'Identifier',
                    name: 'a',
                  },
                  type: {
                    kind: 'Number',
                  },
                  optional: true,
                  rest: false,
                },
              ],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [],
            },
          ],
        },
        {
          kind: 'FunctionDeclaration',
          name: 't3',
          signatures: [
            {
              kind: 'Signature',
              parameters: [
                {
                  kind: 'Parameter',
                  name: {
                    kind: 'Identifier',
                    name: 'a',
                  },
                  type: {
                    kind: 'TypeReference',
                    typeName: {
                      kind: 'QualifiedName',
                      left: {
                        kind: 'Identifier',
                        name: 'React',
                      },
                      right: {
                        kind: 'Identifier',
                        name: 'ReactNode',
                      },
                    },
                    typeArguments: [],
                  },
                  optional: false,
                  rest: false,
                },
              ],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [],
            },
          ],
        },
        {
          kind: 'FunctionDeclaration',
          name: 't4',
          signatures: [
            {
              kind: 'Signature',
              parameters: [
                {
                  kind: 'Parameter',
                  name: {
                    kind: 'Identifier',
                    name: 'a',
                  },
                  type: {
                    kind: 'Number',
                  },
                  optional: false,
                  rest: false,
                },
                {
                  kind: 'Parameter',
                  name: {
                    kind: 'Identifier',
                    name: 'rest',
                  },
                  type: {
                    kind: 'TypeReference',
                    typeName: {
                      kind: 'Identifier',
                      name: 'Array',
                    },
                    typeArguments: [
                      {
                        kind: 'String',
                      },
                    ],
                  },
                  optional: false,
                  rest: true,
                },
              ],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [],
            },
          ],
        },
        {
          kind: 'FunctionDeclaration',
          name: 't5',
          signatures: [
            {
              kind: 'Signature',
              parameters: [
                {
                  kind: 'Parameter',
                  name: {
                    kind: 'ObjectBindingPattern',
                    elements: [
                      {
                        kind: 'BindingElement',
                        name: {
                          kind: 'Identifier',
                          name: 'a',
                        },
                        restProperty: false,
                      },
                      {
                        kind: 'BindingElement',
                        name: {
                          kind: 'Identifier',
                          name: 'renamed',
                        },
                        propertyName: {
                          kind: 'Identifier',
                          name: 'b',
                        },
                        restProperty: false,
                      },
                      {
                        kind: 'BindingElement',
                        name: {
                          kind: 'Identifier',
                          name: 'rest',
                        },
                        restProperty: true,
                      },
                    ],
                  },
                  type: {
                    kind: 'TypeLiteral',
                    members: [
                      {
                        kind: 'PropertySignature',
                        name: 'a',
                        optional: false,
                        type: {
                          kind: 'Number',
                        },
                      },
                      {
                        kind: 'PropertySignature',
                        name: 'b',
                        optional: false,
                        type: {
                          kind: 'Number',
                        },
                      },
                      {
                        kind: 'PropertySignature',
                        name: 'c',
                        optional: false,
                        type: {
                          kind: 'Number',
                        },
                      },
                    ],
                  },
                  optional: false,
                  rest: false,
                },
              ],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [],
            },
          ],
        },
        {
          kind: 'FunctionDeclaration',
          name: 't6',
          signatures: [
            {
              kind: 'Signature',
              parameters: [
                {
                  kind: 'Parameter',
                  name: {
                    kind: 'ArrayBindingPattern',
                    elements: [
                      {
                        kind: 'BindingElement',
                        name: {
                          kind: 'Identifier',
                          name: 'a',
                        },
                        restProperty: false,
                      },
                      {
                        kind: 'BindingElement',
                        name: {
                          kind: 'Identifier',
                          name: 'rest',
                        },
                        restProperty: true,
                      },
                    ],
                  },
                  type: {
                    kind: 'Tuple',
                    elements: [
                      {
                        kind: 'Number',
                      },
                      {
                        kind: 'Number',
                      },
                    ],
                  },
                  optional: false,
                  rest: false,
                },
              ],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [],
            },
          ],
        },
      ],
    })
  })

  test('type parameters', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export function t<T extends string = string>(a: T) {}
      `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'FunctionDeclaration',
          name: 't',
          signatures: [
            {
              kind: 'Signature',
              parameters: [
                {
                  kind: 'Parameter',
                  name: {
                    kind: 'Identifier',
                    name: 'a',
                  },
                  type: {
                    kind: 'TypeReference',
                    typeName: {
                      kind: 'Identifier',
                      name: 'T',
                    },
                    typeArguments: [],
                  },
                  optional: false,
                  rest: false,
                },
              ],
              returnType: {
                kind: 'Void',
              },
              typeParameters: [
                {
                  kind: 'TypeParameter',
                  name: 'T',
                  constraint: {
                    kind: 'String',
                  },
                  default: {
                    kind: 'String',
                  },
                },
              ],
            },
          ],
        },
      ],
    })
  })

  test('function type', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type t1 = () => void
        export type t2 = (a: number) => void
        export type t3 = (a?: number) => void
        export type t4 = (a: number, ...rest: Array<string>) => void
        export type t5 = ({ a, b, ...rest}: { a: number; b: number; c: number; }) => void
        export type t6 = ([a, ...rest]: [number, number]) => void
      `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't1',
          type: {
            kind: 'Function',
            parameters: [],
            returnType: {
              kind: 'Void',
            },
            typeParameters: [],
          },
          typeParameters: [],
        },
        {
          kind: 'TypeAlias',
          name: 't2',
          type: {
            kind: 'Function',
            parameters: [
              {
                kind: 'Parameter',
                name: {
                  kind: 'Identifier',
                  name: 'a',
                },
                type: {
                  kind: 'Number',
                },
                optional: false,
                rest: false,
              },
            ],
            returnType: {
              kind: 'Void',
            },
            typeParameters: [],
          },
          typeParameters: [],
        },
        {
          kind: 'TypeAlias',
          name: 't3',
          type: {
            kind: 'Function',
            parameters: [
              {
                kind: 'Parameter',
                name: {
                  kind: 'Identifier',
                  name: 'a',
                },
                type: {
                  kind: 'Number',
                },
                optional: true,
                rest: false,
              },
            ],
            returnType: {
              kind: 'Void',
            },
            typeParameters: [],
          },
          typeParameters: [],
        },
        {
          kind: 'TypeAlias',
          name: 't4',
          type: {
            kind: 'Function',
            parameters: [
              {
                kind: 'Parameter',
                name: {
                  kind: 'Identifier',
                  name: 'a',
                },
                type: {
                  kind: 'Number',
                },
                optional: false,
                rest: false,
              },
              {
                kind: 'Parameter',
                name: {
                  kind: 'Identifier',
                  name: 'rest',
                },
                type: {
                  kind: 'TypeReference',
                  typeName: {
                    kind: 'Identifier',
                    name: 'Array',
                  },
                  typeArguments: [
                    {
                      kind: 'String',
                    },
                  ],
                },
                optional: false,
                rest: true,
              },
            ],
            returnType: {
              kind: 'Void',
            },
            typeParameters: [],
          },
          typeParameters: [],
        },
        {
          kind: 'TypeAlias',
          name: 't5',
          type: {
            kind: 'Function',
            parameters: [
              {
                kind: 'Parameter',
                optional: false,
                rest: false,
                name: {
                  kind: 'ObjectBindingPattern',
                  elements: [
                    {
                      kind: 'BindingElement',
                      name: {
                        kind: 'Identifier',
                        name: 'a',
                      },
                      restProperty: false,
                    },
                    {
                      kind: 'BindingElement',
                      name: {
                        kind: 'Identifier',
                        name: 'b',
                      },
                      restProperty: false,
                    },
                    {
                      kind: 'BindingElement',
                      name: {
                        kind: 'Identifier',
                        name: 'rest',
                      },
                      restProperty: true,
                    },
                  ],
                },
                type: {
                  kind: 'TypeLiteral',
                  members: [
                    {
                      kind: 'PropertySignature',
                      name: 'a',
                      optional: false,
                      type: {
                        kind: 'Number',
                      },
                    },
                    {
                      kind: 'PropertySignature',
                      name: 'b',
                      optional: false,
                      type: {
                        kind: 'Number',
                      },
                    },
                    {
                      kind: 'PropertySignature',
                      name: 'c',
                      optional: false,
                      type: {
                        kind: 'Number',
                      },
                    },
                  ],
                },
              },
            ],
            returnType: {
              kind: 'Void',
            },
            typeParameters: [],
          },
          typeParameters: [],
        },
        {
          kind: 'TypeAlias',
          name: 't6',
          type: {
            kind: 'Function',
            parameters: [
              {
                kind: 'Parameter',
                name: {
                  kind: 'ArrayBindingPattern',
                  elements: [
                    {
                      kind: 'BindingElement',
                      name: {
                        kind: 'Identifier',
                        name: 'a',
                      },
                      restProperty: false,
                    },
                    {
                      kind: 'BindingElement',
                      name: {
                        kind: 'Identifier',
                        name: 'rest',
                      },
                      restProperty: true,
                    },
                  ],
                },
                type: {
                  kind: 'Tuple',
                  elements: [
                    {
                      kind: 'Number',
                    },
                    {
                      kind: 'Number',
                    },
                  ],
                },
                optional: false,
                rest: false,
              },
            ],
            returnType: {
              kind: 'Void',
            },
            typeParameters: [],
          },
          typeParameters: [],
        },
      ],
    })
  })
})

describe('type references', () => {
  test('identifier', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = Array<string>
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'TypeReference',
            typeName: {
              kind: 'Identifier',
              name: 'Array',
            },
            typeArguments: [
              {
                kind: 'String',
              },
            ],
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('qualified name', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = React.ComponentPropsWithoutRef<'div'>
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'TypeReference',
            typeName: {
              kind: 'QualifiedName',
              left: {
                kind: 'Identifier',
                name: 'React',
              },
              right: {
                kind: 'Identifier',
                name: 'ComponentPropsWithoutRef',
              },
            },
            typeArguments: [
              {
                kind: 'StringLiteral',
                value: 'div',
              },
            ],
          },
          typeParameters: [],
        },
      ],
    })
  })
})

describe('type aliases', () => {
  test('type alias', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = string
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'String',
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('type alias with generics', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t<A, B extends string, C = string> = string
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          typeParameters: [
            {
              kind: 'TypeParameter',
              name: 'A',
              constraint: undefined,
              default: undefined,
            },
            {
              kind: 'TypeParameter',
              name: 'B',
              constraint: {
                kind: 'String',
              },
              default: undefined,
            },
            {
              kind: 'TypeParameter',
              name: 'C',
              constraint: undefined,
              default: {
                kind: 'String',
              },
            },
          ],
          type: {
            kind: 'String',
          },
        },
      ],
    })
  })
})

describe('type literals', () => {
  test('type literal', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = {
        className: string
      }
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'TypeLiteral',
            members: [
              {
                kind: 'PropertySignature',
                name: 'className',
                optional: false,
                type: {
                  kind: 'String',
                },
              },
            ],
          },
          typeParameters: [],
        },
      ],
    })
  })

  test('type literal with optional member', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = {
        className?: string
      }
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'TypeLiteral',
            members: [
              {
                kind: 'PropertySignature',
                name: 'className',
                optional: true,
                type: {
                  kind: 'String',
                },
              },
            ],
          },
          typeParameters: [],
        },
      ],
    })
  })
})

describe('intersections', () => {
  test('intersection', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = { open: boolean } & { className: string }
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Intersection',
            members: [
              {
                kind: 'TypeLiteral',
                members: [
                  {
                    kind: 'PropertySignature',
                    name: 'open',
                    optional: false,
                    type: {
                      kind: 'Boolean',
                    },
                  },
                ],
              },
              {
                kind: 'TypeLiteral',
                members: [
                  {
                    kind: 'PropertySignature',
                    name: 'className',
                    optional: false,
                    type: {
                      kind: 'String',
                    },
                  },
                ],
              },
            ],
          },
          typeParameters: [],
        },
      ],
    })
  })
})

describe('unions', () => {
  test('union', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
      export type t = { type: 'a' } | { type: 'b' }
    `,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'TypeAlias',
          name: 't',
          type: {
            kind: 'Union',
            members: [
              {
                kind: 'TypeLiteral',
                members: [
                  {
                    kind: 'PropertySignature',
                    name: 'type',
                    optional: false,
                    type: {
                      kind: 'StringLiteral',
                      value: 'a',
                    },
                  },
                ],
              },
              {
                kind: 'TypeLiteral',
                members: [
                  {
                    kind: 'PropertySignature',
                    name: 'type',
                    optional: false,
                    type: {
                      kind: 'StringLiteral',
                      value: 'b',
                    },
                  },
                ],
              },
            ],
          },
          typeParameters: [],
        },
      ],
    })
  })
})

describe('variable declarations', () => {
  test('variable declaration', () => {
    const program = getTypeScriptProgram({
      'test.ts': `export const t = 1;`,
    })

    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!
    const metadata = getMetadataFromSourceFile(typeChecker, sourceFile)
    expect(metadata).toEqual({
      exports: [
        {
          kind: 'VariableDeclaration',
          name: {
            kind: 'Identifier',
            name: 't',
          },
          type: {
            kind: 'NumericLiteral',
            value: '1',
          },
        },
      ],
    })
  })
})

describe.skip('interfaces', () => {
  //
})

describe.skip('export specifiers', () => {
  //
})

describe.skip('unsupported', () => {
  //
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
    jsx: ts.JsxEmit.Preserve,
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
