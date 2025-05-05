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

        if (declaration.type) {
          const typeInfo = getTypeFromNode(typeChecker, declaration.type)
          const id = getSymbolId(sourceFile, symbol)
          const data: Symbol = {
            id,
            name: symbol.name,
            type: typeInfo,
            exported: true,
          }

          symbols.set(id, data)
        } else {
          const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
          const typeInfo = getTypeInfo(typeChecker, type)
          const id = getSymbolId(sourceFile, symbol)
          const data: Symbol = {
            id,
            name: symbol.name,
            type: typeInfo,
            exported: true,
          }

          symbols.set(id, data)
        }
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
      symbols.set(id, data)
    }

    if (ts.isFunctionDeclaration(node)) {
      if (!node.name) {
        return
      }

      const symbol = typeChecker.getSymbolAtLocation(node.name)
      if (!symbol) {
        return
      }

      const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      const signatures = type.getCallSignatures()
      const id = getSymbolId(sourceFile, symbol)
      const data: Symbol = {
        id,
        name: symbol.name,
        type: {
          type: types.FunctionDeclaration,
          signatures: signatures.map(signature => {
            const returnType = typeChecker.getReturnTypeOfSignature(signature)
            const parameters = signature.getParameters()
            return {
              parameters: parameters.map(parameter => {
                const valueDeclaration = parameter.valueDeclaration
                if (!valueDeclaration) {
                  throw new Error('Parameter does not have a value declaration')
                }

                const parameterDeclaration = valueDeclaration as ts.ParameterDeclaration
                const type = typeChecker.getTypeOfSymbolAtLocation(parameter, parameterDeclaration)
                const restParameter =
                  'dotDotDotToken' in valueDeclaration && valueDeclaration.dotDotDotToken !== undefined

                if (ts.isArrayBindingPattern(parameterDeclaration.name)) {
                  const elements = parameterDeclaration.name.elements.map(element => {
                    if (ts.isBindingElement(element)) {
                      if (element.dotDotDotToken) {
                        return {
                          type: types.RestBindingElement,
                          name: element.name.getText(),
                        }
                      }

                      if (element.propertyName) {
                        return {
                          type: types.RenamedBindingElement,
                          propertyName: element.propertyName.getText(),
                          name: element.name.getText(),
                        }
                      }

                      return {
                        type: types.NamedBindingElement,
                        name: element.name.getText(),
                      }
                    }
                    throw new Error('Element is not a binding element')
                  })

                  return {
                    type: 'ArrayBindingPattern',
                    elements,
                    symbolType: getTypeInfo(typeChecker, type),
                  }
                }

                if (ts.isObjectBindingPattern(parameterDeclaration.name)) {
                  const elements = parameterDeclaration.name.elements.map(element => {
                    if (ts.isBindingElement(element)) {
                      if (element.dotDotDotToken) {
                        return {
                          type: types.RestBindingElement,
                          name: element.name.getText(),
                        }
                      }

                      if (element.propertyName) {
                        return {
                          type: types.RenamedBindingElement,
                          propertyName: element.propertyName.getText(),
                          name: element.name.getText(),
                        }
                      }

                      return {
                        type: types.NamedBindingElement,
                        name: element.name.getText(),
                      }
                    }
                    throw new Error('Element is not a binding element')
                  })

                  return {
                    type: 'ObjectBindingPattern',
                    elements,
                    symbolType: getTypeInfo(typeChecker, type),
                  }
                }

                if (restParameter) {
                  return {
                    type: 'RestParameter',
                    name: parameter.name,
                    symbolType: getTypeInfo(typeChecker, type),
                  }
                }

                const optional = parameterDeclaration.questionToken !== undefined

                return {
                  type: 'NamedParameter',
                  name: parameter.name,
                  symbolType: getTypeInfo(typeChecker, type),
                  optional,
                }
              }),
              returnType: getTypeInfo(typeChecker, returnType),
            }
          }),
        },
        exported: true,
      }
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
  Void: 'Void',
  Unsupported: 'Unsupported',
  TypeAlias: 'TypeAlias',
  Object: 'Object',
  FunctionDeclaration: 'FunctionDeclaration',
  NamedBindingElement: 'NamedBindingElement',
  RenamedBindingElement: 'RenamedBindingElement',
  RestBindingElement: 'RestBindingElement',
  Union: 'Union',
  Never: 'Never',
  TypeReference: 'TypeReference',
  Identifier: 'Identifier',
  QualifiedName: 'QualifiedName',
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
      type: 'TypeReference'
      typeName: Identifier | QualifiedName
      typeArguments: Array<Type>
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
      type: 'Never'
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
      type: 'FunctionDeclaration'
      signatures: Array<Signature>
      // typeParameters?: Array<Type>
    }
  | {
      type: 'Unknown'
    }
  | {
      type: 'Void'
    }
  | {
      type: 'Union'
      types: Array<Type>
    }
  | {
      type: 'Unsupported'
      value: string
    }

type Identifier = {
  type: 'Identifier'
  name: string
}

type QualifiedName = {
  type: 'QualifiedName'
  left: Identifier | QualifiedName
  right: Identifier | QualifiedName
}

type Signature = {
  parameters: Array<Parameter>
  returnType: Type
}

type Parameter =
  | {
      type: 'NamedParameter'
      name: string
      symbolType: Type
      optional: boolean
    }
  | {
      type: 'RestParameter'
      name: string
      symbolType: Type
    }
  | {
      type: 'ArrayBindingPattern'
      elements: Array<BindingElement>
      symbolType: Type
    }
  | {
      type: 'ObjectBindingPattern'
      elements: Array<BindingElement>
      symbolType: Type
    }

type BindingElement =
  | {
      type: 'NamedBindingElement'
      name: string
    }
  | {
      type: 'RestBindingElement'
      name: string
    }
  | {
      type: 'RenamedBindingElement'
      propertyName: string
      name: string
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

  if (type.flags & ts.TypeFlags.Void) {
    return {
      type: types.Void,
    }
  }

  if (type.flags & ts.TypeFlags.Object) {
    const objectType = type as ts.ObjectType

    if (objectType.objectFlags & ts.ObjectFlags.Reference) {
      const typeReference = objectType as ts.TypeReference
      const target = typeReference.target

      return {
        type: types.TypeReference,
        typeName: {
          type: types.Identifier,
          name: target.symbol.name,
        },
        typeArguments: Array.isArray(typeReference.typeArguments)
          ? typeReference.typeArguments.map(type => {
              return getTypeInfo(typeChecker, type)
            })
          : [],
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

  if (type.flags & ts.TypeFlags.Union) {
    const unionType = type as ts.UnionType
    return {
      type: types.Union,
      types: unionType.types.map(type => {
        return getTypeInfo(typeChecker, type)
      }),
    }
  }

  if (type.flags & ts.TypeFlags.Never) {
    return {
      type: types.Never,
    }
  }

  return {
    type: types.Unsupported,
    value: typeText,
  }
}

function getTypeName(typeChecker: ts.TypeChecker, value: ts.Identifier | ts.QualifiedName): Identifier | QualifiedName {
  if (ts.isIdentifier(value)) {
    return {
      type: types.Identifier,
      name: value.getText(),
    }
  }
  return {
    type: types.QualifiedName,
    left: getTypeName(typeChecker, value.left),
    right: getTypeName(typeChecker, value.right),
  }
}

function getTypeFromNode(typeChecker: ts.TypeChecker, typeNode: ts.TypeNode): Type {
  const type = typeChecker.getTypeFromTypeNode(typeNode)
  const typeText = typeChecker.typeToString(type, undefined, ts.TypeFormatFlags.WriteArrayAsGenericType)

  if (ts.isTypeReferenceNode(typeNode)) {
    return {
      type: types.TypeReference,
      typeName: getTypeName(typeChecker, typeNode.typeName),
      typeArguments: Array.isArray(typeNode.typeArguments)
        ? typeNode.typeArguments.map(typeArgument => {
            return getTypeFromNode(typeChecker, typeArgument)
          })
        : [],
    }
  }

  if (typeNode.kind & ts.SyntaxKind.BooleanKeyword) {
    return {
      type: types.Boolean,
    }
  }

  if (typeNode.kind & ts.SyntaxKind.NumberKeyword) {
    return {
      type: types.Number,
    }
  }

  if (typeNode.kind & ts.SyntaxKind.StringKeyword) {
    return {
      type: types.String,
    }
  }

  if (typeNode.kind & ts.SyntaxKind.UndefinedKeyword) {
    return {
      type: types.Undefined,
    }
  }

  if (typeNode.kind & ts.SyntaxKind.NullKeyword) {
    return {
      type: types.Null,
    }
  }

  if (typeNode.kind & ts.SyntaxKind.AnyKeyword) {
    return {
      type: types.Any,
    }
  }

  if (typeNode.kind & ts.SyntaxKind.UnknownKeyword) {
    return {
      type: types.Unknown,
    }
  }

  if (typeNode.kind & ts.SyntaxKind.VoidKeyword) {
    return {
      type: types.Void,
    }
  }

  if (typeNode.kind & ts.SyntaxKind.NeverKeyword) {
    return {
      type: types.Never,
    }
  }

  return {
    type: types.Unsupported,
    value: typeText,
  }
}

export {getFileSymbols, getFileSymbol, types}
