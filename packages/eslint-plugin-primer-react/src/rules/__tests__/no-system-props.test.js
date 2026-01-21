const rule = require('../no-system-props')
const {RuleTester} = require('eslint')

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

ruleTester.run('no-system-props', rule, {
  valid: [
    `import {Button} from '@primer/react'; <Button sx={{width: 200}} />`,
    `import {Button} from 'coles-cool-design-system'; <Button width={200} />`,
    `import {Button} from '@primer/react'; <Button someOtherProp="foo" />`,
    `import {Box} from '@primer/react'; <Box width={200} />`,
    `import {ProgressBar} from '@primer/react'; <ProgressBar bg="howdy" />`,
    `import {Button} from '@primer/react'; <Button {...someExpression()} />`,
    `import {Button} from '@primer/react'; <Button variant="large" />`,
    `import {Button} from '@primer/react'; <Button size="large" />`,
    `import {ActionMenu} from '@primer/react'; <ActionMenu.Overlay width="large" />`,
    `import {Breadcrumbs} from '@primer/react'; <Breadcrumbs overflow="auto" />`,
    {code: `<img width="200px" />`, options: [{skipImportCheck: true}]},
    {code: `<Placeholder width="200px" />`, options: [{skipImportCheck: true, ignoreNames: ['Placeholder']}]},
    {
      code: `<Placeholder.Header width="200px" />`,
      options: [{skipImportCheck: true, ignoreNames: ['Placeholder.Header']}],
    },
  ],
  invalid: [
    {
      code: `import {Button} from '@primer/react'; <Button width={200} />`,
      output: `import {Button} from '@primer/react'; <Button  sx={{width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button width="200" />`,
      output: `import {Button} from '@primer/react'; <Button  sx={{width: "200"}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button width={"200"} />`,
      output: `import {Button} from '@primer/react'; <Button  sx={{width: "200"}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button width={myWidth} />`,
      output: `import {Button} from '@primer/react'; <Button  sx={{width: myWidth}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button width={200} height={100} />`,
      output: `import {Button} from '@primer/react'; <Button   sx={{width: 200, height: 100}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width, height', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button width={200} sx={{height: 200}} />`,
      output: `import {Button} from '@primer/react'; <Button  sx={{height: 200, width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button width={200} sx={{width: 300}} />`,
      output: `import {Button} from '@primer/react'; <Button  sx={{width: 300}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button width={200} sx={myStylez} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button width={200} sx={{...partialStyles, width: 100}} />`,
      output: `import {Button} from '@primer/react'; <Button  sx={{...partialStyles, width: 100}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Label} from '@primer/react'; <Label width={200} outline />`,
      output: `import {Label} from '@primer/react'; <Label  outline sx={{width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Label'},
        },
      ],
    },
    {
      code: `import {Box} from '@primer/react'; <Box width={200} />`,
      output: `import {Box} from '@primer/react'; <Box  sx={{width: 200}} />`,
      options: [{includeUtilityComponents: true}],
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Box'},
        },
      ],
    },
    {
      code: `import {Text} from '@primer/react'; <Text width={200} />`,
      output: `import {Text} from '@primer/react'; <Text  sx={{width: 200}} />`,
      options: [{includeUtilityComponents: true}],
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Text'},
        },
      ],
    },
    {
      code: `import {Button} from '../Button'; <Button width={200} />`,
      options: [{skipImportCheck: true}],
      output: `import {Button} from '../Button'; <Button  sx={{width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'},
        },
      ],
    },
    {
      code: `import {Foo} from '../Foo'; <Foo width={200} />`,
      options: [{skipImportCheck: true}],
      output: `import {Foo} from '../Foo'; <Foo  sx={{width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Foo'},
        },
      ],
    },
    {
      code: `import {Button} from '@primer/react'; <Button.Counter width={200} />`,
      output: `import {Button} from '@primer/react'; <Button.Counter  sx={{width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button.Counter'},
        },
      ],
    },
  ],
})
