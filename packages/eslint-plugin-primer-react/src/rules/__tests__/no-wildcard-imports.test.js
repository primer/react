'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-wildcard-imports')

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

ruleTester.run('no-wildcard-imports', rule, {
  valid: [`import {Button} from '@primer/react'`],
  invalid: [
    // Test unknown path from wildcard import
    {
      code: `import type {UnknownImport} from '@primer/react/lib-esm/unknown-path'`,
      errors: [
        {
          messageId: 'unknownWildcardImport',
        },
      ],
    },

    // Test type import
    {
      code: `import type {SxProp} from '@primer/react/lib-esm/sx'`,
      output: `import {type SxProp} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/sx',
          },
        },
      ],
    },

    // Test multiple type imports
    {
      code: `import type {BetterSystemStyleObject, SxProp, BetterCssProperties} from '@primer/react/lib-esm/sx'`,
      output: `import {type BetterSystemStyleObject, type SxProp, type BetterCssProperties} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/sx',
          },
        },
      ],
    },

    // Test import alias
    {
      code: `import type {SxProp as RenamedSxProp} from '@primer/react/lib-esm/sx'`,
      output: `import {type SxProp as RenamedSxProp} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/sx',
          },
        },
      ],
    },

    // Test multiple wildcard imports into single entrypoint
    {
      code: `import {useResizeObserver} from '@primer/react/lib-esm/hooks/useResizeObserver'
    import useIsomorphicLayoutEffect from '@primer/react/lib-esm/utils/useIsomorphicLayoutEffect'`,
      output: `import {useResizeObserver} from '@primer/react'
    import {useIsomorphicLayoutEffect} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/hooks/useResizeObserver',
          },
        },
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/utils/useIsomorphicLayoutEffect',
          },
        },
      ],
    },

    // Test renamed wildcard imports
    {
      code: `import type {ItemProps} from '@primer/react/lib-esm/deprecated/ActionList/Item'`,
      output: `import {type ActionListItemProps as ItemProps} from '@primer/react/deprecated'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/deprecated/ActionList/Item',
          },
        },
      ],
    },

    // Test mixed imports
    {
      code: `import {Dialog, type DialogProps} from '@primer/react/lib-esm/Dialog/Dialog'`,
      output: `import {Dialog, type DialogProps} from '@primer/react/experimental'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/Dialog/Dialog',
          },
        },
      ],
    },

    // Use existing imports
    {
      code: `import {Box, type BoxProps} from '@primer/react'
import type {BetterSystemStyleObject} from '@primer/react/lib-esm/sx'`,
      output: `import {Box, type BoxProps, type BetterSystemStyleObject} from '@primer/react'
`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/sx',
          },
        },
      ],
    },

    // Test migrations

    // Test helpers ------------------------------------------------------------
    {
      code: `import '@primer/react/lib-esm/utils/test-helpers'`,
      output: `import '@primer/react/test-helpers'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/utils/test-helpers',
          },
        },
      ],
    },

    // Components --------------------------------------------------------------
    {
      code: `import {ButtonBase} from '@primer/react/lib-esm/Button/ButtonBase';
import type {ButtonBaseProps} from '@primer/react/lib-esm/Button/ButtonBase'`,
      output: `import {ButtonBase} from '@primer/react/experimental'
import {type ButtonBaseProps} from '@primer/react/experimental'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/Button/ButtonBase',
          },
        },
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/Button/ButtonBase',
          },
        },
      ],
    },
    {
      code: `import type {ButtonBaseProps} from '@primer/react/lib-esm/Button/types'`,
      output: `import {type ButtonBaseProps} from '@primer/react/experimental'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/Button/types',
          },
        },
      ],
    },
    {
      code: `import {Dialog} from '@primer/react/lib-esm/Dialog/Dialog'`,
      output: `import {Dialog} from '@primer/react/experimental'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/Dialog/Dialog',
          },
        },
      ],
    },
    {
      code: `import {SelectPanel} from '@primer/react/lib-esm/SelectPanel/SelectPanel'`,
      output: `import {SelectPanel} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/SelectPanel/SelectPanel',
          },
        },
      ],
    },
    {
      code: `import type {SelectPanelProps} from '@primer/react/lib-esm/SelectPanel/SelectPanel'`,
      output: `import {type SelectPanelProps} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/SelectPanel/SelectPanel',
          },
        },
      ],
    },
    {
      code: `import type {LabelColorOptions} from '@primer/react/lib-esm/Label/Label'`,
      output: `import {type LabelColorOptions} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/Label/Label',
          },
        },
      ],
    },
    {
      code: `import VisuallyHidden from '@primer/react/lib-esm/_VisuallyHidden'`,
      output: `import {VisuallyHidden} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/_VisuallyHidden',
          },
        },
      ],
    },
    {
      code: `import type {IssueLabelTokenProps} from '@primer/react/lib-esm/Token/IssueLabelToken'`,
      output: `import {type IssueLabelTokenProps} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/Token/IssueLabelToken',
          },
        },
      ],
    },
    {
      code: `import type {ItemProps} from '@primer/react/lib-esm/deprecated/ActionList'`,
      output: `import {type ActionListItemProps as ItemProps} from '@primer/react/deprecated'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/deprecated/ActionList',
          },
        },
      ],
    },
    {
      code: `import type {GroupedListProps} from '@primer/react/lib-esm/deprecated/ActionList/List'`,
      output: `import {type ActionListGroupedListProps as GroupedListProps} from '@primer/react/deprecated'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/deprecated/ActionList/List',
          },
        },
      ],
    },
    {
      code: `import {ItemInput} from '@primer/react/lib-esm/deprecated/ActionList/List'`,
      output: `import {ActionListItemInput as ItemInput} from '@primer/react/deprecated'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/deprecated/ActionList/List',
          },
        },
      ],
    },

    // Hooks -------------------------------------------------------------------

    // @primer/react/lib-esm/useIsomorphicLayoutEffect
    {
      code: `import useIsomorphicLayoutEffect from '@primer/react/lib-esm/utils/useIsomorphicLayoutEffect'`,
      output: `import {useIsomorphicLayoutEffect} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/utils/useIsomorphicLayoutEffect',
          },
        },
      ],
    },

    // @primer/react/lib-esm/hooks/useResizeObserver
    {
      code: `import {useResizeObserver} from '@primer/react/lib-esm/hooks/useResizeObserver'`,
      output: `import {useResizeObserver} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/hooks/useResizeObserver',
          },
        },
      ],
    },

    // @primer/react/lib-esm/hooks/useProvidedRefOrCreate
    {
      code: `import {useProvidedRefOrCreate} from '@primer/react/lib-esm/hooks/useProvidedRefOrCreate'`,
      output: `import {useProvidedRefOrCreate} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/hooks/useProvidedRefOrCreate',
          },
        },
      ],
    },

    // @primer/react/lib-esm/hooks/useResponsiveValue
    {
      code: `import {useResponsiveValue} from '@primer/react/lib-esm/hooks/useResponsiveValue'`,
      output: `import {useResponsiveValue} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/hooks/useResponsiveValue',
          },
        },
      ],
    },
    {
      code: `import type {ResponsiveValue} from '@primer/react/lib-esm/hooks/useResponsiveValue'`,
      output: `import {type ResponsiveValue} from '@primer/react'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/hooks/useResponsiveValue',
          },
        },
      ],
    },

    // Utilities ---------------------------------------------------------------

    // @primer/react/lib-esm/FeatureFlags/DefaultFeatureFlags
    {
      code: `import {DefaultFeatureFlags} from '@primer/react/lib-esm/FeatureFlags/DefaultFeatureFlags'`,
      output: `import {DefaultFeatureFlags} from '@primer/react/experimental'`,
      errors: [
        {
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: '@primer/react/lib-esm/FeatureFlags/DefaultFeatureFlags',
          },
        },
      ],
    },
  ],
})
