const rule = require('../use-styled-react-import')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require(require.resolve('@typescript-eslint/parser', {paths: [require.resolve('eslint-plugin-github')]})),
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('use-styled-react-import', rule, {
  valid: [
    // Valid: Component used without sx prop
    `import { Button } from '@primer/react'
     const Component = () => <Button>Click me</Button>`,

    // Valid: Component with sx prop imported from styled-react
    `import { Button } from '@primer/styled-react'
     const Component = () => <Button sx={{ color: 'red' }}>Click me</Button>`,

    // Valid: Utilities imported from styled-react
    `import { sx } from '@primer/styled-react'`,
    `import { useTheme } from '@primer/styled-react'`,
    `import { sx, useTheme } from '@primer/styled-react'`,

    // Valid: Component not in the styled list
    `import { Avatar } from '@primer/react'
     const Component = () => <Avatar sx={{ color: 'red' }} />`,

    // Valid: Component not imported from @primer/react
    `import { Button } from '@github-ui/button'
     const Component = () => <Button sx={{ color: 'red' }} />`,

    // Valid: Mixed imports - component without sx prop
    `import { Button, Text } from '@primer/react'
     const Component = () => <Button>Click me</Button>`,

    // Valid: Component without sx prop imported from styled-react (when not used)
    `import { Button } from '@primer/styled-react'`,

    // Valid: allowedComponents without sx prop imported from styled-react
    `import { ThemeProvider, BaseStyles } from '@primer/styled-react'
     const Component = ({children}) => <ThemeProvider><BaseStyles>{children}</BaseStyles></ThemeProvider>`,

    // Valid: Component with sx prop AND allowedComponents
    `import { ThemeProvider, Button } from '@primer/styled-react'
     const Component = () => <ThemeProvider><Button sx={{ color: 'btn.bg'}}>Click me</Button></ThemeProvider>`,
  ],
  invalid: [
    // Invalid: Box with sx prop imported from @primer/react
    {
      code: `import { Box } from '@primer/react'
             const Component = () => <Box sx={{ color: 'red' }}>Content</Box>`,
      output: `import { Box } from '@primer/styled-react'
             const Component = () => <Box sx={{ color: 'red' }}>Content</Box>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Box'},
        },
      ],
    },

    // Invalid: Imports from /experimental and /deprecated paths
    {
      code: `import { Button } from '@primer/react/experimental'
             import { Box } from '@primer/react/deprecated'
             const Component = () => <Box sx={{ color: 'red' }}><Button sx={{ margin: 2 }}>Click me</Button></Box>`,
      output: `import { Button } from '@primer/styled-react/experimental'
             import { Box } from '@primer/styled-react/deprecated'
             const Component = () => <Box sx={{ color: 'red' }}><Button sx={{ margin: 2 }}>Click me</Button></Box>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Button'},
        },
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Box'},
        },
      ],
    },

    // Invalid: ActionList.Item with sx prop and ActionList imported from @primer/react
    {
      code: `import { ActionList } from '@primer/react'
             const Component = () => <ActionList.Item sx={{ color: 'red' }}>Content</ActionList.Item>`,
      output: `import { ActionList } from '@primer/styled-react'
             const Component = () => <ActionList.Item sx={{ color: 'red' }}>Content</ActionList.Item>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'ActionList'},
        },
      ],
    },

    // Invalid: FormControl used both with and without sx prop - should move to styled-react
    {
      code: `import { FormControl } from '@primer/react'
             const Component = () => (
               <div>
                 <FormControl></FormControl>
                 <FormControl sx={{ color: 'red' }}>
                   <FormControl.Label visuallyHidden>Label</FormControl.Label>
                 </FormControl>
               </div>
             )`,
      output: `import { FormControl } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <FormControl></FormControl>
                 <FormControl sx={{ color: 'red' }}>
                   <FormControl.Label visuallyHidden>Label</FormControl.Label>
                 </FormControl>
               </div>
             )`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'FormControl'},
        },
      ],
    },

    // Invalid: Button with sx prop imported from @primer/react
    {
      code: `import { Button } from '@primer/react'
             const Component = () => <Button sx={{ margin: 2 }}>Click me</Button>`,
      output: `import { Button } from '@primer/styled-react'
             const Component = () => <Button sx={{ margin: 2 }}>Click me</Button>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Button'},
        },
      ],
    },

    // Invalid: ActionList used without sx, ActionList.Item used with sx - should move ActionList to styled-react
    {
      code: `import { ActionList, ActionMenu } from '@primer/react'
             const Component = () => (
               <ActionMenu>
                 <ActionMenu.Overlay>
                   <ActionList>
                     <ActionList.Item sx={{ paddingLeft: 'calc(1 * var(--base-size-12))' }}>
                       Item
                     </ActionList.Item>
                   </ActionList>
                 </ActionMenu.Overlay>
               </ActionMenu>
             )`,
      output: `import { ActionMenu } from '@primer/react'
import { ActionList } from '@primer/styled-react'
             const Component = () => (
               <ActionMenu>
                 <ActionMenu.Overlay>
                   <ActionList>
                     <ActionList.Item sx={{ paddingLeft: 'calc(1 * var(--base-size-12))' }}>
                       Item
                     </ActionList.Item>
                   </ActionList>
                 </ActionMenu.Overlay>
               </ActionMenu>
             )`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'ActionList'},
        },
      ],
    },

    // Invalid: Multiple components, one with sx prop
    {
      code: `import { Button, Box, Avatar } from '@primer/react'
             const Component = () => (
               <div>
                 <Button>Regular button</Button>
                 <Box sx={{ padding: 2 }}>Styled box</Box>
                 <Avatar />
               </div>
             )`,
      output: `import { Button, Avatar } from '@primer/react'
import { Box } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <Button>Regular button</Button>
                 <Box sx={{ padding: 2 }}>Styled box</Box>
                 <Avatar />
               </div>
             )`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Box'},
        },
      ],
    },

    // Invalid: Utility import from @primer/react that should be from styled-react
    {
      code: `import { sx } from '@primer/react'`,
      output: `import { sx } from '@primer/styled-react'`,
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'sx'},
        },
      ],
    },
    {
      code: `import { useTheme } from '@primer/react'`,
      output: `import { useTheme } from '@primer/styled-react'`,
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'useTheme'},
        },
      ],
    },
    {
      code: `import { sx, useTheme } from '@primer/react'`,
      output: `import { sx, useTheme } from '@primer/styled-react'`,
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'sx'},
        },
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'useTheme'},
        },
      ],
    },

    // Invalid: Utility import from @primer/react that should be from styled-react, mixed with other imports
    {
      code: `import { sx, useAnchoredPosition } from '@primer/react'`,
      output: `import { useAnchoredPosition } from '@primer/react'
import { sx } from '@primer/styled-react'`,
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'sx'},
        },
      ],
    },

    // Invalid: Button and Link, only Button uses sx
    {
      code: `import { Button, Link } from '@primer/react'
             const Component = () => <Button sx={{ color: 'red' }}>Click me</Button>`,
      output: `import { Link } from '@primer/react'
import { Button } from '@primer/styled-react'
             const Component = () => <Button sx={{ color: 'red' }}>Click me</Button>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Button'},
        },
      ],
    },

    // Invalid: Button imported from styled-react but used without sx prop
    {
      code: `import { Button } from '@primer/styled-react'
             const Component = () => <Button>Click me</Button>`,
      output: `import { Button } from '@primer/react'
             const Component = () => <Button>Click me</Button>`,
      errors: [
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Button'},
        },
      ],
    },

    // Invalid: <Link /> and <Button /> imported from styled-react but used without sx prop
    {
      code: `import { Button } from '@primer/react'
import { Button as StyledButton, Link } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <Link />
                 <Button>Regular button</Button>
                 <StyledButton>Styled button</StyledButton>
               </div>
             )`,
      output: `import { Button, Link } from '@primer/react'

             const Component = () => (
               <div>
                 <Link />
                 <Button>Regular button</Button>
                 <StyledButton>Styled button</StyledButton>
               </div>
             )`,
      errors: [
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Button'},
        },
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Link'},
        },
      ],
    },

    // Invalid: Box imported from styled-react but used without sx prop
    {
      code: `import { Box } from '@primer/styled-react'
             const Component = () => <Box>Content</Box>`,
      output: `import { Box } from '@primer/react'
             const Component = () => <Box>Content</Box>`,
      errors: [
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Box'},
        },
      ],
    },

    // Invalid: Multiple components from styled-react, one used without sx
    {
      code: `import { Button, Box } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <Button>Regular button</Button>
                 <Box sx={{ padding: 2 }}>Styled box</Box>
               </div>
             )`,
      output: `import { Box } from '@primer/styled-react'
import { Button } from '@primer/react'
             const Component = () => (
               <div>
                 <Button>Regular button</Button>
                 <Box sx={{ padding: 2 }}>Styled box</Box>
               </div>
             )`,
      errors: [
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Button'},
        },
      ],
    },

    // Invalid: Button and Link used with sx prop - should move both to styled-react
    {
      code: `import { Button, Link } from '@primer/react'
             const Component = () => (
               <div>
                 <Link sx={{ color: 'red' }} />
                 <Button>Regular button</Button>
                 <Button sx={{ color: 'red' }}>Styled button</Button>
               </div>
             )`,
      output: `import { Link, Button } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <Link sx={{ color: 'red' }} />
                 <Button>Regular button</Button>
                 <Button sx={{ color: 'red' }}>Styled button</Button>
               </div>
             )`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Button'},
        },
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Link'},
        },
      ],
    },

    // Invalid: ThemeProvider and BaseStyles - should move to styled-react
    {
      code: `
        import { ThemeProvider, BaseStyles } from '@primer/react'
      `,
      output: `
        import { ThemeProvider, BaseStyles } from '@primer/styled-react'
      `,
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'ThemeProvider'},
        },
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'BaseStyles'},
        },
      ],
    },

    // Invalid: ThemeProvider, Button without sx prop - only ThemeProvider should be from styled-react
    {
      code: `
        import { ThemeProvider, Button } from '@primer/react'
        const Component = () => <ThemeProvider><Button>Click me</Button></ThemeProvider>
      `,
      output: `
        import { Button } from '@primer/react'
import { ThemeProvider } from '@primer/styled-react'
        const Component = () => <ThemeProvider><Button>Click me</Button></ThemeProvider>
      `,
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'ThemeProvider'},
        },
      ],
    },

    // Invalid: Utility and type imports from @primer/react that should be from styled-react
    {
      code: `import { sx, type SxProp } from '@primer/react'`,
      output: `import { sx, type SxProp } from '@primer/styled-react'`,
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'sx'},
        },
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'SxProp'},
        },
      ],
    },
  ],
})

// Test configuration options
ruleTester.run('use-styled-react-import with custom configuration', rule, {
  valid: [
    // Valid: Custom component not in default list
    {
      code: `import { CustomButton } from '@primer/react'
             const Component = () => <CustomButton sx={{ color: 'red' }}>Click me</CustomButton>`,
      options: [{}], // Using default configuration
    },

    // Valid: Custom component in custom list used without sx prop
    {
      code: `import { CustomButton } from '@primer/react'
             const Component = () => <CustomButton>Click me</CustomButton>`,
      options: [{styledComponents: ['CustomButton']}],
    },

    // Valid: Custom component with sx prop imported from styled-react
    {
      code: `import { CustomButton } from '@primer/styled-react'
             const Component = () => <CustomButton sx={{ color: 'red' }}>Click me</CustomButton>`,
      options: [{styledComponents: ['CustomButton']}],
    },

    // Valid: Box not in custom list, so sx usage is allowed from @primer/react
    {
      code: `import { Box } from '@primer/react'
             const Component = () => <Box sx={{ color: 'red' }}>Content</Box>`,
      options: [{styledComponents: ['CustomButton']}], // Box not included
    },
  ],
  invalid: [
    // Invalid: Custom component with sx prop should be from styled-react
    {
      code: `import { CustomButton } from '@primer/react'
             const Component = () => <CustomButton sx={{ color: 'red' }}>Click me</CustomButton>`,
      output: `import { CustomButton } from '@primer/styled-react'
             const Component = () => <CustomButton sx={{ color: 'red' }}>Click me</CustomButton>`,
      options: [{styledComponents: ['CustomButton']}],
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'CustomButton'},
        },
      ],
    },
    // Invalid: Custom utility should be from styled-react
    {
      code: `import { customSx } from '@primer/react'`,
      output: `import { customSx } from '@primer/styled-react'`,
      options: [{styledUtilities: ['customSx']}],
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'customSx'},
        },
      ],
    },
  ],
})
