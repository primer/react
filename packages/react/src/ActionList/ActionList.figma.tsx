import React from 'react'
import {ActionList} from '../../src'
import figma from '@figma/code-connect'

figma.connect(
  ActionList,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=27975-14901&t=m8uYul4RVKTAkjzl-4',
  {
    props: {
      children: figma.children('*'),
    },
    example: ({children}) => <ActionList>{children}</ActionList>,
  },
)

figma.connect(
  ActionList.Divider,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=6-38843&t=m8uYul4RVKTAkjzl-4',
  {
    props: {},
    example: () => <ActionList.Divider />,
  },
)

figma.connect(
  ActionList.GroupHeading,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=6-38837&m=dev',
  {
    props: {
      variant: figma.enum('variant', {
        subtle: 'subtle',
        filled: 'filled',
      }),
      title: figma.string('title'),
    },
    example: ({variant, title}) => <ActionList.GroupHeading variant={variant}>{title}</ActionList.GroupHeading>,
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-47245&m=dev',
  {
    props: {
      text: figma.nestedProps('label and description', {
        label: figma.textContent('label'),
        description: figma.textContent('description'),
      }),
      disabled: figma.enum('state', {disabled: true}),
      selected: figma.boolean('currentSelection'),
    },
    variant: {'leadingVisual?': false, 'trailingVisual?': false},
    example: ({text, disabled, selected}) => (
      <ActionList.Item variant="default" disabled={disabled} selected={selected}>
        {text.label}
      </ActionList.Item>
    ),
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-47245&m=dev',
  {
    props: {
      text: figma.nestedProps('label and description', {
        label: figma.textContent('label'),
        description: figma.textContent('description'),
      }),
      disabled: figma.enum('state', {disabled: true}),
      leadingVisual: figma.instance('leadingVisual'),
      trailingVisual: figma.instance('trailingVisual'),
    },
    variant: {'leadingVisual?': true, 'trailingVisual?': true},
    example: ({text, disabled, leadingVisual, trailingVisual}) => (
      <ActionList.Item variant="default" disabled={disabled}>
        <ActionList.LeadingVisual>{leadingVisual}</ActionList.LeadingVisual>
        {text.label}
        <ActionList.TrailingVisual>{trailingVisual}</ActionList.TrailingVisual>
      </ActionList.Item>
    ),
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-47245&m=dev',
  {
    props: {
      text: figma.nestedProps('label and description', {
        label: figma.textContent('label'),
        description: figma.textContent('description'),
      }),
      disabled: figma.enum('state', {disabled: true}),
      leadingVisual: figma.instance('leadingVisual'),
    },
    variant: {'leadingVisual?': true, 'trailingVisual?': false},
    example: ({text, disabled, leadingVisual}) => (
      <ActionList.Item variant="default" disabled={disabled}>
        <ActionList.LeadingVisual>{leadingVisual}</ActionList.LeadingVisual>
        {text.label}
      </ActionList.Item>
    ),
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15096-47245&m=dev',
  {
    props: {
      text: figma.nestedProps('label and description', {
        label: figma.textContent('label'),
        description: figma.textContent('description'),
      }),
      disabled: figma.enum('state', {disabled: true}),
      trailingVisual: figma.instance('trailingVisual'),
    },
    variant: {'leadingVisual?': false, 'trailingVisual?': true},
    example: ({text, disabled, trailingVisual}) => (
      <ActionList.Item variant="default" disabled={disabled}>
        {text.label}
        <ActionList.TrailingVisual>{trailingVisual}</ActionList.TrailingVisual>
      </ActionList.Item>
    ),
  },
)

/** DANGER ITEM */
figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56205&m=dev',
  {
    props: {
      text: figma.nestedProps('label and description', {
        label: figma.textContent('label'),
        description: figma.textContent('description'),
      }),
    },
    variant: {'leadingVisual?': false},
    example: ({text}) => <ActionList.Item variant="danger">{text.label}</ActionList.Item>,
  },
)

figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56205&m=dev',
  {
    props: {
      text: figma.nestedProps('label and description', {
        label: figma.textContent('label'),
        description: figma.textContent('description'),
      }),
      leadingVisual: figma.instance('leadingVisual'),
    },
    variant: {'leadingVisual?': true},
    example: ({text, leadingVisual}) => (
      <ActionList.Item variant="danger">
        <ActionList.LeadingVisual>{leadingVisual}</ActionList.LeadingVisual>
        {text.label}
      </ActionList.Item>
    ),
  },
)
/** Single Select ITEM */
figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56202&m=dev',
  {
    props: {
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
      }),
      selected: figma.boolean('selected?'),
      currentSelection: figma.boolean('currentSelection'),
      text: figma.nestedProps('label and description', {
        label: figma.textContent('label'),
        description: figma.textContent('description'),
      }),
      leadingVisual: figma.instance('leadingVisual'),
    },
    variant: {'leadingVisual?': true},
    example: ({text, selected, currentSelection, leadingVisual}) => (
      <ActionList.Item selected={selected} active={currentSelection} variant="default">
        <ActionList.LeadingVisual>{leadingVisual}</ActionList.LeadingVisual>
        {text.label}
      </ActionList.Item>
    ),
  },
)
figma.connect(
  ActionList.Item,
  'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=15614-56202&m=dev',
  {
    props: {
      size: figma.enum('size', {
        small: 'small',
        medium: 'medium',
        large: 'large',
      }),
      selected: figma.boolean('selected?'),
      currentSelection: figma.boolean('currentSelection'),
      text: figma.nestedProps('label and description', {
        label: figma.textContent('label'),
        description: figma.textContent('description'),
      }),
    },
    variant: {'leadingVisual?': false},
    example: ({text, selected, currentSelection}) => (
      <ActionList.Item selected={selected} active={currentSelection} variant="default">
        {text.label}
      </ActionList.Item>
    ),
  },
)
