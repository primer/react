import {FlatCompat} from '@eslint/eslintrc'
import path from 'node:path'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  resolvePluginsRelativeTo: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['plugin:@next/next/recommended'],
    settings: {
      next: {
        rootDir: path.join(import.meta.dirname, 'src'),
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  }),
]

export default eslintConfig
