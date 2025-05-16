import ts from 'typescript'
import {isNodeExported} from './isNodeExported.ts'

function getMetadataFromSourceFile(typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile): Metadata {
  const metadata: Metadata = {
    exports: [],
  }

  ts.forEachChild(sourceFile, node => {
    if (!isNodeExported(node)) {
      return
    }

    if (ts.isExportDeclaration(node)) {
      if (ts.isExportDeclaration(node)) {
        const exportClause = node.exportClause
        if (!exportClause) {
          return
        }

        if (ts.isNamedExports(exportClause)) {
          for (const element of exportClause.elements) {
            if (!ts.isExportSpecifier(element)) {
              continue
            }

            // Get node for export specifier
            const symbol = typeChecker.getExportSpecifierLocalTargetSymbol(element)
            if (!symbol) {
              continue
            }

            if (!symbol.declarations) {
              continue
            }

            for (const declaration of symbol.declarations) {
              const type = getTypeInfo(typeChecker, declaration)
              metadata.exports.push({
                kind: 'ExportSpecifier',
                name: element.name.getText(),
                type,
              })
              break
            }
          }
        }
      }
    } else if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        const type = getTypeInfo(typeChecker, declaration)
        metadata.exports.push(type)
      }
    } else {
      const type = getTypeInfo(typeChecker, node)
      metadata.exports.push(type)
    }
  })

  return metadata
}

type Metadata = {
  exports: Array<Type>
}

type Type =
  | {
      kind: 'ExportSpecifier'
      name: string
      type: Type
    }
  | {
      kind: 'TypeAlias'
      name: string
      typeParameters: Array<TypeParameter>
      type: Type
    }
  | CallExpression
  | PropertyAccessExpression
  | TypeParameter
  | VariableDeclaration
  | {
      kind: 'TypeLiteral'
      members: Array<PropertySignature>
    }
  | PropertySignature
  | {
      kind: 'Intersection'
      members: Array<Type>
    }
  | {
      kind: 'Union'
      members: Array<Type>
    }
  | {
      kind: 'TypeReference'
      typeName: QualifiedName | Identifier
      typeArguments: Array<Type>
    }
  | FunctionDeclaration
  | Function
  | Parameter
  | Identifier
  | QualifiedName
  | Tuple
  | {
      kind: 'BooleanLiteral'
      value: string
    }
  | {
      kind: 'StringLiteral'
      value: string
    }
  | {
      kind: 'NumericLiteral'
      value: string
    }
  | {
      kind: 'Boolean'
    }
  | {
      kind: 'Number'
    }
  | {
      kind: 'String'
    }
  | {
      kind: 'Never'
    }
  | {
      kind: 'Null'
    }
  | {
      kind: 'Undefined'
    }
  | {
      kind: 'Any'
    }
  | {
      kind: 'Void'
    }
  | {
      kind: 'Unknown'
    }
  | {
      kind: 'Unsupported'
      typeKind?: string
      type: string
    }

type VariableDeclaration = {
  kind: 'VariableDeclaration'
  name: Identifier
  type: Type
}

type PropertySignature = {
  kind: 'PropertySignature'
  name: string
  optional: boolean
  type: Type
}

type Identifier = {
  kind: 'Identifier'
  name: string
}

type QualifiedName = {
  kind: 'QualifiedName'
  left: QualifiedName | Identifier
  right: Identifier
}

type TypeParameter = {
  kind: 'TypeParameter'
  name: string
  constraint?: Type
  default?: Type
}

type CallExpression = {
  kind: 'CallExpression'
  expression: Identifier | PropertyAccessExpression
  typeArguments: Array<Type>
  arguments: Array<Type>
}

type PropertyAccessExpression = {
  kind: 'PropertyAccessExpression'
  expression: Identifier | PropertyAccessExpression
  name: Identifier
}

type FunctionDeclaration = {
  kind: 'FunctionDeclaration'
  name: string
  signatures: Array<Signature>
}

type Function = {
  kind: 'Function'
  parameters: Array<Parameter>
  returnType: Type
  typeParameters: Array<TypeParameter>
}

type Signature = {
  kind: 'Signature'
  parameters: Array<Parameter>
  returnType: Type
  typeParameters: Array<TypeParameter>
}

type Parameter = {
  kind: 'Parameter'
  name: Identifier | ObjectBindingPattern | ArrayBindingPattern
  type: Type
  optional: boolean
  rest: boolean
}

type ObjectBindingPattern = {
  kind: 'ObjectBindingPattern'
  elements: Array<BindingElement>
}

type BindingElement = {
  kind: 'BindingElement'
  propertyName?: Identifier
  name: Identifier
  restProperty: boolean
}

type ArrayBindingPattern = {
  kind: 'ArrayBindingPattern'
  elements: Array<BindingElement | OmittedExpression>
}

type OmittedExpression = {
  kind: 'OmittedExpression'
}

type Tuple = {
  kind: 'Tuple'
  elements: Array<Type>
}

function getTypeInfo(typeChecker: ts.TypeChecker, node: ts.Node): Type {
  if (ts.isVariableDeclaration(node)) {
    const type = node.type
      ? getTypeInfo(typeChecker, node.type)
      : node.initializer
        ? getTypeInfo(typeChecker, node.initializer)
        : ({kind: 'Any'} as const)

    return {
      kind: 'VariableDeclaration',
      name: {
        kind: 'Identifier',
        name: node.name.getText(),
      },
      type,
    }
  }

  if (ts.isFunctionDeclaration(node)) {
    if (!node.name) {
      return unsupported(typeChecker, node)
    }

    const symbol = typeChecker.getSymbolAtLocation(node.name)
    if (!symbol) {
      return unsupported(typeChecker, node)
    }

    const type = typeChecker.getTypeOfSymbolAtLocation(symbol, node)
    const signatures: Array<Signature> = []

    for (const signature of type.getCallSignatures()) {
      const returnType = getTypeInfoFromType(typeChecker, signature.getReturnType())
      const parameters: Array<Parameter> = []
      const typeParameters: Array<TypeParameter> = []

      for (const parameter of signature.getParameters()) {
        const valueDeclaration = parameter.valueDeclaration
        if (!valueDeclaration) {
          continue
        }

        const parameterDeclaration = valueDeclaration as ts.ParameterDeclaration
        const parameterType = getTypeInfo(typeChecker, parameterDeclaration)

        if (parameterType.kind === 'Parameter') {
          parameters.push(parameterType)
        }
      }

      if (signature.typeParameters) {
        for (const typeParameter of signature.typeParameters) {
          const typeParameterType = getTypeInfoFromType(typeChecker, typeParameter)
          if (typeParameterType.kind === 'TypeParameter') {
            typeParameters.push(typeParameterType)
          }
        }
      }

      signatures.push({
        kind: 'Signature',
        parameters,
        returnType,
        typeParameters,
      })
    }

    return {
      kind: 'FunctionDeclaration',
      name: node.name.getText(),
      signatures,
    }
  }

  if (ts.isFunctionTypeNode(node)) {
    const parameters: Array<Parameter> = []

    for (const parameter of node.parameters) {
      const parameterType = getTypeInfo(typeChecker, parameter)
      if (parameterType.kind === 'Parameter') {
        parameters.push(parameterType)
      }
    }

    const typeParameters: Array<TypeParameter> = []

    if (node.typeParameters) {
      for (const typeParameter of node.typeParameters) {
        const typeParameterType = getTypeInfo(typeChecker, typeParameter)
        if (typeParameterType.kind === 'TypeParameter') {
          typeParameters.push(typeParameterType)
        }
      }
    }

    return {
      kind: 'Function',
      parameters,
      returnType: getTypeInfo(typeChecker, node.type),
      typeParameters,
    }
  }

  if (ts.isFunctionExpression(node)) {
    if (!node.name) {
      return unsupported(typeChecker, node)
    }

    const symbol = typeChecker.getSymbolAtLocation(node.name)
    if (!symbol) {
      return unsupported(typeChecker, node)
    }

    const type = typeChecker.getTypeOfSymbolAtLocation(symbol, node)
    const signatures: Array<Signature> = []

    for (const signature of type.getCallSignatures()) {
      const returnType = getTypeInfoFromType(typeChecker, signature.getReturnType())
      const parameters: Array<Parameter> = []
      const typeParameters: Array<TypeParameter> = []

      for (const parameter of signature.getParameters()) {
        const valueDeclaration = parameter.valueDeclaration
        if (!valueDeclaration) {
          continue
        }

        const parameterDeclaration = valueDeclaration as ts.ParameterDeclaration
        const parameterType = getTypeInfo(typeChecker, parameterDeclaration)

        if (parameterType.kind === 'Parameter') {
          parameters.push(parameterType)
        }
      }

      if (signature.typeParameters) {
        for (const typeParameter of signature.typeParameters) {
          const typeParameterType = getTypeInfoFromType(typeChecker, typeParameter)
          if (typeParameterType.kind === 'TypeParameter') {
            typeParameters.push(typeParameterType)
          }
        }
      }

      signatures.push({
        kind: 'Signature',
        parameters,
        returnType,
        typeParameters,
      })
    }

    return {
      kind: 'FunctionDeclaration',
      name: node.name.getText(),
      signatures,
    }
  }

  if (ts.isArrowFunction(node)) {
    const symbol = typeChecker.getSymbolAtLocation(node)
    if (!symbol) {
      return unsupported(typeChecker, node)
    }

    const type = typeChecker.getTypeOfSymbolAtLocation(symbol, node)
    const signatures: Array<Signature> = []

    for (const signature of type.getCallSignatures()) {
      const returnType = getTypeInfoFromType(typeChecker, signature.getReturnType())
      const parameters: Array<Parameter> = []
      const typeParameters: Array<TypeParameter> = []

      for (const parameter of signature.getParameters()) {
        const valueDeclaration = parameter.valueDeclaration
        if (!valueDeclaration) {
          continue
        }

        const parameterDeclaration = valueDeclaration as ts.ParameterDeclaration
        const parameterType = getTypeInfo(typeChecker, parameterDeclaration)

        if (parameterType.kind === 'Parameter') {
          parameters.push(parameterType)
        }
      }

      if (signature.typeParameters) {
        for (const typeParameter of signature.typeParameters) {
          const typeParameterType = getTypeInfoFromType(typeChecker, typeParameter)
          if (typeParameterType.kind === 'TypeParameter') {
            typeParameters.push(typeParameterType)
          }
        }
      }

      signatures.push({
        kind: 'Signature',
        parameters,
        returnType,
        typeParameters,
      })
    }

    return {
      kind: 'FunctionDeclaration',
      name: node.name.getText(),
      signatures,
    }
  }

  if (ts.isInterfaceDeclaration(node)) {
    // ...
  }

  if (ts.isTypeAliasDeclaration(node)) {
    const typeParameters: Array<TypeParameter> = []

    if (node.typeParameters) {
      for (const typeParameter of node.typeParameters) {
        const type = getTypeInfo(typeChecker, typeParameter)
        if (type.kind === 'TypeParameter') {
          typeParameters.push(type)
        }
      }
    }

    return {
      kind: 'TypeAlias',
      name: node.name.getText(),
      typeParameters,
      type: getTypeInfo(typeChecker, node.type),
    }
  }

  if (ts.isTypeParameterDeclaration(node)) {
    return {
      kind: 'TypeParameter',
      name: node.name.getText(),
      constraint: node.constraint ? getTypeInfo(typeChecker, node.constraint) : undefined,
      default: node.default ? getTypeInfo(typeChecker, node.default) : undefined,
    }
  }

  if (ts.isIntersectionTypeNode(node)) {
    return {
      kind: 'Intersection',
      members: node.types.map(type => getTypeInfo(typeChecker, type)),
    }
  }

  if (ts.isUnionTypeNode(node)) {
    return {
      kind: 'Union',
      members: node.types.map(type => getTypeInfo(typeChecker, type)),
    }
  }

  if (ts.isTypeLiteralNode(node)) {
    const typeNode = node as ts.TypeLiteralNode
    const members: Array<PropertySignature> = []

    ts.forEachChild(typeNode, child => {
      if (ts.isPropertySignature(child)) {
        const type = getTypeInfo(typeChecker, child)
        if (type.kind === 'PropertySignature') {
          members.push(type)
        }
      }
    })

    return {
      kind: 'TypeLiteral',
      members,
    }
  }

  if (ts.isPropertySignature(node)) {
    const propertySignature = node as ts.PropertySignature
    if (!propertySignature.type) {
      return {
        kind: 'Unsupported',
        type: typeChecker.typeToString(
          typeChecker.getTypeAtLocation(propertySignature),
          undefined,
          ts.TypeFormatFlags.NoTypeReduction | ts.TypeFormatFlags.WriteArrayAsGenericType,
        ),
      }
    }

    return {
      kind: 'PropertySignature',
      name: propertySignature.name.getText(),
      optional: !!propertySignature.questionToken,
      type: getTypeInfo(typeChecker, propertySignature.type),
    }
  }

  if (ts.isCallExpression(node)) {
    const expression = getTypeInfo(typeChecker, node.expression)
    if (expression.kind === 'Identifier' || expression.kind === 'PropertyAccessExpression') {
      const args: Array<Type> = []

      for (const arg of node.arguments) {
        const type = getTypeInfo(typeChecker, arg)
        args.push(type)
      }

      const typeArguments: Array<Type> = []

      if (node.typeArguments) {
        for (const typeArgument of node.typeArguments) {
          const type = getTypeInfo(typeChecker, typeArgument)
          if (type.kind === 'TypeReference') {
            typeArguments.push(type)
          }
        }
      }

      return {
        kind: 'CallExpression',
        expression,
        typeArguments,
        arguments: args,
      }
    }
  }

  if (ts.isPropertyAccessExpression(node)) {
    const expression = getTypeInfo(typeChecker, node.expression)
    if (expression.kind === 'Identifier' || expression.kind === 'PropertyAccessExpression') {
      return {
        kind: 'PropertyAccessExpression',
        expression,
        name: {
          kind: 'Identifier',
          name: node.name.getText(),
        },
      }
    }
  }

  if (ts.isParameter(node)) {
    if (node.name.kind === ts.SyntaxKind.ObjectBindingPattern) {
      return {
        kind: 'Parameter',
        name: {
          kind: 'ObjectBindingPattern',
          elements: node.name.elements.map(element => {
            if (element.propertyName) {
              return {
                kind: 'BindingElement',
                propertyName: {
                  kind: 'Identifier',
                  name: element.propertyName.getText(),
                },
                name: {
                  kind: 'Identifier',
                  name: element.name.getText(),
                },
                restProperty: !!element.dotDotDotToken,
              }
            }

            return {
              kind: 'BindingElement',
              name: {
                kind: 'Identifier',
                name: element.name.getText(),
              },
              restProperty: !!element.dotDotDotToken,
            }
          }),
        },
        type: node.type ? getTypeInfo(typeChecker, node.type) : {kind: 'Any'},
        optional: !!node.questionToken,
        rest: !!node.dotDotDotToken,
      }
    }

    if (node.name.kind === ts.SyntaxKind.ArrayBindingPattern) {
      return {
        kind: 'Parameter',
        name: {
          kind: 'ArrayBindingPattern',
          elements: node.name.elements.map(element => {
            if (ts.isOmittedExpression(element)) {
              return {
                kind: 'OmittedExpression',
              }
            }
            return {
              kind: 'BindingElement',
              name: {
                kind: 'Identifier',
                name: element.name.getText(),
              },
              restProperty: !!element.dotDotDotToken,
            }
          }),
        },
        type: node.type ? getTypeInfo(typeChecker, node.type) : {kind: 'Any'},
        optional: !!node.questionToken,
        rest: !!node.dotDotDotToken,
      }
    }

    return {
      kind: 'Parameter',
      name: {
        kind: 'Identifier',
        name: node.name.getText(),
      },
      type: node.type ? getTypeInfo(typeChecker, node.type) : {kind: 'Any'},
      optional: !!node.questionToken,
      rest: !!node.dotDotDotToken,
    }
  }

  if (ts.isTypeReferenceNode(node)) {
    const typeName = getTypeInfo(typeChecker, node.typeName)
    if (typeName.kind === 'Identifier' || typeName.kind === 'QualifiedName') {
      return {
        kind: 'TypeReference',
        typeName,
        typeArguments: node.typeArguments ? node.typeArguments.map(type => getTypeInfo(typeChecker, type)) : [],
      }
    }
  }

  if (ts.isTupleTypeNode(node)) {
    return {
      kind: 'Tuple',
      elements: node.elements.map(element => {
        return getTypeInfo(typeChecker, element)
      }),
    }
  }

  if (ts.isIdentifier(node)) {
    return {
      kind: 'Identifier',
      name: node.text,
    }
  }

  if (ts.isQualifiedName(node)) {
    const left = getTypeInfo(typeChecker, node.left)
    const right = getTypeInfo(typeChecker, node.right)

    if (left.kind === 'Identifier' || left.kind === 'QualifiedName') {
      if (right.kind === 'Identifier') {
        return {
          kind: 'QualifiedName',
          left,
          right,
        }
      }
    }
  }

  if (ts.isLiteralTypeNode(node)) {
    return getTypeInfo(typeChecker, node.literal)
  }

  if (ts.isStringLiteral(node)) {
    return {
      kind: 'StringLiteral',
      value: node.text,
    }
  }

  if (ts.isNumericLiteral(node)) {
    return {
      kind: 'NumericLiteral',
      value: node.text,
    }
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return {
      kind: 'BooleanLiteral',
      value: 'true',
    }
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return {
      kind: 'BooleanLiteral',
      value: 'false',
    }
  }

  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return {
      kind: 'Null',
    }
  }

  if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
    return {
      kind: 'Undefined',
    }
  }

  if (node.kind === ts.SyntaxKind.AnyKeyword) {
    return {
      kind: 'Any',
    }
  }

  if (node.kind === ts.SyntaxKind.UnknownKeyword) {
    return {
      kind: 'Unknown',
    }
  }

  if (node.kind === ts.SyntaxKind.NeverKeyword) {
    return {
      kind: 'Never',
    }
  }

  if (node.kind === ts.SyntaxKind.StringKeyword) {
    return {
      kind: 'String',
    }
  }

  if (node.kind === ts.SyntaxKind.NumberKeyword) {
    return {
      kind: 'Number',
    }
  }

  if (node.kind === ts.SyntaxKind.BooleanKeyword) {
    return {
      kind: 'Boolean',
    }
  }

  if (node.kind === ts.SyntaxKind.VoidKeyword) {
    return {
      kind: 'Void',
    }
  }

  return {
    kind: 'Unsupported',
    typeKind: ts.SyntaxKind[node.kind],
    type: typeChecker.typeToString(
      typeChecker.getTypeAtLocation(node),
      undefined,
      ts.TypeFormatFlags.WriteArrayAsGenericType |
        ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
        ts.TypeFormatFlags.NoTypeReduction,
    ),
  }
}

function unsupported(typeChecker: ts.TypeChecker, node: ts.Node) {
  return {
    kind: 'Unsupported',
    typeKind: ts.SyntaxKind[node.kind],
    type: typeChecker.typeToString(
      typeChecker.getTypeAtLocation(node),
      undefined,
      ts.TypeFormatFlags.WriteArrayAsGenericType |
        ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
        ts.TypeFormatFlags.NoTypeReduction,
    ),
  } as const
}

function getTypeInfoFromType(typeChecker: ts.TypeChecker, type: ts.Type): Type {
  if (type.flags & ts.TypeFlags.BooleanLiteral) {
    return {
      kind: 'BooleanLiteral',
      value: typeChecker.typeToString(type),
    }
  }

  if (type.flags & ts.TypeFlags.StringLiteral) {
    return {
      kind: 'StringLiteral',
      // When using typeToString, the string literal is wrapped in quotes
      value: typeChecker.typeToString(type).slice(1, -1),
    }
  }

  if (type.flags & ts.TypeFlags.NumberLiteral) {
    return {
      kind: 'NumericLiteral',
      value: typeChecker.typeToString(type),
    }
  }

  if (type.flags & ts.TypeFlags.Boolean) {
    return {
      kind: 'Boolean',
    }
  }

  if (type.flags & ts.TypeFlags.Number) {
    return {
      kind: 'Number',
    }
  }

  if (type.flags & ts.TypeFlags.String) {
    return {
      kind: 'String',
    }
  }

  if (type.flags & ts.TypeFlags.Any) {
    return {
      kind: 'Any',
    }
  }

  if (type.flags & ts.TypeFlags.Never) {
    return {
      kind: 'Never',
    }
  }

  if (type.flags & ts.TypeFlags.Null) {
    return {
      kind: 'Null',
    }
  }

  if (type.flags & ts.TypeFlags.Undefined) {
    return {
      kind: 'Undefined',
    }
  }

  if (type.flags & ts.TypeFlags.Unknown) {
    return {
      kind: 'Unknown',
    }
  }

  if (type.flags & ts.TypeFlags.Void) {
    return {
      kind: 'Void',
    }
  }

  if (type.flags & ts.TypeFlags.Union) {
    const unionType = type as ts.UnionType
    return {
      kind: 'Union',
      members: unionType.types.map(type => getTypeInfoFromType(typeChecker, type)),
    }
  }

  if (type.flags & ts.TypeFlags.Intersection) {
    const intersectionType = type as ts.IntersectionType
    return {
      kind: 'Intersection',
      members: intersectionType.types.map(type => getTypeInfoFromType(typeChecker, type)),
    }
  }

  if (type.flags & ts.TypeFlags.TypeParameter) {
    const constraint = type.getConstraint()
    const defaultType = type.getDefault()

    return {
      kind: 'TypeParameter',
      name: typeChecker.typeToString(type),
      constraint: constraint ? getTypeInfoFromType(typeChecker, constraint) : undefined,
      default: defaultType ? getTypeInfoFromType(typeChecker, defaultType) : undefined,
    }
  }

  if (type.flags & ts.TypeFlags.Object) {
    const objectType = type as ts.ObjectType

    if (objectType.objectFlags & ts.ObjectFlags.Reference) {
      const typeReference = objectType as ts.TypeReference
      const target = typeReference.target

      return {
        kind: 'TypeReference',
        typeName: getSymbolName(typeChecker, target.symbol),
        typeArguments: Array.isArray(typeReference.typeArguments)
          ? typeReference.typeArguments.map(type => {
              return getTypeInfoFromType(typeChecker, type)
            })
          : [],
      }
    } else if (objectType.objectFlags & ts.ObjectFlags.Anonymous) {
      const members: Array<PropertySignature> = []

      objectType.getProperties().forEach(property => {
        const declaration = property.valueDeclaration
        if (!declaration) {
          return
        }

        const type = getTypeInfoFromType(typeChecker, typeChecker.getTypeOfSymbolAtLocation(property, declaration))
        members.push({
          kind: 'PropertySignature',
          name: property.name,
          optional: !!(declaration as ts.PropertySignature).questionToken,
          type,
        })
      })

      return {
        kind: 'TypeLiteral',
        members,
      }
    }
  }

  return unsupportedType(typeChecker, type)
}

function getSymbolName(typeChecker: ts.TypeChecker, symbol: ts.Symbol): QualifiedName | Identifier {
  const name = typeChecker.getFullyQualifiedName(symbol)
  const parts = name.split('.')

  return getQualifiedName(parts)
}

function getQualifiedName(parts: Array<string>): QualifiedName | Identifier {
  if (parts.length === 1) {
    return {
      kind: 'Identifier',
      name: parts[0],
    }
  }

  if (parts.length > 1) {
    return {
      kind: 'QualifiedName',
      left: getQualifiedName(parts.slice(0, -1)),
      right: {
        kind: 'Identifier',
        name: parts[parts.length - 1],
      },
    }
  }

  throw new Error('Invalid qualified name')
}

function unsupportedType(typeChecker: ts.TypeChecker, type: ts.Type) {
  return {
    kind: 'Unsupported',
    typeKind: ts.TypeFlags[type.flags],
    type: typeChecker.typeToString(
      type,
      undefined,
      ts.TypeFormatFlags.WriteArrayAsGenericType |
        ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
        ts.TypeFormatFlags.NoTypeReduction,
    ),
  } as const
}

function format(type: Type): string {
  if (type.kind === 'ExportSpecifier') {
    return `${type.name}: ${format(type.type)}`
  }

  if (type.kind === 'TypeAlias') {
    return `type ${type.name}${formatTypeParameters(type.typeParameters)} = ${format(type.type)}`
  }

  if (type.kind === 'VariableDeclaration') {
    return `const ${type.name.name}: ${format(type.type)}`
  }

  if (type.kind === 'TypeReference') {
    const typeArguments = type.typeArguments.length > 0 ? formatTypeParameters(type.typeArguments) : ''
    return `${format(type.typeName)}${typeArguments}`
  }

  if (type.kind === 'CallExpression') {
    const typeArguments = type.typeArguments.length > 0 ? formatTypeParameters(type.typeArguments) : ''
    const args = type.arguments.length > 0 ? `(${type.arguments.map(format).join(', ')})` : ''
    return `${format(type.expression)}${typeArguments}${args}`
  }

  if (type.kind === 'PropertyAccessExpression') {
    return `${format(type.expression)}.${type.name.name}`
  }

  if (type.kind === 'Identifier') {
    return type.name
  }

  if (type.kind === 'QualifiedName') {
    return `${format(type.left)}.${type.right.name}`
  }

  if (type.kind === 'TypeParameter') {
    const constraint = type.constraint ? ` extends ${format(type.constraint)}` : ''
    const defaultType = type.default ? ` = ${format(type.default)}` : ''
    return `${type.name}${constraint}${defaultType}`
  }

  if (type.kind === 'PropertySignature') {
    return `${type.name}${type.optional ? '?' : ''}: ${format(type.type)}`
  }

  if (type.kind === 'TypeLiteral') {
    return `{ ${type.members.map(format).join(', ')} }`
  }

  if (type.kind === 'Intersection') {
    return type.members.map(format).join(' & ')
  }

  if (type.kind === 'Union') {
    return type.members.map(format).join(' | ')
  }

  if (type.kind === 'Tuple') {
    return `[${type.elements.map(format).join(', ')}]`
  }

  if (type.kind === 'BooleanLiteral') {
    return type.value
  }

  if (type.kind === 'StringLiteral') {
    return `"${type.value}"`
  }

  if (type.kind === 'NumericLiteral') {
    return type.value
  }

  if (type.kind === 'Boolean') {
    return 'boolean'
  }

  if (type.kind === 'Number') {
    return 'number'
  }

  if (type.kind === 'String') {
    return 'string'
  }

  if (type.kind === 'Never') {
    return 'never'
  }

  if (type.kind === 'Null') {
    return 'null'
  }

  if (type.kind === 'Undefined') {
    return 'undefined'
  }

  if (type.kind === 'Any') {
    return 'any'
  }

  if (type.kind === 'Void') {
    return 'void'
  }

  if (type.kind === 'Unknown') {
    return 'unknown'
  }

  if (type.kind === 'Function') {
    const parameters = type.parameters.map(parameter => {
      return `${parameter.name.name}${parameter.optional ? '?' : ''}: ${format(parameter.type)}`
    })
    const typeParameters = formatTypeParameters(type.typeParameters)
    return `(${parameters.join(', ')}) => ${format(type.returnType)}`
  }

  if (type.kind === 'Signature') {
    const parameters = type.parameters.map(parameter => {
      return `${parameter.name.name}${parameter.optional ? '?' : ''}: ${format(parameter.type)}`
    })
    const typeParameters = formatTypeParameters(type.typeParameters)
    return `(${parameters.join(', ')}) => ${format(type.returnType)}`
  }

  if (type.kind === 'Parameter') {
    if (type.name.kind === 'ObjectBindingPattern') {
      const elements = type.name.elements.map(element => {
        if (element.propertyName) {
          return `${element.propertyName.name}: ${element.name.name}`
        }
        return `${element.name.name}`
      })
      return `{ ${elements.join(', ')} }${type.optional ? '?' : ''}: ${format(type.type)}`
    }

    if (type.name.kind === 'ArrayBindingPattern') {
      const elements = type.name.elements.map(element => {
        if (element.kind === 'OmittedExpression') {
          return `...`
        }
        return `${element.name.name}`
      })
      return `[${elements.join(', ')}]${type.optional ? '?' : ''}: ${format(type.type)}`
    }

    return `${type.name.name}${type.optional ? '?' : ''}: ${format(type.type)}`
  }

  if (type.kind === 'FunctionDeclaration') {
    const signatures = type.signatures.map(signature => {
      const parameters = signature.parameters.map(parameter => {
        return `${parameter.name.name}${parameter.optional ? '?' : ''}: ${format(parameter.type)}`
      })
      const typeParameters = formatTypeParameters(signature.typeParameters)
      return `(${parameters.join(', ')}) => ${format(signature.returnType)}`
    })
    return `function ${type.name}(${signatures.join(' | ')})`
  }

  if (type.kind === 'Unsupported') {
    return type.type
  }

  exhaustiveCheck(type)
}

function formatTypeParameters(typeParameters: Array<TypeParameter>): string {
  if (typeParameters.length === 0) {
    return ''
  }

  const formattedTypeParameters = typeParameters.map(typeParameter => {
    const constraint = typeParameter.constraint ? ` extends ${format(typeParameter.constraint)}` : ''
    const defaultType = typeParameter.default ? ` = ${format(typeParameter.default)}` : ''
    return `${typeParameter.name}${constraint}${defaultType}`
  })

  return `<${formattedTypeParameters.join(', ')}>`
}

function exhaustiveCheck(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}

export {getMetadataFromSourceFile, format}
export type {Metadata, Type}
