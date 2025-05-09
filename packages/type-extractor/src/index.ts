import ts from 'typescript'

type Type =
  | {type: 'TypeAlias'; name: string; description: string | null; typeInfo: Type}
  | {type: 'TypeLiteral'; members: Array<Type>}
  | {type: 'PropertySignature'; name: string; description: string | null; typeInfo: Type; optional: boolean}
  | {type: 'UnionType'; types: Array<Type>}
  | {type: 'IntersectionType'; types: Array<Type>}
  | TypeReference
  | Identifier
  | QualifiedName
  | Function
  | Parameter
  | RestParameter
  | {type: 'FunctionDeclaration'; name: Identifier; signatures: Array<Signature>}
  | {type: 'BooleanLiteral'; value: string}
  | {type: 'NumericLiteral'; value: string}
  | {type: 'StringLiteral'; value: string}
  | {type: 'Keyword'; value: string}

type TypeReference = {
  type: 'TypeReference'
  typeName: Identifier | QualifiedName
  typeArguments: Array<Type>
}

type QualifiedName = {
  type: 'QualifiedName'
  left: QualifiedName | Identifier
  right: Identifier
}

type Identifier = {
  type: 'Identifier'
  name: string
}

type Function = {
  type: 'Function'
  parameters: Array<Parameter | RestParameter>
  typeInfo: Type
}

type Parameter = {
  type: 'Parameter'
  name: string
  typeInfo: Type
  optional: boolean
}

type RestParameter = {
  type: 'RestParameter'
  name: string
  typeInfo: Type
}

type Signature = {
  type: 'Signature'
  parameters: Array<Parameter | RestParameter>
  returnType: Type
}

export function parse(typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile): Array<Type> {
  const results: Array<Type> = []

  ts.forEachChild(sourceFile, node => {
    if (!isNodeExported(node)) {
      return
    }

    const result = getTypeInfoFromNode(typeChecker, node)
    if (result) {
      results.push(result)
    }
  })

  return results
}

function getTypeInfoFromNode(typeChecker: ts.TypeChecker, node: ts.Node): Type | null {
  if (ts.isTypeAliasDeclaration(node)) {
    const typeInfo = getTypeInfoFromNode(typeChecker, node.type)
    if (typeInfo) {
      const description = ts.getJSDocCommentsAndTags(node).flatMap(node => {
        if (node.kind === ts.SyntaxKind.JSDoc && node.comment) {
          return ts.getTextOfJSDocComment(node.comment)
        }
        return []
      })
      return {
        type: 'TypeAlias',
        name: node.name.getText(),
        description: description.length > 0 ? description.join(' ') : null,
        typeInfo,
      }
    }
    return null
  }

  if (ts.isFunctionDeclaration(node)) {
    if (!node.name) {
      return null
    }

    const symbol = typeChecker.getSymbolAtLocation(node.name)
    if (!symbol) {
      return null
    }

    const name = getTypeInfoFromNode(typeChecker, node.name)
    if (!name) {
      return null
    }

    if (name.type !== 'Identifier') {
      return null
    }

    const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    const signatures: Array<Signature> = type.getCallSignatures().flatMap(signature => {
      const returnType = signature.getReturnType()
      const parameters = signature.getParameters()

      const typeInfo = getTypeInfoForType(typeChecker, returnType)
      if (typeInfo) {
        return {
          type: 'Signature',
          parameters: parameters.flatMap(parameter => {
            const valueDeclaration = parameter.valueDeclaration
            if (!valueDeclaration) {
              return []
            }

            const parameterDeclaration = valueDeclaration as ts.ParameterDeclaration
            const restParameter = 'dotDotDotToken' in valueDeclaration && valueDeclaration.dotDotDotToken !== undefined

            const type = typeChecker.getTypeAtLocation(parameterDeclaration)
            const typeInfo = getTypeInfoForType(typeChecker, type)
            if (typeInfo) {
              if (restParameter) {
                return {
                  type: 'RestParameter',
                  name: parameter.name,
                  typeInfo,
                }
              }

              return {
                type: 'Parameter',
                name: parameter.name,
                typeInfo,
                optional: !!parameterDeclaration.questionToken,
              }
            }

            return []
          }),
          returnType: typeInfo,
        }
      }

      return []
    })

    return {
      type: 'FunctionDeclaration',
      name,
      signatures,
    }

    // const parameters: Array<Parameter | RestParameter> = []

    // for (const parameter of node.parameters) {
    // const typeInfo = getTypeInfoFromNode(typeChecker, parameter)
    // if (!typeInfo) {
    // continue
    // }
    // if (typeInfo.type !== 'Parameter' && typeInfo.type !== 'RestParameter') {
    // continue
    // }
    // parameters.push(typeInfo)
    // }

    // if (!node.type) {
    // // const symbol = typeChecker.getSymbolAtLocation(node.name)
    // // if (symbol) {
    // // const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    // // console.log(typeChecker.typeToString(type))
    // // }

    // // ts.getTypeAtLocation(typeChecker, node)
    // // ts.getTypeOfSymbolAtLocation(typeChecker, node)
    // }

    // const typeInfo = node.type ? getTypeInfoFromNode(typeChecker, node.type) : null

    // return {
    // type: 'FunctionDeclaration',
    // name,
    // typeInfo,
    // parameters,
    // }
  }

  if (ts.isTypeLiteralNode(node)) {
    const members = []

    for (const member of node.members) {
      const typeInfo = getTypeInfoFromNode(typeChecker, member)
      if (typeInfo) {
        members.push(typeInfo)
      }
    }

    return {
      type: 'TypeLiteral',
      members,
    }
  }

  if (ts.isPropertySignature(node)) {
    const typeInfo = getTypeInfoFromNode(typeChecker, node.type!)
    if (typeInfo) {
      const description = ts.getJSDocCommentsAndTags(node).flatMap(node => {
        if (node.kind === ts.SyntaxKind.JSDoc && node.comment) {
          return ts.getTextOfJSDocComment(node.comment)
        }
        return []
      })

      return {
        type: 'PropertySignature',
        name: node.name.getText(),
        optional: !!node.questionToken,
        typeInfo,
        description: description.length > 0 ? description.join(' ') : null,
      }
    }

    return null
  }

  if (ts.isUnionTypeNode(node)) {
    const types: Array<Type> = []

    for (const type of node.types) {
      const typeInfo = getTypeInfoFromNode(typeChecker, type)
      if (typeInfo) {
        types.push(typeInfo)
      }
    }

    return {
      type: 'UnionType',
      types,
    }
  }

  if (ts.isIntersectionTypeNode(node)) {
    const types: Array<Type> = []

    for (const type of node.types) {
      const typeInfo = getTypeInfoFromNode(typeChecker, type)
      if (typeInfo) {
        types.push(typeInfo)
      }
    }

    return {
      type: 'IntersectionType',
      types,
    }
  }

  if (ts.isTypeReferenceNode(node)) {
    const typeName = getTypeInfoFromNode(typeChecker, node.typeName)
    if (typeName === null) {
      return null
    }

    const typeArguments: Array<Type> = []

    if (node.typeArguments) {
      for (const typeArgument of node.typeArguments) {
        const typeInfo = getTypeInfoFromNode(typeChecker, typeArgument)
        if (typeInfo) {
          typeArguments.push(typeInfo)
        }
      }
    }

    if (typeName.type !== 'Identifier' && typeName.type !== 'QualifiedName') {
      return null
    }

    return {
      type: 'TypeReference',
      typeName,
      typeArguments,
    }
  }

  if (ts.isIdentifier(node)) {
    return {
      type: 'Identifier',
      name: node.text,
    }
  }

  if (ts.isQualifiedName(node)) {
    const left = getTypeInfoFromNode(typeChecker, node.left)
    if (!left) {
      return null
    }

    if (left.type !== 'Identifier' && left.type !== 'QualifiedName') {
      return null
    }

    const right = getTypeInfoFromNode(typeChecker, node.right)
    if (!right) {
      return null
    }

    if (right.type !== 'Identifier') {
      return null
    }

    return {
      type: 'QualifiedName',
      left,
      right,
    }
  }

  if (ts.isFunctionTypeNode(node)) {
    const symbol = typeChecker.getSymbolAtLocation(node)
    if (!symbol) {
      return null
    }

    const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    const signatures = type.getCallSignatures()

    console.log(signatures)

    // const typeInfo = getTypeInfoForType(typeChecker, type, node)

    return null

    // const typeInfo = getTypeInfoFromNode(typeChecker, node.type)
    // if (!typeInfo) {
    // return null
    // }

    // const parameters: Array<Parameter | RestParameter> = []

    // for (const parameter of node.parameters) {
    // const typeInfo = getTypeInfoFromNode(typeChecker, parameter)
    // if (!typeInfo) {
    // continue
    // }

    // if (typeInfo.type !== 'Parameter' && typeInfo.type !== 'RestParameter') {
    // continue
    // }

    // parameters.push(typeInfo)
    // }

    // return {
    // type: 'Function',
    // parameters,
    // typeInfo,
    // }
  }

  if (ts.isParameter(node)) {
    if (!node.type) {
      return null
    }

    const typeInfo = getTypeInfoFromNode(typeChecker, node.type)
    if (!typeInfo) {
      return null
    }

    const name = getTypeInfoFromNode(typeChecker, node.name)
    if (!name) {
      return null
    }

    if (name.type !== 'Identifier') {
      return null
    }

    if (node.dotDotDotToken) {
      return {
        type: 'RestParameter',
        name,
        typeInfo,
      }
    }

    return {
      type: 'Parameter',
      name,
      typeInfo,
      optional: !!node.questionToken,
    }
  }

  if (ts.isLiteralTypeNode(node)) {
    return getTypeInfoFromNode(typeChecker, node.literal)
  }

  if (ts.isStringLiteral(node)) {
    return {
      type: 'StringLiteral',
      value: node.text,
    }
  }

  if (ts.isNumericLiteral(node)) {
    return {
      type: 'NumericLiteral',
      value: node.text,
    }
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return {
      type: 'BooleanLiteral',
      value: 'true',
    }
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return {
      type: 'BooleanLiteral',
      value: 'false',
    }
  }

  if (node.kind === ts.SyntaxKind.StringKeyword) {
    return {
      type: 'Keyword',
      value: 'string',
    }
  }

  if (node.kind === ts.SyntaxKind.NumberKeyword) {
    return {
      type: 'Keyword',
      value: 'number',
    }
  }

  if (node.kind === ts.SyntaxKind.BooleanKeyword) {
    return {
      type: 'Keyword',
      value: 'boolean',
    }
  }

  if (node.kind === ts.SyntaxKind.AnyKeyword) {
    return {
      type: 'Keyword',
      value: 'any',
    }
  }

  if (node.kind === ts.SyntaxKind.UnknownKeyword) {
    return {
      type: 'Keyword',
      value: 'unknown',
    }
  }

  if (node.kind === ts.SyntaxKind.VoidKeyword) {
    return {
      type: 'Keyword',
      value: 'void',
    }
  }

  if (node.kind === ts.SyntaxKind.ObjectKeyword) {
    return {
      type: 'Keyword',
      value: 'object',
    }
  }

  if (node.kind === ts.SyntaxKind.NeverKeyword) {
    return {
      type: 'Keyword',
      value: 'never',
    }
  }

  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return {
      type: 'Keyword',
      value: 'null',
    }
  }

  if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
    return {
      type: 'Keyword',
      value: 'undefined',
    }
  }

  return null
}

function getTypeInfoForType(typeChecker: ts.TypeChecker, type: ts.Type): Type | null {
  if (type.flags & ts.TypeFlags.BooleanLiteral) {
    return {
      type: 'BooleanLiteral',
      value: typeChecker.typeToString(type),
    }
  }

  if (type.flags & ts.TypeFlags.NumberLiteral) {
    return {
      type: 'NumericLiteral',
      value: typeChecker.typeToString(type),
    }
  }

  if (type.flags & ts.TypeFlags.StringLiteral) {
    return {
      type: 'StringLiteral',
      value: typeChecker.typeToString(type),
    }
  }

  if (type.flags & ts.TypeFlags.Boolean) {
    return {
      type: 'Keyword',
      value: 'boolean',
    }
  }

  if (type.flags & ts.TypeFlags.Number) {
    return {
      type: 'Keyword',
      value: 'number',
    }
  }

  if (type.flags & ts.TypeFlags.String) {
    return {
      type: 'Keyword',
      value: 'string',
    }
  }

  if (type.flags & ts.TypeFlags.Any) {
    return {
      type: 'Keyword',
      value: 'any',
    }
  }

  if (type.flags & ts.TypeFlags.Never) {
    return {
      type: 'Keyword',
      value: 'never',
    }
  }

  if (type.flags & ts.TypeFlags.Null) {
    return {
      type: 'Keyword',
      value: 'null',
    }
  }

  if (type.flags & ts.TypeFlags.Undefined) {
    return {
      type: 'Keyword',
      value: 'undefined',
    }
  }

  if (type.flags & ts.TypeFlags.Unknown) {
    return {
      type: 'Keyword',
      value: 'unknown',
    }
  }

  if (type.flags & ts.TypeFlags.Void) {
    return {
      type: 'Keyword',
      value: 'void',
    }
  }

  console.log(ts.TypeFlags[type.flags])

  return null
}

export function isNodeExported(node: ts.Node) {
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

  if (
    // export const a = 1
    ts.isVariableStatement(node) ||
    // export function a() {}
    ts.isFunctionDeclaration(node) ||
    // export class A {}
    ts.isClassDeclaration(node) ||
    // export interface A {}
    ts.isInterfaceDeclaration(node) ||
    // export type A = {}
    ts.isTypeAliasDeclaration(node) ||
    // export enum A {}
    ts.isEnumDeclaration(node)
  ) {
    const exportKeyword = node.modifiers?.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)
    if (exportKeyword) {
      return true
    }
  }

  return false
}
