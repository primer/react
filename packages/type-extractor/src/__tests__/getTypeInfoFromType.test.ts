import ts from 'typescript'
import {describe, expect, test} from 'vitest'
import {isNodeExported} from '../isNodeExported'
import {getTypeInfoFromType} from '../getTypeInfoFromType'

describe('getTypeInfoFromType', () => {
  test('hello', () => {
    const program = getTypeScriptProgram({
      'test.ts': `
        export type A = {
          className: string;
        }
      `,
    })
    const typeChecker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('test.ts')!

    ts.forEachChild(sourceFile, node => {
      if (isNodeExported(node)) {
        // const symbol = typeChecker.getSymbolAtLocation(node.name)
        // if (!symbol) {
        // return
        // }
        // const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
        // getTypeInfoFromType(typeChecker, type)
      }
    })
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
