import fs from 'node:fs'
import ts from 'typescript'
import glob from 'fast-glob'
const [dir, ...want] = process.argv.slice(2)
for (const file of glob.sync(`src/components/${dir}/*.{ts,tsx}`).filter(f => !/\.(test|stories|storyHelpers)\./.test(f))) {
  const src = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const visit = node => {
    if (ts.isFunctionLike(node) && node.body) {
      const names = []
      if (node.name && ts.isIdentifier(node.name)) names.push(node.name.text)
      let p = node.parent
      while (p && (ts.isCallExpression(p) || ts.isParenthesizedExpression(p) || ts.isAsExpression(p))) p = p.parent
      if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) names.push(p.name.text)
      if (names.some(n => want.includes(n))) {
        const first = node.parameters[0]?.name
        const text = first ? first.getText().replace(/\s+/g, ' ').slice(0, 300) : '(none)'
        console.log(`${file.split('/').pop()}:${src.getLineAndCharacterOfPosition(node.getStart()).line + 1} [${names.join(',')}] ${text}`)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(src)
}
