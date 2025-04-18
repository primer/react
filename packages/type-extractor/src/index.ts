import ts from 'typescript'
import {hash} from './hash'

type ID = number

/**
 * Corresponds toa ts.Symbol. This represents a named declaration in a program
 * (like a variable, function, class, or interface). Each symbol has a
 * corresponding type
 */
type Symbol = {
  id: ID
  name: string
  type: Type
  exported: boolean
}

function getSymbolId(sourceFile: ts.SourceFile, symbol: ts.Symbol): ID {
  if ('id' in sourceFile) {
    return hash(`${sourceFile.id}:${symbol.name}`)
  }
  throw new Error('Source file does not have an id')
}

type FileSymbols = Map<ID, Symbol>

function getFileSymbols(typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile): FileSymbols {
  const symbols: Map<ID, Symbol> = new Map()
  const exported: Set<ID> = new Set()

  ts.forEachChild(sourceFile, node => {
    if (!isNodeExported(node)) {
      return
    }

    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) {
          continue
        }

        const symbol = typeChecker.getSymbolAtLocation(declaration.name)
        if (!symbol) {
          continue
        }

        const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
        const typeInfo = getTypeInfo(typeChecker, type)
        const id = getSymbolId(sourceFile, symbol)
        const data: Symbol = {
          id,
          name: symbol.name,
          type: typeInfo,
          exported: true,
        }

        exported.add(id)
        symbols.set(id, data)
      }
    }

    if (ts.isTypeAliasDeclaration(node)) {
      const symbol = typeChecker.getSymbolAtLocation(node.name)
      if (!symbol) {
        return
      }

      const type = typeChecker.getDeclaredTypeOfSymbol(symbol)
      const typeInfo = getTypeInfo(typeChecker, type)
      const id = getSymbolId(sourceFile, symbol)
      const data: Symbol = {
        id,
        name: symbol.name,
        exported: true,
        type: {
          type: types.TypeAlias,
          value: typeInfo,
        },
      }
      exported.add(id)
      symbols.set(id, data)
    }
  })

  return symbols
}

function getFileSymbol(symbols: FileSymbols, name: string): Symbol | undefined {
  return Array.from(symbols.values()).find(symbol => symbol.name === name)
}

function isNodeExported(node: ts.Node): boolean {
  // export default <value>
  if (ts.isExportAssignment(node)) {
    return true
  }

  // export { a }
  // export { a as b }
  // export { a } from 'mod'
  // expor type { a }
  if (ts.isExportDeclaration(node)) {
    return true
  }

  // export const a = 1
  // export function a() {}
  // export class A {}
  // export interface A {}
  // export type A = {}
  // export enum A {}
  if (
    ts.isVariableStatement(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node)
  ) {
    const exportKeyword = node.modifiers?.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)
    if (exportKeyword) {
      return true
    }
  }

  return false
}

const types = {
  Any: 'Any',
  Array: 'Array',
  Boolean: 'Boolean',
  BooleanLiteral: 'BooleanLiteral',
  Null: 'Null',
  Number: 'Number',
  NumberLiteral: 'NumberLiteral',
  Map: 'Map',
  Set: 'Set',
  String: 'String',
  StringLiteral: 'StringLiteral',
  Undefined: 'Undefined',
  Unknown: 'Unknown',
  Unsupported: 'Unsupported',
  TypeAlias: 'TypeAlias',
  Object: 'Object',
} as const

type Type =
  | {
      type: 'StringLiteral'
      value: string
    }
  | {
      type: 'BooleanLiteral'
      value: string
    }
  | {
      type: 'NumberLiteral'
      value: string
    }
  | {
      type: 'String'
    }
  | {
      type: 'Boolean'
    }
  | {
      type: 'Number'
    }
  | {
      type: 'Array'
      typeArgs: Array<Type>
    }
  | {
      type: 'Set'
      typeArgs: Array<Type>
    }
  | {
      type: 'Map'
      typeArgs: Array<Type>
    }
  | {
      type: 'Null'
    }
  | {
      type: 'Undefined'
    }
  | {
      type: 'Any'
    }
  | {
      type: 'TypeAlias'
      value: Type
      // typeParameters?: Array<Type>
    }
  | {
      type: 'Object'
      properties: Array<{
        name: string
        type: Type
      }>
    }
  | {
      type: 'Unknown'
    }
  | {
      type: 'Unsupported'
      value: string
    }

function getTypeInfo(typeChecker: ts.TypeChecker, type: ts.Type): Type {
  const typeText = typeChecker.typeToString(type, undefined, ts.TypeFormatFlags.WriteArrayAsGenericType)

  if (type.flags & ts.TypeFlags.BooleanLiteral) {
    return {
      type: types.BooleanLiteral,
      value: typeText,
    }
  }

  if (type.flags & ts.TypeFlags.NumberLiteral) {
    return {
      type: types.NumberLiteral,
      value: typeText,
    }
  }

  if (type.flags & ts.TypeFlags.StringLiteral) {
    return {
      type: types.StringLiteral,
      value: typeText,
    }
  }

  if (type.flags & ts.TypeFlags.Boolean) {
    return {
      type: types.Boolean,
    }
  }

  if (type.flags & ts.TypeFlags.Number) {
    return {
      type: types.Number,
    }
  }

  if (type.flags & ts.TypeFlags.String) {
    return {
      type: types.String,
    }
  }

  if (type.flags & ts.TypeFlags.Undefined) {
    return {
      type: types.Undefined,
    }
  }

  if (type.flags & ts.TypeFlags.Null) {
    return {
      type: types.Null,
    }
  }

  if (type.flags & ts.TypeFlags.Any) {
    return {
      type: types.Any,
    }
  }

  if (type.flags & ts.TypeFlags.Unknown) {
    return {
      type: types.Unknown,
    }
  }

  if (type.flags & ts.TypeFlags.Object) {
    const objectType = type as ts.ObjectType
    if (objectType.objectFlags & ts.ObjectFlags.Reference) {
      const typeReference = objectType as ts.TypeReference

      if (typeReference.target.symbol.name === 'Array') {
        const typeArgs = typeReference.typeArguments

        return {
          type: types.Array,
          typeArgs: typeArgs ? typeArgs.map(type => getTypeInfo(typeChecker, type)) : [],
        }
      }

      if (typeReference.target.symbol.name === 'Set') {
        const typeArgs = typeReference.typeArguments
        return {
          type: types.Set,
          typeArgs: typeArgs ? typeArgs.map(type => getTypeInfo(typeChecker, type)) : [],
        }
      }

      if (typeReference.target.symbol.name === 'Map') {
        const typeArgs = typeReference.typeArguments
        return {
          type: types.Map,
          typeArgs: typeArgs ? typeArgs.map(type => getTypeInfo(typeChecker, type)) : [],
        }
      }
    }

    if (objectType.objectFlags & ts.ObjectFlags.Anonymous) {
      return {
        type: types.Object,
        properties: objectType.getProperties().map(property => {
          const value = typeChecker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!)
          return {
            name: property.name,
            type: getTypeInfo(typeChecker, value),
          }
        }),
      }
    }
  }

  return {
    type: types.Unsupported,
    value: typeText,
  }
}

export {getFileSymbols, getFileSymbol, types}
