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
    {
      name: 'ignores spread props on elements nested in conditional content',
      code: `const example = <div>{condition ? <button {...props} /> : null}</div>`,
    },
    {
      name: 'ignores spread props on elements nested in mapped content',
      code: `const example = <ul>{items.map(item => <li {...item} />)}</ul>`,
    },
    {
      name: 'ignores spread props on elements nested in a render prop',
      code: `const example = <Component render={() => <button {...props} />} />`,
    },
    {
      name: 'ignores object spread expressions outside JSX',
      code: `
        const copiedProps = {...props}
        const example = <button type="button" />
      `,
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
    {
      name: 'reports unmerged props on an outermost custom component',
      code: `const example = <Button {...props} />`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports unmerged props on an outermost member component',
      code: `const example = <ActionList.Item {...props} />`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props returned from another utility',
      code: `const example = <button {...getProps()} />`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props copied into an object expression',
      code: `const example = <button {...{...props}} />`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports only the unmerged spread alongside merged props',
      code: `const example = <button {...mergeProps(componentProps, props)} {...otherProps} />`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props on outermost elements in logical expressions',
      code: `const example = condition && <button {...props} />`,
      errors: [{messageId: 'preferMergeProps'}],
    },
  ],
})
