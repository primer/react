import ts from 'typescript'
import {describe, expect, test} from 'vitest'
import {parse} from '../'

describe('TypeAlias', () => {
  test('member', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type A = {
          className: string;
        }
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 'A',
        description: null,
        typeInfo: {
          type: 'TypeLiteral',
          members: [
            {
              type: 'PropertySignature',
              name: 'className',
              description: null,
              optional: false,
              typeInfo: {
                type: 'Keyword',
                value: 'string',
              },
            },
          ],
        },
      },
    ])
  })

  test('jsdoc', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        /** test */
        export type A = {
          /** test */
          className: string;
        }
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 'A',
        description: 'test',
        typeInfo: {
          type: 'TypeLiteral',
          members: [
            {
              type: 'PropertySignature',
              name: 'className',
              description: 'test',
              optional: false,
              typeInfo: {
                type: 'Keyword',
                value: 'string',
              },
            },
          ],
        },
      },
    ])
  })

  test('optional member', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type A = {
          className?: string;
        }
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 'A',
        description: null,
        typeInfo: {
          type: 'TypeLiteral',
          members: [
            {
              type: 'PropertySignature',
              name: 'className',
              description: null,
              optional: true,
              typeInfo: {
                type: 'Keyword',
                value: 'string',
              },
            },
          ],
        },
      },
    ])
  })

  test('union member', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type A = {
          variant: 'a' | 'b' | 'c'
        }
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 'A',
        description: null,
        typeInfo: {
          type: 'TypeLiteral',
          members: [
            {
              type: 'PropertySignature',
              name: 'variant',
              description: null,
              optional: false,
              typeInfo: {
                type: 'UnionType',
                types: [
                  {
                    type: 'StringLiteral',
                    value: 'a',
                  },
                  {
                    type: 'StringLiteral',
                    value: 'b',
                  },
                  {
                    type: 'StringLiteral',
                    value: 'c',
                  },
                ],
              },
            },
          ],
        },
      },
    ])
  })

  test('intersection', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type A = {a: string} & {b: string}
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 'A',
        description: null,
        typeInfo: {
          type: 'IntersectionType',
          types: [
            {
              type: 'TypeLiteral',
              members: [
                {
                  type: 'PropertySignature',
                  name: 'a',
                  description: null,
                  optional: false,
                  typeInfo: {
                    type: 'Keyword',
                    value: 'string',
                  },
                },
              ],
            },
            {
              type: 'TypeLiteral',
              members: [
                {
                  type: 'PropertySignature',
                  name: 'b',
                  description: null,
                  optional: false,
                  typeInfo: {
                    type: 'Keyword',
                    value: 'string',
                  },
                },
              ],
            },
          ],
        },
      },
    ])
  })

  test('literal types', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type s = 'a';
        export type b = true;
        export type n = 1;
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 's',
        description: null,
        typeInfo: {
          type: 'StringLiteral',
          value: 'a',
        },
      },
      {
        type: 'TypeAlias',
        name: 'b',
        description: null,
        typeInfo: {
          type: 'BooleanLiteral',
          value: 'true',
        },
      },
      {
        type: 'TypeAlias',
        name: 'n',
        description: null,
        typeInfo: {
          type: 'NumericLiteral',
          value: '1',
        },
      },
    ])
  })

  test('general types', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type t1 = string;
        export type t2 = number;
        export type t3 = boolean;
        export type t4 = object;
        export type t5 = any;
        export type t6 = unknown;
        export type t7 = void;
        export type t8 = never;
        export type t9 = null;
        export type t10 = undefined;
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 't1',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'string',
        },
      },
      {
        type: 'TypeAlias',
        name: 't2',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'number',
        },
      },
      {
        type: 'TypeAlias',
        name: 't3',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'boolean',
        },
      },
      {
        type: 'TypeAlias',
        name: 't4',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'object',
        },
      },
      {
        type: 'TypeAlias',
        name: 't5',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'any',
        },
      },
      {
        type: 'TypeAlias',
        name: 't6',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'unknown',
        },
      },
      {
        type: 'TypeAlias',
        name: 't7',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'void',
        },
      },
      {
        type: 'TypeAlias',
        name: 't8',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'never',
        },
      },
      {
        type: 'TypeAlias',
        name: 't9',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'null',
        },
      },
      {
        type: 'TypeAlias',
        name: 't10',
        description: null,
        typeInfo: {
          type: 'Keyword',
          value: 'undefined',
        },
      },
    ])
  })

  test('reference types', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type t1 = Array<string>;
        export type t2 = React.ComponentPropsWithoutRef<'div'>;
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 't1',
        description: null,
        typeInfo: {
          type: 'TypeReference',
          typeName: {
            type: 'Identifier',
            name: 'Array',
          },
          typeArguments: [
            {
              type: 'Keyword',
              value: 'string',
            },
          ],
        },
      },
      {
        type: 'TypeAlias',
        name: 't2',
        description: null,
        typeInfo: {
          type: 'TypeReference',
          typeName: {
            type: 'QualifiedName',
            left: {
              type: 'Identifier',
              name: 'React',
            },
            right: {
              type: 'Identifier',
              name: 'ComponentPropsWithoutRef',
            },
          },
          typeArguments: [
            {
              type: 'StringLiteral',
              value: 'div',
            },
          ],
        },
      },
    ])
  })

  test('function type', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type t1 = () => void;
        export type t2 = (a: number) => void;
        export type t3 = (a?: number) => void;
        export type t4 = (a: number, ...rest: Array<string>) => void;
      `,
    })
    const typeChecker = program.getTypeChecker()

    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'TypeAlias',
        name: 't1',
        description: null,
        typeInfo: {
          type: 'Function',
          parameters: [],
          typeInfo: {
            type: 'Keyword',
            value: 'void',
          },
        },
      },
      {
        type: 'TypeAlias',
        name: 't2',
        description: null,
        typeInfo: {
          type: 'Function',
          parameters: [
            {
              type: 'Parameter',
              name: {
                type: 'Identifier',
                name: 'a',
              },
              optional: false,
              typeInfo: {
                type: 'Keyword',
                value: 'number',
              },
            },
          ],
          typeInfo: {
            type: 'Keyword',
            value: 'void',
          },
        },
      },
      {
        type: 'TypeAlias',
        name: 't3',
        description: null,
        typeInfo: {
          type: 'Function',
          parameters: [
            {
              type: 'Parameter',
              name: {
                type: 'Identifier',
                name: 'a',
              },
              optional: true,
              typeInfo: {
                type: 'Keyword',
                value: 'number',
              },
            },
          ],
          typeInfo: {
            type: 'Keyword',
            value: 'void',
          },
        },
      },
      {
        type: 'TypeAlias',
        name: 't4',
        description: null,
        typeInfo: {
          type: 'Function',
          parameters: [
            {
              type: 'Parameter',
              name: {
                type: 'Identifier',
                name: 'a',
              },
              optional: false,
              typeInfo: {
                type: 'Keyword',
                value: 'number',
              },
            },
            {
              type: 'RestParameter',
              name: {
                type: 'Identifier',
                name: 'rest',
              },
              typeInfo: {
                type: 'TypeReference',
                typeName: {
                  type: 'Identifier',
                  name: 'Array',
                },
                typeArguments: [
                  {
                    type: 'Keyword',
                    value: 'string',
                  },
                ],
              },
            },
          ],
          typeInfo: {
            type: 'Keyword',
            value: 'void',
          },
        },
      },
    ])
  })
})

describe('FunctionDeclaration', () => {
  // explicit vs implicit return type
  // casting support through `as`

  test('empty function', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export function t1() {}
        export function t2(): void {}
      `,
    })
    const typeChecker = program.getTypeChecker()
    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'FunctionDeclaration',
        name: {
          type: 'Identifier',
          name: 't1',
        },
        signatures: [
          {
            parameters: [],
            returnType: {
              type: 'Keyword',
              value: 'void',
            },
          },
        ],
      },
      {
        type: 'FunctionDeclaration',
        name: {
          type: 'Identifier',
          name: 't2',
        },
        signatures: [
          {
            parameters: [],
            returnType: {
              type: 'Keyword',
              value: 'void',
            },
          },
        ],
      },
    ])
    // expect(result).toEqual([
    // {
    // type: 'FunctionDeclaration',
    // name: {
    // type: 'Identifier',
    // name: 't1',
    // },
    // parameters: [],
    // typeInfo: null,
    // },
    // {
    // type: 'FunctionDeclaration',
    // name: {
    // type: 'Identifier',
    // name: 't2',
    // },
    // parameters: [],
    // typeInfo: {
    // type: 'Keyword',
    // value: 'void',
    // },
    // },
    // ])
  })

  test.only('function with parameters', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export function t1(a: number, b: string, c?: boolean) {}
      `,
    })
    const typeChecker = program.getTypeChecker()
    const result = parse(typeChecker, program.getSourceFile('test.ts')!)
    expect(result).toEqual([
      {
        type: 'FunctionDeclaration',
        name: {
          type: 'Identifier',
          name: 't1',
        },
        signatures: [
          {
            type: 'Signature',
            parameters: [
              {
                type: 'Parameter',
                name: 'a',
                typeInfo: {
                  type: 'Keyword',
                  value: 'number',
                },
                optional: false,
              },
              {
                type: 'Parameter',
                name: 'b',
                typeInfo: {
                  type: 'Keyword',
                  value: 'string',
                },
                optional: false,
              },
              {
                type: 'Parameter',
                name: 'c',
                typeInfo: {
                  type: 'Keyword',
                  value: 'boolean',
                },
                optional: true,
              },
            ],
            returnType: {
              type: 'Keyword',
              value: 'void',
            },
          },
        ],
      },
    ])
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
