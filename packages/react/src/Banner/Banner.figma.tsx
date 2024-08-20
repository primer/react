import React from 'react'
import {Banner} from '../../src/drafts'
import figma from '@figma/code-connect'

figma.connect(Banner, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=34303-2712&m=dev', {
  props: {
    secondaryAction: figma.boolean('SecondaryAction?', {
      true: figma.instance('Secondary'),
      false: undefined,
    }),
    icon: figma.instance('Icon'),
    primaryAction: figma.boolean('PrimaryAction?', {
      true: figma.instance('Primary'),
      false: undefined,
    }),
    variant: figma.enum('Variant', {
      warning: 'warning',
      critical: 'critical',
      success: 'success',
      info: 'info',
      upsell: 'upsell',
    }),
    hideTitle: figma.boolean('Title?', {
      true: false,
      false: true,
    }),
    description: figma.textContent('Body'),
    title: figma.boolean('Title?', {
      true: figma.textContent('Title'),
      false: figma.textContent('Body'),
    }),
    dismissible: figma.boolean('Dismissible?', {
      true: '() => { /* implement dismiss functionality */ }',
      false: undefined,
    }),
  },
  example: ({dismissible, variant, icon, secondaryAction, primaryAction, description, title, hideTitle}) => (
    <Banner
      hideTitle={hideTitle}
      title={title}
      description={description}
      icon={icon}
      variant={variant}
      onDismiss={dismissible}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
    />
  ),
})
