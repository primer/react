const rule = require('../new-color-css-vars')
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

ruleTester.run('no-color-css-vars', rule, {
  valid: [
    {
      code: `{color: 'fg.default'}`,
    },
    {
      code: `<circle style={{color: '#444'}} strokeWidth='2' />`,
    },
    {
      code: `<circle stroke='var(--borderColor-default)' strokeWidth='2' />`,
    },
    {
      code: `<circle fill='red' strokeWidth='2' />`,
    },
    {
      code: `<Blankslate border></Blankslate>`,
    },
    {
      code: `<div sx={{lineHeight: 1}}></div>`,
    },
    {
      name: 'variable with number',
      code: `
        const size = 2
        export const Fixture = <Button padding={size}>Test</Button>
      `,
    },
  ],
  invalid: [
    {
      name: 'attribute: simple variable',
      code: `<circle stroke={isSuccess ? 'var(--color-done-fg)' : 'var(--color-border-default)'} fill='var(--color-border-default)' strokeWidth='2' />`,
      output: `<circle stroke={isSuccess ? 'var(--fgColor-done)' : 'var(--borderColor-default)'} fill='var(--borderColor-default)' strokeWidth='2' />`,
      errors: [
        {
          message: 'Replace var(--color-done-fg) with var(--fgColor-done)',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
      ],
    },
    {
      name: 'attribute: conditional variable',
      code: `<circle stroke={test ? 'var(--color-border-default)' : 'red'} strokeWidth='2' />`,
      output: `<circle stroke={test ? 'var(--borderColor-default)' : 'red'} strokeWidth='2' />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
      ],
    },
    {
      name: 'sx: simple variable',
      code: `<Button sx={{color: 'var(--color-fg-muted)'}}>Test</Button>`,
      output: `<Button sx={{color: 'var(--fgColor-muted)'}}>Test</Button>`,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted)',
        },
      ],
    },
    {
      name: 'style: simple variable',
      code: `<div style={{ border: 'var(--color-border-default)' }}></div>`,
      output: `<div style={{ border: 'var(--borderColor-default)' }}></div>`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
      ],
    },
    {
      name: 'sx: nested variable',
      code: `
        <Box sx={{
          '&:hover button, &:focus [data-component="copy-link"] button': {
            color: 'var(--color-accent-fg)'
          }
        }}>
        </Box>`,
      output: `
        <Box sx={{
          '&:hover button, &:focus [data-component="copy-link"] button': {
            color: 'var(--fgColor-accent)'
          }
        }}>
        </Box>`,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent)',
        },
      ],
    },
    {
      name: 'style: nested variable',
      code: `
        <Box style={{
          '&:hover button, &:focus [data-component="copy-link"] button': {
            color: 'var(--color-accent-fg)'
          }
        }}>
        </Box>`,
      output: `
        <Box style={{
          '&:hover button, &:focus [data-component="copy-link"] button': {
            color: 'var(--fgColor-accent)'
          }
        }}>
        </Box>`,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent)',
        },
      ],
    },
    {
      name: 'value variable in scope',
      code: `
        const highlightedStyle = props.highlighted
        ? {
            borderRadius: '50%',
            boxShadow: \`0px 0px 0px 2px var(--color-accent-fg), 0px 0px 0px 4px var(--color-accent-subtle)\`,
          }
        : {}
        const bg = 'var(--color-canvas-subtle)'
        const sx = disabled ? {color: 'var(--color-primer-fg-disabled)'} : undefined
        export const Fixture = <Button bg={bg} sx={sx}>Test</Button>
      `,
      output: `
        const highlightedStyle = props.highlighted
        ? {
            borderRadius: '50%',
            boxShadow: \`0px 0px 0px 2px var(--color-accent-fg), 0px 0px 0px 4px var(--color-accent-subtle)\`,
          }
        : {}
        const bg = 'var(--bgColor-muted)'
        const sx = disabled ? {color: 'var(--fgColor-disabled)'} : undefined
        export const Fixture = <Button bg={bg} sx={sx}>Test</Button>
      `,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent)',
        },
        {
          message: 'Replace var(--color-accent-subtle) with var(--bgColor-accent-muted)',
        },
        {
          message: 'Replace var(--color-canvas-subtle) with var(--bgColor-muted)',
        },
        {
          message: 'Replace var(--color-primer-fg-disabled) with var(--fgColor-disabled)',
        },
      ],
    },
    {
      name: 'conditional with !important',
      code: `
        const extraSx = focused ? {backgroundColor: 'var(--color-canvas-subtle) !important'} : {}
      `,
      output: `
        const extraSx = focused ? {backgroundColor: 'var(--bgColor-muted) !important'} : {}
      `,
      errors: [
        {
          message: 'Replace var(--color-canvas-subtle) with var(--bgColor-muted)',
        },
      ],
    },
    {
      name: 'variable object in scope',
      code: `
        const baseStyles = { color: 'var(--color-fg-muted)' }
        export const Fixture = <Button sx={baseStyles}>Test</Button>
      `,
      output: `
        const baseStyles = { color: 'var(--fgColor-muted)' }
        export const Fixture = <Button sx={baseStyles}>Test</Button>
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted)',
        },
      ],
    },
    {
      name: 'merge in sx',
      code: `
        import {merge} from '@primer/react'
        export const Fixture = props => <Button sx={merge({color: 'var(--color-fg-muted)'}, props.sx)}>Test</Button>
      `,
      output: `
        import {merge} from '@primer/react'
        export const Fixture = props => <Button sx={merge({color: 'var(--fgColor-muted)'}, props.sx)}>Test</Button>
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted)',
        },
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted)',
        },
      ],
    },
    {
      name: 'variable in styled.component',
      code: `
        import {sx, SxProp} from '@primer/react'
        export const HighlightToken = styled.span\`
          color: var(--color-accent-emphasis);
          background-color: var(--color-canvas-default);
          \${sx}
        \`
        const ClickableTokenSpan = styled(HighlightToken)\`
          &:hover, &:focus { background-color: accent.muted;}
        \`
      `,
      errors: [
        {
          message: 'Replace var(--color-accent-emphasis) with var(--bgColor-accent-emphasis)',
        },
        {
          message: 'Replace var(--color-canvas-default) with var(--bgColor-default)',
        },
      ],
    },
    {
      name: 'variable in styled.component with conditional',
      code: `
        import {sx, SxProp} from '@primer/react'
        export const HighlightToken = styled.span\`
          color: \\\${danger ? var(--color-danger-emphasis) : var(--color-accent-emphasis)};
          \${sx}
        \`
        const ClickableTokenSpan = styled(HighlightToken)\`
          &:hover, &:focus { background-color: accent.muted;}
        \`
      `,
      errors: [
        {
          message: 'Replace var(--color-danger-emphasis) with var(--bgColor-danger-emphasis)',
        },
        {
          message: 'Replace var(--color-accent-emphasis) with var(--bgColor-accent-emphasis)',
        },
      ],
    },
    {
      name: 'sx: conditional variable',
      code: `
        import {Box} from '@primer/react'

        function someComponent({subtle}) {
          return (
            <Box
              sx={{
                boxShadow: subtle
                  ? 'inset 2px 0 0 var(--color-fg-subtle)'
                  : 'inset 2px 0 0 var(--color-attention-fg)',
                color: 'var(--fgColor-default)',
                bg: 'var(--color-canvas-default)',
                borderLeft: '1px solid var(--color-border-default)',
                borderRight: '1px solid var(--color-border-default)',
                borderTop: '2px solid var(--color-border-default)',
                borderBottom: '2px solid var(--color-border-default)',
              }}
            />
          )
        }
      `,
      output: `
        import {Box} from '@primer/react'

        function someComponent({subtle}) {
          return (
            <Box
              sx={{
                boxShadow: subtle
                  ? 'inset 2px 0 0 var(--borderColor-neutral-emphasis)'
                  : 'inset 2px 0 0 var(--bgColor-attention-emphasis)',
                color: 'var(--fgColor-default)',
                bg: 'var(--bgColor-default)',
                borderLeft: '1px solid var(--borderColor-default)',
                borderRight: '1px solid var(--borderColor-default)',
                borderTop: '2px solid var(--borderColor-default)',
                borderBottom: '2px solid var(--borderColor-default)',
              }}
            />
          )
        }
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-subtle) with var(--borderColor-neutral-emphasis)',
        },
        {
          message: 'Replace var(--color-attention-fg) with var(--bgColor-attention-emphasis)',
        },
        {
          message: 'Replace var(--color-canvas-default) with var(--bgColor-default)',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
      ],
    },
    {
      name: 'style: conditional variable',
      code: `
        import {Box} from '@primer/react'

        function someComponent({subtle}) {
          return (
            <Box
              style={{
                boxShadow: subtle
                  ? 'inset 2px 0 0 var(--color-fg-subtle)'
                  : 'inset 2px 0 0 var(--color-attention-fg)',
                color: 'var(--fgColor-default)',
                bg: 'var(--color-canvas-default)'
              }}
            />
          )
        }
      `,
      output: `
        import {Box} from '@primer/react'

        function someComponent({subtle}) {
          return (
            <Box
              style={{
                boxShadow: subtle
                  ? 'inset 2px 0 0 var(--borderColor-neutral-emphasis)'
                  : 'inset 2px 0 0 var(--bgColor-attention-emphasis)',
                color: 'var(--fgColor-default)',
                bg: 'var(--bgColor-default)'
              }}
            />
          )
        }
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-subtle) with var(--borderColor-neutral-emphasis)',
        },
        {
          message: 'Replace var(--color-attention-fg) with var(--bgColor-attention-emphasis)',
        },
        {
          message: 'Replace var(--color-canvas-default) with var(--bgColor-default)',
        },
      ],
    },
    {
      name: 'typescript object with nested cssObject',
      code: `
        const Styles = {
          table: {
            width: '100%',
            lineHeight: '100%',
          },
          thead: {
            background: 'var(--color-canvas-subtle)',
            borderBottom: '1px solid',
            borderColor: 'var(--color-border-default)',
          },
        }
      `,
      output: `
        const Styles = {
          table: {
            width: '100%',
            lineHeight: '100%',
          },
          thead: {
            background: 'var(--bgColor-muted)',
            borderBottom: '1px solid',
            borderColor: 'var(--borderColor-default)',
          },
        }
      `,
      errors: [
        {
          message: 'Replace var(--color-canvas-subtle) with var(--bgColor-muted)',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
      ],
    },
    {
      name: 'inline sx',
      code: `<Box sx={{outline: '2px solid var(--color-accent-fg)'}}>Test</Box>`,
      output: `<Box sx={{outline: '2px solid var(--focus-outlineColor)'}}>Test</Box>`,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--focus-outlineColor)',
        },
      ],
    },
    {
      name: 'inline sx with nesting',
      code: `
        <Box sx={{
          color: 'var(--color-fg-subtle)',
          '&:hover': {
            color: 'var(--color-accent-fg)',
          }
        }}>Test</Box>
      `,
      output: `
        <Box sx={{
          color: 'var(--fgColor-muted)',
          '&:hover': {
            color: 'var(--fgColor-accent)',
          }
        }}>Test</Box>
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-subtle) with var(--fgColor-muted)',
        },
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent)',
        },
      ],
    },
    {
      name: 'inside return statement',
      code: `
      const fn = () => {
        const th = {
          padding: '8px 12px',
        }

        return {
          button: {
            border: 0,
            padding: 0,
            background: 'transparent',
            color: isSelected ? 'var(--color-fg-default)' : 'var(--color-fg-muted)',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            gap: '8px',
            flexDirection: isRightAligned ? 'row-reverse' : 'row',
            justifyContent: 'flex-start',
          },
          th,
        }
      }
      `,
      output: `
      const fn = () => {
        const th = {
          padding: '8px 12px',
        }

        return {
          button: {
            border: 0,
            padding: 0,
            background: 'transparent',
            color: isSelected ? 'var(--fgColor-default)' : 'var(--fgColor-muted)',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            gap: '8px',
            flexDirection: isRightAligned ? 'row-reverse' : 'row',
            justifyContent: 'flex-start',
          },
          th,
        }
      }
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-default) with var(--fgColor-default)',
        },
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted)',
        },
      ],
    },
    {
      name: 'fn with => return',
      code: `
      const filterInputWrapperStyles = (fullyRounded = false) => ({
        display: 'flex',
        pl: 1,
        width: '100%',
        ...(fullyRounded
          ? {
              borderRadius: '5px',
              color: 'var(--color-accent-fg)',
            }
          : {
              borderTopRightRadius: '5px',
              borderBottomRightRadius: '5px',
              color: 'var(--color-accent-fg)',
            }),
        overflow: 'hidden',
        ':has(input:focus-visible)': {
          boxShadow: 'inset 0 0 0 1px var(--color-accent-emphasis)',
        },
      })
      `,
      output: `
      const filterInputWrapperStyles = (fullyRounded = false) => ({
        display: 'flex',
        pl: 1,
        width: '100%',
        ...(fullyRounded
          ? {
              borderRadius: '5px',
              color: 'var(--fgColor-accent)',
            }
          : {
              borderTopRightRadius: '5px',
              borderBottomRightRadius: '5px',
              color: 'var(--fgColor-accent)',
            }),
        overflow: 'hidden',
        ':has(input:focus-visible)': {
          boxShadow: 'inset 0 0 0 1px var(--borderColor-accent-emphasis)',
        },
      })
      `,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent)',
        },
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent)',
        },
        {
          message: 'Replace var(--color-accent-emphasis) with var(--borderColor-accent-emphasis)',
        },
      ],
    },
    {
      name: 'function called with argument',
      code: `
      export const autocompleteTheme = EditorView.baseTheme({
        '.cm-tooltip.cm-tooltip-autocomplete': {
          border: 0,
          backgroundColor: 'transparent',
        },

        '.cm-tooltip.cm-tooltip-autocomplete > ul': {
          fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
          fontSize: '12px',
          backgroundColor: 'var(--color-canvas-default)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--borderRadius-medium)',
          boxShadow: 'var(--color-shadow-medium)',
          minWidth: 'auto',
        }
      })
      `,
      output: `
      export const autocompleteTheme = EditorView.baseTheme({
        '.cm-tooltip.cm-tooltip-autocomplete': {
          border: 0,
          backgroundColor: 'transparent',
        },

        '.cm-tooltip.cm-tooltip-autocomplete > ul': {
          fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
          fontSize: '12px',
          backgroundColor: 'var(--bgColor-default)',
          border: '1px solid var(--borderColor-default)',
          borderRadius: 'var(--borderRadius-medium)',
          boxShadow: 'var(--shadow-resting-medium)',
          minWidth: 'auto',
        }
      })
      `,
      errors: [
        {
          message: 'Replace var(--color-canvas-default) with var(--bgColor-default)',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default)',
        },
        {
          message: 'Replace var(--color-shadow-medium) with var(--shadow-resting-medium)',
        },
      ],
    },
    {
      name: 'switch case',
      code: `
      const getBorderStyling = (modification) => {
        const borderStyle = '3px solid'

        switch (modification) {
          case 'ADDED':
            return {borderLeft: borderStyle, borderColor: 'var(--color-success-fg)'}
          case 'REMOVED':
            return {borderLeft: borderStyle, borderColor: 'var(--color-danger-fg)'}
          case 'EDITED':
            return {borderLeft: borderStyle, borderColor: 'var(--color-severe-fg)'}
          case 'accent':
            return {borderLeft: borderStyle, borderColor: 'var(--color-accent-fg)'}
          case 'done':
            return {borderLeft: borderStyle, borderColor: 'var(--color-done-fg)'}
          case 'closed':
            return {borderLeft: borderStyle, borderColor: 'var(--color-closed-fg)'}
          case 'sponsors':
            return {borderLeft: borderStyle, borderColor: 'var(--color-sponsors-fg)'}
          case 'UNCHANGED':
            return {}
        }
      }
      `,
      output: `
      const getBorderStyling = (modification) => {
        const borderStyle = '3px solid'

        switch (modification) {
          case 'ADDED':
            return {borderLeft: borderStyle, borderColor: 'var(--borderColor-success-emphasis)'}
          case 'REMOVED':
            return {borderLeft: borderStyle, borderColor: 'var(--borderColor-danger-emphasis)'}
          case 'EDITED':
            return {borderLeft: borderStyle, borderColor: 'var(--borderColor-severe-emphasis)'}
          case 'accent':
            return {borderLeft: borderStyle, borderColor: 'var(--borderColor-accent-emphasis)'}
          case 'done':
            return {borderLeft: borderStyle, borderColor: 'var(--borderColor-done-emphasis)'}
          case 'closed':
            return {borderLeft: borderStyle, borderColor: 'var(--borderColor-closed-emphasis)'}
          case 'sponsors':
            return {borderLeft: borderStyle, borderColor: 'var(--borderColor-sponsors-emphasis)'}
          case 'UNCHANGED':
            return {}
        }
      }
      `,
      errors: [
        {
          message: 'Replace var(--color-success-fg) with var(--borderColor-success-emphasis)',
        },
        {
          message: 'Replace var(--color-danger-fg) with var(--borderColor-danger-emphasis)',
        },
        {
          message: 'Replace var(--color-severe-fg) with var(--borderColor-severe-emphasis)',
        },
        {
          message: 'Replace var(--color-accent-fg) with var(--borderColor-accent-emphasis)',
        },
        {
          message: 'Replace var(--color-done-fg) with var(--borderColor-done-emphasis)',
        },
        {
          message: 'Replace var(--color-closed-fg) with var(--borderColor-closed-emphasis)',
        },
        {
          message: 'Replace var(--color-sponsors-fg) with var(--borderColor-sponsors-emphasis)',
        },
      ],
    },
  ],
})
