'use strict'

const fs = require('node:fs')
const path = require('node:path')
const prettier = require('@prettier/sync')
const prettierConfig = require('@github/prettier-config')
const recast = require('recast')

const E2E_DIR = path.join(__dirname, '..', 'e2e', 'components')
const components = new Map([
  [
    'ActionList',
    {
      stories: [
        {
          id: 'components-actionlist--default',
          name: 'Default',
        },
        {
          id: 'components-actionlist-features--block-description',
          name: 'Block Description',
        },
        {
          id: 'components-actionlist-features--disabled-item',
          name: 'Disabled Item',
        },
        {
          id: 'components-actionlist-features--inline-description',
          name: 'Inline Description',
        },
        {
          id: 'components-actionlist-features--inside-overlay',
          name: 'Inside Overlay',
        },
        {
          id: 'components-actionlist-features--item-dividers',
          name: 'Item Dividers',
        },
        {
          id: 'components-actionlist-features--links',
          name: 'Links',
        },
        {
          id: 'components-actionlist-features--multi-select',
          name: 'Multi Select',
        },
        {
          id: 'components-actionlist-features--simple-list',
          name: 'Simple List',
        },
        {
          id: 'components-actionlist-features--single-divider',
          name: 'Single Divider',
        },
        {
          id: 'components-actionlist-features--single-select',
          name: 'Single Select',
        },
        {
          id: 'components-actionlist-features--text-wrap-and-truncation',
          name: 'Text Wrap And Truncation',
        },
        {
          id: 'components-actionlist-features--with-avatars',
          name: 'With Avatars',
        },
        {
          id: 'components-actionlist-features--with-icons',
          name: 'With Icons',
        },
        {
          id: 'components-actionlist-features--disabled-multiselect',
          name: 'Disabled Multiselect',
        },
        {
          id: 'components-actionlist-features--disabled-selected-multiselect',
          name: 'Disabled Selected Multiselect',
        },
        {
          id: 'components-actionlist-dev--group-with-filled-title-old-api',
          name: 'Group With Filled Title Old Api',
        },
        {
          id: 'components-actionlist-dev--group-with-subtle-title-old-api',
          name: 'Group With Subtle Title Old Api',
        },
        {
          id: 'components-actionlist-features--group-with-filled-title',
          name: 'Group With Filled Title',
        },
        {
          id: 'components-actionlist-features--group-with-subtle-title',
          name: 'Group With Subtle Title',
        },
        {
          id: 'components-actionlist-features--with-trailing-action',
          name: 'With Trailing Action',
        },
      ],
    },
  ],
  [
    'ActionMenu',
    {
      stories: [
        {
          id: 'components-actionmenu--default',
          name: 'Default',
        },
        {
          id: 'components-actionmenu-features--links-and-actions',
          name: 'Links And Actions',
        },
        {
          id: 'components-actionmenu-features--multi-select',
          name: 'Multi Select',
        },
        {
          id: 'components-actionmenu-features--single-select',
          name: 'Single Select',
        },
        {
          id: 'components-actionmenu-examples--controlled-menu',
          name: 'Controlled Menu',
        },
        {
          id: 'components-actionmenu-examples--custom-anchor',
          name: 'Custom Anchor',
        },
        {
          id: 'components-actionmenu-examples--custom-overlay-props',
          name: 'Custom Overlay Props',
        },
        {
          id: 'components-actionmenu-examples--groups-and-descriptions',
          name: 'Groups And Descriptions',
        },
        {
          id: 'components-actionmenu-examples--multiple-sections',
          name: 'Multiple Sections',
        },
      ],
    },
  ],
  [
    'Avatar',
    {
      stories: [
        {
          id: 'components-avatar--default',
          name: 'Default',
        },
        {
          id: 'components-avatar-features--size',
          name: 'Size',
        },
        {
          id: 'components-avatar-features--square',
          name: 'Square',
        },
      ],
    },
  ],
  [
    'AvatarStack',
    {
      stories: [
        {
          id: 'components-avatarstack--default',
          name: 'Default',
        },
        {
          id: 'components-avatarstack--playground',
          name: 'Playground',
        },
        {
          id: 'components-avatarstack-features--align-left',
          name: 'Align Left',
        },
        {
          id: 'components-avatarstack-features--align-right',
          name: 'Align Right',
        },
      ],
    },
  ],

  [
    'BranchName',
    {
      stories: [
        {
          id: 'components-branchname--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'Button',
    {
      stories: [
        {
          id: 'components-button--playground',
          name: 'Playground',
        },
        {
          id: 'components-button-features--danger',
          name: 'Danger',
        },
        {
          id: 'components-button--default',
          name: 'Default',
        },
        {
          id: 'components-button-features--disabled',
          name: 'Disabled',
        },
        {
          id: 'components-button-features--invisible',
          name: 'Invisible',
        },
        {
          id: 'components-button-features--large',
          name: 'Large',
        },
        {
          id: 'components-button-features--leading-visual',
          name: 'Leading Visual',
        },
        {
          id: 'components-button-features--medium',
          name: 'Medium',
        },
        {
          id: 'components-button-features--outline',
          name: 'Outline',
        },
        {
          id: 'components-button-features--primary',
          name: 'Primary',
        },
        {
          id: 'components-button-features--small',
          name: 'Small',
        },
        {
          id: 'components-button-features--trailing-counter',
          name: 'Trailing Counter',
        },
        {
          id: 'components-button-features--trailing-visual',
          name: 'Trailing Visual',
        },
        {
          id: 'components-button-features--trailing-counter-all-variants',
          name: 'Trailing Counter All Variants',
        },
      ],
    },
  ],
  [
    'ButtonGroup',
    {
      stories: [
        {
          id: 'components-buttongroup--default',
          name: 'Default',
        },
        {
          id: 'components-buttongroup--playground',
          name: 'Playground',
        },
        {
          id: 'components-buttongroup-features--icon-buttons',
          name: 'Icon Buttons',
        },
      ],
    },
  ],
  [
    'Breadcrumbs',
    {
      stories: [
        {
          id: 'components-breadcrumbs--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'Checkbox',
    {
      stories: [
        {
          id: 'components-checkbox--default',
          name: 'Default',
        },
        {
          id: 'components-checkbox-features--disabled',
          name: 'Disabled',
        },
        {
          id: 'components-checkbox-features--with-caption',
          name: 'With Caption',
        },
        {
          id: 'components-checkbox-features--with-leading-visual',
          name: 'With Leading Visual',
        },
      ],
    },
  ],
  [
    'CheckboxGroup',
    {
      stories: [
        {
          id: 'components-checkboxgroup--default',
          name: 'Default',
        },
        {
          id: 'components-checkboxgroup-features--caption',
          name: 'Caption',
        },
        {
          id: 'components-checkboxgroup-features--error',
          name: 'Error',
        },
        {
          id: 'components-checkboxgroup-features--success',
          name: 'Success',
        },
        {
          id: 'components-checkboxgroup-features--visually-hidden-label',
          name: 'Visually Hidden Label',
        },
      ],
    },
  ],
  [
    'CircleOcticon',
    {
      stories: [
        {
          id: 'components-circleocticon--default',
          name: 'Default',
        },
        {
          id: 'components-circleocticon--playground',
          name: 'Playground',
        },
      ],
    },
  ],
  [
    'CircleBadge',
    {
      stories: [
        {
          id: 'components-circlebadge--default',
          name: 'Default',
        },
        {
          id: 'components-circlebadge--playground',
          name: 'Playground',
        },
      ],
    },
  ],
  [
    'CounterLabel',
    {
      stories: [
        {
          id: 'components-counterlabel--default',
          name: 'Default',
        },
        {
          id: 'components-counterlabel-features--primary-theme',
          name: 'Primary Theme',
        },
      ],
    },
  ],
  [
    'DataTable',
    {
      stories: [
        {
          id: 'components-datatable--default',
          name: 'Default',
        },
        {
          id: 'components-datatable-features--with-title',
          name: 'With Title',
        },
        {
          id: 'components-datatable-features--with-title-and-subtitle',
          name: 'With Title and Subtitle',
        },
        {
          id: 'components-datatable-features--with-sorting',
          name: 'With Sorting',
        },
        {
          id: 'components-datatable-features--with-actions',
          name: 'With Actions',
        },
        {
          id: 'components-datatable-features--with-action',
          name: 'With Action',
        },
        {
          id: 'components-datatable-features--with-row-action',
          name: 'With Row Action',
        },
        {
          id: 'components-datatable-features--with-row-actions',
          name: 'With Row Actions',
        },
        {
          id: 'components-datatable-features--with-row-action-menu',
          name: 'With Row Action Menu',
        },
        {
          id: 'components-datatable-features--with-custom-heading',
          name: 'With Custom Heading',
        },
        {
          id: 'components-datatable-features--with-overflow',
          name: 'With Overflow',
        },
      ],
    },
  ],
  [
    'Details',
    {
      stories: [
        {
          id: 'components-details--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'Dialog',
    {
      stories: [
        {
          id: 'components-dialog--default',
          name: 'Default',
        },
        {
          id: 'components-dialog-features--stress-test',
          name: 'Stress Test',
        },
        {
          id: 'components-dialog-features--with-custom-renderers',
          name: 'With Custom Renderers',
        },
      ],
    },
  ],
  [
    'DialogV1',
    {
      stories: [
        {
          id: 'components-dialogv1--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'FilteredSearch',
    {
      stories: [
        {
          id: 'components-filteredsearch--default',
          name: 'Default',
        },
        {
          id: 'components-filteredsearch--playground',
          name: 'Playground',
        },
      ],
    },
  ],
  [
    'Flash',
    {
      stories: [
        {
          id: 'components-flash--default',
          name: 'Default',
        },
        {
          id: 'components-flash-features--danger',
          name: 'Danger',
        },
        {
          id: 'components-flash-features--full',
          name: 'Full',
        },
        {
          id: 'components-flash-features--success',
          name: 'Success',
        },
        {
          id: 'components-flash-features--warning',
          name: 'Warning',
        },
      ],
    },
  ],
  [
    'Header',
    {
      stories: [
        {
          id: 'components-header--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'Heading',
    {
      stories: [
        {
          id: 'components-heading--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'Hidden',
    {
      stories: [
        {
          id: 'experimental-components-hidden--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'IconButton',
    {
      stories: [
        {
          id: 'components-iconbutton--playground',
          name: 'Playground',
        },
        {
          id: 'components-iconbutton-features--danger',
          name: 'Danger',
        },
        {
          id: 'components-iconbutton--default',
          name: 'Default',
        },
        {
          id: 'components-iconbutton-features--disabled',
          name: 'Disabled',
        },
        {
          id: 'components-iconbutton-features--invisible',
          name: 'Invisible',
        },
        {
          id: 'components-iconbutton-features--large',
          name: 'Large',
        },
        {
          id: 'components-iconbutton-features--medium',
          name: 'Medium',
        },
        {
          id: 'components-iconbutton-features--primary',
          name: 'Primary',
        },
        {
          id: 'components-iconbutton-features--small',
          name: 'Small',
        },
        {
          id: 'components-iconbutton-features--keyshortcuts',
          name: 'Keyshortcuts',
        },
        {
          id: 'components-iconbutton-features--keyshortcuts-on-description',
          name: 'Keyshortcuts on Description',
        },
      ],
    },
  ],
  [
    'Label',
    {
      stories: [
        {
          id: 'components-label--default',
          name: 'Default',
          importPath: './src/Label/Label.stories.tsx',
        },
        {
          id: 'components-label--playground',
          name: 'Playground',
          importPath: './src/Label/Label.stories.tsx',
        },
        {
          id: 'components-label-features--accent',
          name: 'Accent',
        },
        {
          id: 'components-label-features--attention',
          name: 'Attention',
        },
        {
          id: 'components-label-features--danger',
          name: 'Danger',
        },
        {
          id: 'components-label-features--done',
          name: 'Done',
        },
        {
          id: 'components-label-features--primary',
          name: 'Primary',
        },
        {
          id: 'components-label-features--secondary',
          name: 'Secondary',
        },
        {
          id: 'components-label-features--severe',
          name: 'Severe',
        },
        {
          id: 'components-label-features--size-large',
          name: 'Size Large',
        },
        {
          id: 'components-label-features--size-small',
          name: 'Size Small',
        },
        {
          id: 'components-label-features--sponsors',
          name: 'Sponsors',
        },
        {
          id: 'components-label-features--success',
          name: 'Success',
        },
      ],
    },
  ],
  [
    'LabelGroup',
    {
      stories: [
        {
          id: 'components-labelgroup--default',
          name: 'Default',
        },
        {
          id: 'components-labelgroup--playground',
          name: 'Playground',
        },
      ],
    },
  ],
  [
    'Link',
    {
      stories: [
        {
          id: 'components-link--default',
          name: 'Default',
        },
        {
          id: 'components-link-features--muted',
          name: 'Muted',
        },
        {
          id: 'components-link-features--underline',
          name: 'Underline',
        },
      ],
    },
  ],
  [
    'LinkButton',
    {
      stories: [
        {
          id: 'components-linkbutton--playground',
          name: 'Playground',
        },
        {
          id: 'components-linkbutton-features--danger',
          name: 'Danger',
        },
        {
          id: 'components-linkbutton--default',
          name: 'Default',
        },
        {
          id: 'components-linkbutton-features--invisible',
          name: 'Invisible',
        },
        {
          id: 'components-linkbutton-features--large',
          name: 'Large',
        },
        {
          id: 'components-linkbutton-features--leading-visual',
          name: 'Leading Visual',
        },
        {
          id: 'components-linkbutton-features--medium',
          name: 'Medium',
        },
        {
          id: 'components-linkbutton-features--outline',
          name: 'Outline',
        },
        {
          id: 'components-linkbutton-features--primary',
          name: 'Primary',
        },
        {
          id: 'components-linkbutton-features--small',
          name: 'Small',
        },
        {
          id: 'components-linkbutton-features--trailing-visual',
          name: 'Trailing Visual',
        },
        {
          id: 'components-linkbutton-features--with-react-router',
          name: 'With React Router',
        },
      ],
    },
  ],
  [
    'NavList',
    {
      stories: [
        {
          id: 'components-navlist--simple',
          name: 'Simple',
        },
        {
          id: 'components-navlist--with-group',
          name: 'With group',
        },
        {
          id: 'components-navlist--with-group-expand',
          name: 'With group expand',
        },
        {
          id: 'components-navlist--with-trailing-action',
          name: 'With TrailingAction',
        },
        {
          id: 'components-navlist--with-trailing-action-in-sub-item',
          name: 'With TrailingAction in Sub Item',
        },
        {
          id: 'components-navlist-dev--with-bad-example-of-sub-nav-and-trailing-action',
          name: 'With Bad Example of SubNav and TrailingAction',
        },
      ],
    },
  ],
  [
    'Pagehead',
    {
      stories: [
        {
          id: 'components-pagehead--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'PageHeader',
    {
      stories: [
        {
          id: 'components-pageheader-examples--files-page',
          name: 'Files Page',
        },
        {
          id: 'components-pageheader-examples--files-page-on-narrow-viewport',
          name: 'Files Page on Narrow Viewport',
        },
        {
          id: 'components-pageheader-examples--pull-request-page',
          name: 'Pull Request Page',
        },
        {
          id: 'components-pageheader-examples--pull-request-page-on-narrow-viewport',
          name: 'Pull Request Page on Narrow Viewport',
        },
        {
          id: 'components-pageheader-examples--webhooks',
          name: 'Webhooks',
        },
        {
          id: 'components-pageheader-examples--webhooks-on-narrow-viewport',
          name: 'Webhooks on Narrow Viewport',
        },
        {
          id: 'components-pageheader-examples--with-page-layout',
          name: 'With Page Layout',
        },
        {
          id: 'components-pageheader-features--has-large-title',
          name: 'Has Large Title',
        },
        {
          id: 'components-pageheader-features--has-title-only',
          name: 'Has Title Only',
        },
        {
          id: 'components-pageheader-features--with-actions',
          name: 'With Actions',
        },
        {
          id: 'components-pageheader-features--with-actions-that-have-responsive-content',
          name: 'With Actions that have Responsive Content',
        },
        {
          id: 'components-pageheader-features--with-context-bar-and-actions-of-context-area',
          name: 'With Context Bar and Actions of Context Area',
        },
        {
          id: 'components-pageheader-features--with-custom-navigation',
          name: 'With Custom Navigation',
        },
        {
          id: 'components-pageheader-features--with-description-slot',
          name: 'With Description Slot',
        },
        {
          id: 'components-pageheader-features--with-leading-and-trailing-actions',
          name: 'With Leading and Trailing Actions',
        },
        {
          id: 'components-pageheader-features--with-leading-and-trailing-visuals',
          name: 'With Leading and Trailing Visuals',
        },
        {
          id: 'components-pageheader-features--with-leading-visual-hidden-on-regular-viewport',
          name: 'With Leading Visual Hidden on Regular Viewport',
        },
        {
          id: 'components-pageheader-features--with-navigation-slot',
          name: 'With Navigation Slot',
        },
        {
          id: 'components-pageheader-features--with-parent-link-and-actions-of-context-area',
          name: 'With Parent Link and Actions of Context Area',
        },
        {
          id: 'components-pageheader-dev--large-variant-with-multiline-title',
          name: 'Large Variant with Multiline Title',
        },
      ],
    },
  ],
  [
    'PageLayout',
    {
      stories: [
        {
          id: 'components-pagelayout--default',
          name: 'Default',
        },
        {
          id: 'components-pagelayout-features--pull-request',
          name: 'Pull Request',
        },
        {
          id: 'components-pagelayout-features--sticky-pane',
          name: 'Sticky Pane',
        },
        {
          id: 'components-pagelayout-features--nested-scroll-container',
          name: 'Nested Scroll Container',
        },
        {
          id: 'components-pagelayout-features--custom-sticky-header',
          name: 'Custom Sticky Header',
        },
        {
          id: 'components-pagelayout-features--resizable-pane',
          name: 'Resizable Pane',
        },
        {
          id: 'components-pagelayout-features--scroll-container-within-page-layout-pane',
          name: 'Scroll Container Within Page Layout Pane',
        },
      ],
    },
  ],
  [
    'Popover',
    {
      stories: [
        {
          id: 'components-popover--default',
          name: 'Default',
        },
        {
          id: 'components-popover--playground',
          name: 'Playground',
        },
      ],
    },
  ],
  [
    'ProgressBar',
    {
      stories: [
        {
          id: 'components-progressbar--default',
          name: 'Default',
        },
        {
          id: 'components-progressbar-features--progress-zero',
          name: 'Progress Zero',
        },
        {
          id: 'components-progressbar-features--progress-half',
          name: 'Progress Half',
        },
        {
          id: 'components-progressbar-features--progress-done',
          name: 'Progress Done',
        },
        {
          id: 'components-progressbar-features--size-small',
          name: 'Size Small',
        },
        {
          id: 'components-progressbar-features--size-large',
          name: 'Size Large',
        },
        {
          id: 'components-progressbar-features--inline',
          name: 'Inline',
        },
        {
          id: 'components-progressbar-features--color',
          name: 'Color',
        },
      ],
    },
  ],
  [
    'Radio',
    {
      stories: [
        {
          id: 'components-radio--default',
          name: 'Default',
        },
        {
          id: 'components-radio-features--disabled',

          name: 'Disabled',
        },
        {
          id: 'components-radio-features--with-caption',
          name: 'With Caption',
        },
        {
          id: 'components-radio-features--with-leading-visual',
          name: 'With Leading Visual',
        },
      ],
    },
  ],
  [
    'RadioGroup',
    {
      stories: [
        {
          id: 'components-radiogroup--default',
          name: 'Default',
        },
        {
          id: 'components-radiogroup-features--caption',
          name: 'Caption',
        },
        {
          id: 'components-radiogroup-features--error',
          name: 'Error',
        },
        {
          id: 'components-radiogroup-features--success',
          name: 'Success',
        },
        {
          id: 'components-radiogroup-features--visually-hidden-label',
          name: 'Visually Hidden Label',
        },
        {
          id: 'components-radiogroup-features--with-external-label',
          name: 'With External Label',
        },
      ],
    },
  ],
  [
    'Select',
    {
      stories: [
        {
          id: 'components-select--default',
          name: 'Default',
        },
        {
          id: 'components-select-features--block',
          name: 'Block',
        },
        {
          id: 'components-select-features--disabled',
          name: 'Disabled',
        },
        {
          id: 'components-select-features--error',
          name: 'Error',
        },
        {
          id: 'components-select-features--large',
          name: 'Large',
        },
        {
          id: 'components-select-features--small',
          name: 'Small',
        },
        {
          id: 'components-select-features--success',
          name: 'Success',
        },
        {
          id: 'components-select-features--visually-hidden-label',
          name: 'Visually Hidden Label',
        },
        {
          id: 'components-select-features--with-caption',
          name: 'With Caption',
        },
        {
          id: 'components-select-features--with-option-groups',
          name: 'With Option Groups',
        },
      ],
    },
  ],
  [
    'SelectPanel',
    {
      stories: [
        {
          id: 'components-selectpanel--default',
          name: 'Default',
        },
        {
          id: 'components-selectpanel-features--single-select',
          name: 'Single Select',
        },
        {
          id: 'components-selectpanel-features--with-external-anchor',
          name: 'With External Anchor',
        },
        {
          id: 'components-selectpanel-features--with-secondary-action',
          name: 'With Footer',
        },
        {
          id: 'components-selectpanel-features--with-groups',
          name: 'With Groups',
        },
        {
          id: 'components-selectpanel-features--with-item-dividers',
          name: 'With Item Dividers',
        },
        {
          id: 'components-selectpanel-features--with-placeholder-for-search-input',
          name: 'With Placeholder for Search Input',
        },
        {
          id: 'components-selectpanel-examples--above-tall-body',
          name: 'Above Tall Body',
        },
        {
          id: 'components-selectpanel-examples--height-variations-and-scroll',
          name: 'Height Variations and Scroll',
        },
        {
          id: 'components-selectpanel-examples--height-initial-with-overflowing-items-story',
          name: 'Height Initial with Overflowing Items',
        },
        {
          id: 'components-selectpanel-examples--height-initial-with-underflowing-items-story',
          name: 'Height Initial with Underflowing Items',
        },
        {
          id: 'components-selectpanel-examples--height-initial-with-underflowing-items-after-fetch',
          name: 'Height Initial with Underflowing Items After Fetch',
        },
      ],
    },
  ],
  [
    'StateLabel',
    {
      stories: [
        {
          id: 'components-statelabel-features--draft',
          name: 'Draft',
        },
        {
          id: 'components-statelabel-features--issue-closed',
          name: 'Issue Closed',
        },
        {
          id: 'components-statelabel-features--issue-closed-not-planned',
          name: 'Issue Closed Not Planned',
        },
        {
          id: 'components-statelabel-features--issue-draft',
          name: 'Issue Draft',
        },
        {
          id: 'components-statelabel-features--issue-opened',
          name: 'Issue Opened',
        },
        {
          id: 'components-statelabel-features--pull-closed',
          name: 'Pull Closed',
        },
        {
          id: 'components-statelabel-features--pull-merged',
          name: 'Pull Merged',
        },
        {
          id: 'components-statelabel-features--pull-opened',
          name: 'Pull Opened',
        },
        {
          id: 'components-statelabel-features--small',
          name: 'Small',
        },
        {
          id: 'components-statelabel-features--open',
          name: 'Open',
        },
        {
          id: 'components-statelabel-features--closed',
          name: 'Closed',
        },
      ],
    },
  ],
  [
    'Octicon',
    {
      stories: [
        {
          id: 'components-octicon--default',
          name: 'Default',
        },
        {
          id: 'components-octicon--playground',
          name: 'Playground',
        },
      ],
    },
  ],
  [
    'Text',
    {
      stories: [
        {
          id: 'components-text--default',
          name: 'Default',
        },
        {
          id: 'components-text--playground',
          name: 'Playground',
        },
      ],
    },
  ],
  [
    'Textarea',
    {
      stories: [
        {
          id: 'components-textarea--default',
          name: 'Default',
        },
        {
          id: 'components-textarea-features--block',
          name: 'Block',
        },
        {
          id: 'components-textarea-features--disabled',
          name: 'Disabled',
        },
        {
          id: 'components-textarea-features--error',
          name: 'Error',
        },
        {
          id: 'components-textarea-features--success',
          name: 'Success',
        },
        {
          id: 'components-textarea-features--visually-hidden-label',
          name: 'Visually Hidden Label',
        },
        {
          id: 'components-textarea-features--with-caption',
          name: 'With Caption',
        },
      ],
    },
  ],
  [
    'TextInput',
    {
      stories: [
        {
          id: 'components-textinput--default',
          name: 'Default',
        },
        {
          id: 'components-textinput-features--block',
          name: 'Block',
        },
        {
          id: 'components-textinput-features--disabled',
          name: 'Disabled',
        },
        {
          id: 'components-textinput-features--error',
          name: 'Error',
        },
        {
          id: 'components-textinput-features--large',
          name: 'Large',
        },
        {
          id: 'components-textinput-features--small',
          name: 'Small',
        },
        {
          id: 'components-textinput-features--success',
          name: 'Success',
        },
        {
          id: 'components-textinput-features--visually-hidden-label',
          name: 'Visually Hidden Label',
        },
        {
          id: 'components-textinput-features--with-caption',
          name: 'With Caption',
        },
        {
          id: 'components-textinput-features--with-leading-visual',
          name: 'With Leading Visual',
        },

        {
          id: 'components-textinput-features--with-trailing-action',
          name: 'With Trailing Action',
        },
        {
          id: 'components-textinput-features--with-trailing-icon',
          name: 'With Trailing Icon',
        },
      ],
    },
  ],
  [
    'TextInputWithTokens',
    {
      stories: [
        {
          id: 'components-textinputwithtokens--default',
          name: 'Default',
        },
        {
          id: 'components-textinputwithtokens-features--with-leading-visual',
          name: 'With Leading Visual',
        },
        {
          id: 'components-textinputwithtokens-features--with-trailing-visual',
          name: 'With Trailing Visual',
        },
      ],
    },
  ],
  [
    'UnderlineNav',
    {
      stories: [
        {
          id: 'components-underlinenav-examples--profile-page',
          name: 'Profile Page',
        },
        {
          id: 'components-underlinenav-examples--pull-request-page',
          name: 'Pull Request Page',
        },
        {
          id: 'components-underlinenav-examples--repos-page',
          name: 'Repos Page',
        },
        {
          id: 'components-underlinenav-features--counters-loading-state',
          name: 'Counters Loading State',
        },
        {
          id: 'components-underlinenav-features--default',
          name: 'Default',
        },
        {
          id: 'components-underlinenav-features--overflow-template',
          name: 'Overflow Template',
        },
        {
          id: 'components-underlinenav-features--with-counter-labels',
          name: 'With Counter Labels',
        },
        {
          id: 'components-underlinenav-features--with-icons',
          name: 'With Icons',
        },
      ],
    },
  ],
  [
    'TabNav',
    {
      stories: [
        {
          id: 'components-tabnav--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'Timeline',
    {
      stories: [
        {
          id: 'components-timeline--default',
          name: 'Default',
        },
        {
          id: 'components-timeline-features--clip-sidebar',
          name: 'Clip Sidebar',
        },
        {
          id: 'components-timeline-features--condensed-items',
          name: 'Condensed Items',
        },
        {
          id: 'components-timeline-features--timeline-break',
          name: 'Timeline Break',
        },
        {
          id: 'components-timeline-features--with-inline-links',
          name: 'With Inline Links',
        },
      ],
    },
  ],
  [
    'ToggleSwitch',
    {
      stories: [
        {
          id: 'components-toggleswitch--default',
          name: 'Default',
        },
        {
          id: 'components-toggleswitch-features--checked',
          name: 'Checked',
        },
        {
          id: 'components-toggleswitch-features--checked-disabled',
          name: 'Checked Disabled',
        },
        {
          id: 'components-toggleswitch-features--controlled',
          name: 'Controlled',
        },
        {
          id: 'components-toggleswitch-features--disabled',
          name: 'Disabled',
        },
        {
          id: 'components-toggleswitch-features--label-end',
          name: 'Label End',
        },
        {
          id: 'components-toggleswitch-features--loading',
          name: 'Loading',
        },
        {
          id: 'components-toggleswitch-features--small',
          name: 'Small',
        },
        {
          id: 'components-toggleswitch-features--with-caption',
          name: 'With Caption',
        },
      ],
    },
  ],
  [
    'Tooltip',
    {
      stories: [
        {
          id: 'components-tooltip--default',
          name: 'Default',
        },
      ],
    },
  ],
  [
    'TooltipV2',
    {
      stories: [
        {
          id: 'components-tooltipv2--default',
          name: 'Default',
        },
        {
          id: 'components-tooltipv2-features--anchor-has-margin',
          name: 'Anchor Has Margin',
        },
        {
          id: 'components-tooltipv2-features--calculated-direction',
          name: 'Calculated Direction',
        },
        {
          id: 'components-tooltipv2-features--icon-button-with-description',
          name: 'Icon Button With Description',
        },
        {
          id: 'components-tooltipv2-features--label-type',
          name: 'Label Type',
        },
        {
          id: 'components-tooltipv2-features--multiline-text',
          name: 'Multiline Text',
        },
        {
          id: 'components-tooltipv2-features--on-action-menu-anchor',
          name: 'On Action Menu Anchor',
        },
        {
          id: 'components-tooltipv2-examples--files-page',
          name: 'Files Page Example',
        },
      ],
    },
  ],
  [
    'TreeView',
    {
      stories: [
        {
          id: 'components-treeview--default',
          name: 'Default',
        },
        {
          id: 'components-treeview-features--empty-directories',
          name: 'Empty Directories',
        },
        {
          id: 'components-treeview-features--files',
          name: 'Files',
        },
        {
          id: 'components-treeview-features--files-changed',
          name: 'Files Changed',
        },
      ],
    },
  ],
  [
    'Truncate',
    {
      stories: [
        {
          id: 'components-truncate--default',
          name: 'Default',
        },
        {
          id: 'components-truncate--playground',
          name: 'Playground',
        },
      ],
    },
  ],
  [
    'Token',
    {
      stories: [
        {
          id: 'components-token--default',
          name: 'Default',
        },
        {
          id: 'components-token-features--small-token',
          name: 'Small Token',
        },
        {
          id: 'components-token-features--large-token',
          name: 'Large Token',
        },
        {
          id: 'components-token-features--x-large-token',
          name: 'Xlarge Token',
        },
        {
          id: 'components-token-features--token-with-leading-visual',
          name: 'Token With Leading Visual',
        },
        {
          id: 'components-token-features--token-with-on-remove-fn',
          name: 'Token With On Remove Fn',
        },
        {
          id: 'components-token-features--default-issue-label-token',
          name: 'Default Issue Label Token',
        },
        {
          id: 'components-token-features--issue-label-token-with-on-remove-fn',
          name: 'Issue Label Token With On Remove Fn',
        },
      ],
    },
  ],
  [
    'UnderlineNav--deprecated',
    {
      stories: [
        {
          id: 'deprecated-components-underlinenav--default',
          name: 'Default',
        },
        {
          id: 'deprecated-components-underlinenav--playground',
          name: 'Playground',
        },
        {
          id: 'deprecated-components-underlinenav-features--actions',
          name: 'Actions',
        },
      ],
    },
  ],
])

for (const [component, info] of components) {
  const filepath = path.join(E2E_DIR, path.format({name: `${component}.test`, ext: '.ts'}))

  if (fs.existsSync(filepath)) {
    continue
  }

  const stories = info.stories.map(story => {
    return `test.describe('${story.name}', () => {
  for (const theme of themes) {
    test.describe(theme, () => {
      test('default @vrt', async ({page}) => {
        await visit(page, {
          id: '${story.id}',
          globals: {
            colorScheme: theme
          }
        })

        // Default state
        expect(await page.screenshot()).toMatchSnapshot(\`${component}.${story.name}.\${theme}.png\`)
      })
    });
  }
})`
  })

  const source = recast.parse(`import {test, expect} from '@playwright/test'
import {visit} from '../test-helpers/storybook'
import {themes} from '../test-helpers/themes'

test.describe('${component}', () => {
  ${stories.join('\n\n')}
})`)

  const {code} = recast.print(source)
  const formatted = prettier.format(code, {
    parser: 'typescript',
    ...prettierConfig,
  })
  fs.writeFileSync(filepath, formatted, 'utf8')
}
