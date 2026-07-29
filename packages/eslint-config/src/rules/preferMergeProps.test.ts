import {RuleTester} from 'eslint'
import {describe, it} from 'vitest'
import {preferMergeProps} from './preferMergeProps.ts'

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('prefer-merge-props', preferMergeProps as unknown as Parameters<RuleTester['run']>[1], {
  valid: [
    {
      name: 'accepts outermost props merged with mergeProps',
      code: `const example = <button {...mergeProps(componentProps, props)} />`,
    },
    {
      name: 'accepts a namespaced mergeProps utility',
      code: `const example = <button {...utils.mergeProps(componentProps, props)} />`,
    },
    {
      name: 'accepts props previously merged with mergeProps',
      code: `
        const mergedProps = mergeProps(componentProps, props)
        const example = <button {...mergedProps} />
      `,
    },
    {
      name: 'ignores elements without spread props',
      code: `const example = <button type="button" />`,
    },
    {
      name: 'ignores spread props on nested elements',
      code: `const example = <div><button {...props} /></div>`,
    },
    {
      name: 'ignores spread props inside an outermost fragment',
      code: `const example = <><button {...props} /></>`,
    },
  ],
  invalid: [
    {
      name: 'reports direct props spread on an outermost element',
      code: `const example = <button {...props} />`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports each unmerged spread on an outermost element',
      code: `const example = <button {...componentProps} {...props} />`,
      errors: [{messageId: 'preferMergeProps'}, {messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports outermost elements in conditional branches',
      code: `const example = condition ? <button {...props} /> : <a {...props} />`,
      errors: [{messageId: 'preferMergeProps'}, {messageId: 'preferMergeProps'}],
    },
  ],
})
