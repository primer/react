import {RuleTester} from 'eslint'
import tsParser from '@typescript-eslint/parser'
import {describe, it} from 'vitest'
import {preferMergeProps} from './preferMergeProps.ts'

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    parser: tsParser,
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
      name: 'accepts component root props merged with mergeProps',
      code: `function Example() { return <button {...mergeProps(componentProps, props)} /> }`,
    },
    {
      name: 'accepts a namespaced mergeProps utility',
      code: `function Example() { return <button {...utils.mergeProps(componentProps, props)} /> }`,
    },
    {
      name: 'accepts props previously merged with mergeProps',
      code: `
        function Example() {
          const mergedProps = mergeProps(componentProps, props)
          return <button {...mergedProps} />
        }
      `,
    },
    {
      name: 'ignores elements without spread props',
      code: `function Example() { return <button type="button" /> }`,
    },
    {
      name: 'ignores a component that only forwards consumer props',
      code: `function Example(props) { return <button {...props} /> }`,
    },
    {
      name: 'ignores a component that forwards consumer props and composes a ref separately',
      code: `const Example = React.forwardRef((props, ref) => <button {...props} ref={ref} />)`,
    },
    {
      name: 'ignores a component that only forwards props to a custom component',
      code: `function Example(props) { return <Button {...props} /> }`,
    },
    {
      name: 'ignores spread props on nested elements',
      code: `function Example() { return <div><button {...props} /></div> }`,
    },
    {
      name: 'ignores spread props inside a root fragment',
      code: `function Example() { return <><button {...props} /></> }`,
    },
    {
      name: 'ignores spread props on elements nested in conditional content',
      code: `function Example() { return <div>{condition ? <button {...props} /> : null}</div> }`,
    },
    {
      name: 'ignores spread props on elements nested in mapped content',
      code: `function Example() { return <ul>{items.map(item => <li {...item} />)}</ul> }`,
    },
    {
      name: 'ignores spread props on elements nested in a render prop',
      code: `function Example() { return <Component render={() => <button {...props} />} /> }`,
    },
    {
      name: 'ignores object spread expressions outside JSX',
      code: `
        const copiedProps = {...props}
        const example = <button type="button" />
      `,
    },
    {
      name: 'ignores JSX assigned outside a component',
      code: `const example = <button {...props} />`,
    },
    {
      name: 'ignores JSX returned by a lowercase helper',
      code: `function renderButton() { return <button {...props} /> }`,
    },
    {
      name: 'ignores JSX returned by an unrelated callback',
      code: `const buttons = items.map(props => <button {...props} />)`,
    },
    {
      name: 'ignores component roots in test files',
      filename: 'Example.test.jsx',
      code: `function Example() { return <button {...props} /> }`,
    },
    {
      name: 'ignores component roots in story files',
      filename: 'Example.stories.jsx',
      code: `function Example() { return <button {...props} /> }`,
    },
    {
      name: 'ignores component roots in test directories',
      filename: '__tests__/Example.jsx',
      code: `function Example() { return <button {...props} /> }`,
    },
  ],
  invalid: [
    {
      name: 'reports direct props spread on a function component root',
      code: `function Example(props) { return <button {...props} type="button" /> }`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports rest props composed with an explicit handler',
      code: `
        function Example({onClick, ...rest}) {
          return <button {...rest} type="button" onClick={event => onClick?.(event)} />
        }
      `,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports each unmerged spread on a component root',
      code: `function Example() { return <button {...componentProps} {...props} /> }`,
      errors: [{messageId: 'preferMergeProps'}, {messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports component roots in separate return branches',
      code: `
        function Example({foo, ...rest}) {
          if (foo) {
            return <a {...rest} href="#" />
          }
          return <button {...rest} type="button" />
        }
      `,
      errors: [{messageId: 'preferMergeProps'}, {messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports component roots in conditional expression branches',
      code: `function Example() { return condition ? <button type="button" {...props} /> : <a href="#" {...props} /> }`,
      errors: [{messageId: 'preferMergeProps'}, {messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports unmerged props on a root custom component',
      code: `function Example() { return <Button variant="primary" {...props} /> }`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports unmerged props on a root member component',
      code: `function Example() { return <ActionList.Item role="menuitem" {...props} /> }`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports spread props returned from a function call',
      code: `function Example() { return <button type="button" {...getProps()} /> }`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props copied into an object expression',
      code: `function Example() { return <button type="button" {...{...props}} /> }`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports only the unmerged spread alongside merged props',
      code: `function Example() { return <button {...mergeProps(componentProps, props)} {...otherProps} /> }`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props on component roots in logical expressions',
      code: `function Example() { return condition && <button type="button" {...props} /> }`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props on a concise arrow component root',
      code: `const Example = props => <button type="button" {...props} />`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props on a forwardRef component root',
      code: `const Example = React.forwardRef((props, ref) => <button type="button" {...props} ref={ref} />)`,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props on an asserted forwardRef component root',
      code: `
        const Example = React.forwardRef(
          (props, ref) => <button type="button" {...props} ref={ref} />
        ) as PolymorphicForwardRefComponent
      `,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props on a forwardRef component root using satisfies',
      code: `
        const Example = React.forwardRef(
          (props, ref) => <button type="button" {...props} ref={ref} />
        ) satisfies PolymorphicForwardRefComponent
      `,
      errors: [{messageId: 'preferMergeProps'}],
    },
    {
      name: 'reports props on a class component root',
      code: `class Example extends React.Component { render() { return <button type="button" {...this.props} /> } }`,
      errors: [{messageId: 'preferMergeProps'}],
    },
  ],
})
