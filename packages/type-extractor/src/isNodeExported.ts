import ts from 'typescript'

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

export {isNodeExported}
