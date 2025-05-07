import fs from 'node:fs'
import path from 'node:path'

const TEST_DIRECTORY = path.resolve('src/__tests__')
const SOURCE_DIRECTORY = path.resolve('src')

for (const name of fs.readdirSync(TEST_DIRECTORY)) {
  const filepath = path.join(TEST_DIRECTORY, name)
  const stats = fs.statSync(filepath)
  if (stats.isDirectory()) {
    continue
  }

  if (name[0] !== name[0].toUpperCase()) {
    continue
  }

  let component = ''

  if (name.endsWith('.types.test.tsx')) {
    component = path.basename(name, '.types.test.tsx')
  } else if (name.endsWith('.test.tsx')) {
    component = path.basename(name, '.test.tsx')
  }

  if (component === '') {
    continue
  }

  const componentDirectory = path.join(SOURCE_DIRECTORY, component)
  if (!fs.existsSync(componentDirectory)) {
    continue
  }

  if (name.endsWith('.types.test.tsx')) {
    fs.renameSync(filepath, path.join(componentDirectory, `${component}.types.test.tsx`))
  } else if (name.endsWith('.test.tsx')) {
    fs.renameSync(filepath, path.join(componentDirectory, `${component}.test.tsx`))
  }

  // fs.copyFileSync(filepath, path.join(componentDirectory, `${component}.test.tsx`))
  // console.log(componentDirectory)
  // const componentName = path.ext

  // console.log(name)
}
