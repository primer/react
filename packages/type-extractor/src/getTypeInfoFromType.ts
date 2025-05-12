import ts from 'typescript'

function getTypeInfoFromType(typChecker: ts.TypeChecker, type: ts.Type) {
  console.log('hi')
  // const symbol = type.getSymbol()
  // const declaration = symbol.valueDeclaration;
  // const node = declaration.getChildren()[0]
  // console.log('hi')
  // //
}

export {getTypeInfoFromType}
