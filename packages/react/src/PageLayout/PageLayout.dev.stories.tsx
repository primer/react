import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {Placeholder} from '../Placeholder'
import {PageLayout} from './PageLayout'
import {usePaneWidth, updateAriaValues} from './usePaneWidth'
import {DragHandle} from './DragHandle'
import classes from './PageLayout.dev.stories.module.css'

const meta: Meta = {
  title: 'Components/PageLayout/Dev',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {
    // Debug controls
    'Header placeholder height': 64,
    'Pane placeholder height': 200,
    'Content placeholder height': 400,
    'Footer placeholder height': 64,
    containerWidth: 'xlarge',
    padding: 'normal',
    rowGap: 'normal',
    columnGap: 'normal',
    'Header.divider.regular': 'none',
    'Header.divider.narrow': 'none',
    'Header.divider.wide': 'none',
    'Header.padding': 'none',
    'Header.hidden.regular': false,
    'Header.hidden.narrow': false,
    'Header.hidden.wide': false,
    'Content.width': 'full',
    'Content.padding': 'none',
    'Content.hidden.regular': false,
    'Content.hidden.narrow': false,
    'Content.hidden.wide': false,
    'Pane.position.regular': 'end',
    'Pane.position.narrow': 'end',
    'Pane.position.wide': 'end',
    'Pane.width': 'medium',
    'Pane.sticky': false,
    'Pane.resizable': false,
    'Pane.padding': 'none',
    'Pane.divider.regular': 'none',
    'Pane.divider.narrow': 'none',
    'Pane.divider.wide': 'none',
    'Footer.divider.regular': 'none',
    'Footer.divider.narrow': 'none',
    'Footer.divider.wide': 'none',
    'Footer.padding': 'none',
    'Footer.hidden.regular': false,
    'Footer.hidden.narrow': false,
    'Footer.hidden.wide': false,
  },
  argTypes: {
    // Debug controls
    'Render header?': {
      type: 'boolean',
      table: {category: 'Debug'},
    },
    'Render pane?': {
      type: 'boolean',
      table: {category: 'Debug'},
    },
    'Render footer?': {
      type: 'boolean',
      table: {category: 'Debug'},
    },
    'Header placeholder height': {
      type: 'number',
      table: {category: 'Debug'},
    },
    'Pane placeholder height': {
      type: 'number',
      table: {category: 'Debug'},
    },
    'Content placeholder height': {
      type: 'number',
      table: {category: 'Debug'},
    },
    'Footer placeholder height': {
      type: 'number',
      table: {category: 'Debug'},
    },

    // PageLayout prop controls
    containerWidth: {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge'],
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'},
    },
    padding: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'},
    },
    rowGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'},
    },
    columnGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'},
    },

    // Header prop controls
    'Header.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Header props',
      },
    },
    'Header.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Header props',
      },
    },
    'Header.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Header props',
      },
    },
    'Header.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'Header props'},
    },
    'Header.hidden.regular': {
      type: 'boolean',
      table: {category: 'Header props'},
    },
    'Header.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Header props'},
    },
    'Header.hidden.wide': {
      type: 'boolean',
      table: {category: 'Header props'},
    },

    // Content prop controls
    'Content.width': {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge'],
      },
      control: {type: 'radio'},
      table: {category: 'Content props'},
    },
    'Content.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'Content props'},
    },
    'Content.hidden.regular': {
      type: 'boolean',
      table: {category: 'Content props'},
    },
    'Content.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Content props'},
    },
    'Content.hidden.wide': {
      type: 'boolean',
      table: {category: 'Content props'},
    },

    // Pane prop controls
    'Pane.position.regular': {
      type: {
        name: 'enum',
        value: ['start', 'end'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.position.narrow': {
      type: {
        name: 'enum',
        value: ['start', 'end'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.position.wide': {
      type: {
        name: 'enum',
        value: ['start', 'end'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.width': {
      type: {
        name: 'enum',
        value: ['small', 'medium', 'large'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.minWidth': {
      type: 'number',
      defaultValue: 256,
      table: {category: 'Pane props'},
    },
    'Pane.sticky': {
      type: 'boolean',
      table: {category: 'Pane props'},
    },
    'Pane.resizable': {
      type: 'boolean',
      table: {category: 'Pane props'},
    },
    'Pane.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },
    'Pane.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'},
    },

    // Footer prop controls
    'Footer.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Footer props',
      },
    },
    'Footer.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Footer props',
      },
    },
    'Footer.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line'],
      },
      control: {
        type: 'radio',
      },
      table: {
        category: 'Footer props',
      },
    },
    'Footer.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal'],
      },
      control: {type: 'radio'},
      table: {category: 'Footer props'},
    },
    'Footer.hidden.regular': {
      type: 'boolean',
      table: {category: 'Footer props'},
    },
    'Footer.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Footer props'},
    },
    'Footer.hidden.wide': {
      type: 'boolean',
      table: {category: 'Footer props'},
    },
  },
}

export const Default: StoryFn = args => (
  <PageLayout
    containerWidth={args.containerWidth}
    padding={args.padding}
    rowGap={args.rowGap}
    columnGap={args.columnGap}
    className={classes.DebugPageLayout}
  >
    <PageLayout.Header
      padding={args['Header.padding']}
      className={classes.SuccessColor}
      divider={{
        narrow: args['Header.divider.narrow'],
        regular: args['Header.divider.regular'],
        wide: args['Header.divider.wide'],
      }}
      hidden={{
        narrow: args['Header.hidden.narrow'],
        regular: args['Header.hidden.regular'],
        wide: args['Header.hidden.wide'],
      }}
    >
      <Placeholder height={args['Header placeholder height']} label="Header" />
    </PageLayout.Header>
    <PageLayout.Content
      className={classes.SuccessColor}
      width={args['Content.width']}
      padding={args['Content.padding']}
      hidden={{
        narrow: args['Content.hidden.narrow'],
        regular: args['Content.hidden.regular'],
        wide: args['Content.hidden.wide'],
      }}
    >
      <Placeholder height={args['Content placeholder height']} label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane
      className={classes.SuccessColor}
      position={{
        narrow: args['Pane.position.narrow'],
        regular: args['Pane.position.regular'],
        wide: args['Pane.position.wide'],
      }}
      width={args['Pane.width']}
      minWidth={args['Pane.minWidth']}
      sticky={args['Pane.sticky']}
      resizable={args['Pane.resizable']}
      padding={args['Pane.padding']}
      divider={{
        narrow: args['Pane.divider.narrow'],
        regular: args['Pane.divider.regular'],
        wide: args['Pane.divider.wide'],
      }}
      hidden={{
        narrow: args['Pane.hidden.narrow'],
        regular: args['Pane.hidden.regular'],
        wide: args['Pane.hidden.wide'],
      }}
    >
      <Placeholder height={args['Pane placeholder height']} label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Footer
      className={classes.SuccessColor}
      padding={args['Footer.padding']}
      divider={{
        narrow: args['Footer.divider.narrow'],
        regular: args['Footer.divider.regular'],
        wide: args['Footer.divider.wide'],
      }}
      hidden={{
        narrow: args['Footer.hidden.narrow'],
        regular: args['Footer.hidden.regular'],
        wide: args['Footer.hidden.wide'],
      }}
    >
      <Placeholder height={args['Footer placeholder height']} label="Footer" />
    </PageLayout.Footer>
  </PageLayout>
)

const formatValueText = (n: number) => `Panel width ${n} pixels`

function StandaloneResizablePanel() {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const handleRef = React.useRef<HTMLDivElement>(null)

  // Cache drag-start values so width math is immune to layout shifts mid-drag.
  const dragStartClientXRef = React.useRef(0)
  const dragStartWidthRef = React.useRef(0)
  const dragMaxWidthRef = React.useRef(0)

  const {currentWidth, currentWidthRef, minPaneWidth, maxPaneWidth, getMaxPaneWidth, saveWidth, getDefaultWidth} =
    usePaneWidth({
      width: {min: '160px', default: '260px', max: '480px'},
      minWidth: 160,
      resizable: true,
      // Persist across reloads with localStorage (default behavior).
      widthStorageKey: 'dev-standalone-panel-width',
      paneRef: panelRef,
      handleRef,
    })

  const handleDragStart = React.useCallback(
    (clientX: number) => {
      dragStartClientXRef.current = clientX
      dragStartWidthRef.current = panelRef.current?.getBoundingClientRect().width ?? currentWidthRef.current
      dragMaxWidthRef.current = getMaxPaneWidth()
    },
    [currentWidthRef, getMaxPaneWidth],
  )

  const handleDrag = React.useCallback(
    (value: number, isKeyboard: boolean) => {
      const maxWidth = isKeyboard ? getMaxPaneWidth() : dragMaxWidthRef.current
      // Panel is docked on the left, so a larger width extends to the right.
      const newWidth = isKeyboard
        ? currentWidthRef.current + value
        : dragStartWidthRef.current + (value - dragStartClientXRef.current)
      const clamped = Math.max(minPaneWidth, Math.min(maxWidth, newWidth))
      if (Math.round(clamped) !== Math.round(currentWidthRef.current)) {
        currentWidthRef.current = clamped
        panelRef.current?.style.setProperty('--pane-width', `${clamped}px`)
        updateAriaValues(handleRef.current, {current: Math.round(clamped), max: maxWidth}, formatValueText)
      }
    },
    [currentWidthRef, getMaxPaneWidth, minPaneWidth],
  )

  const handleDragEnd = React.useCallback(() => {
    saveWidth(currentWidthRef.current)
  }, [currentWidthRef, saveWidth])

  const handleDoubleClick = React.useCallback(() => {
    const resetWidth = getDefaultWidth()
    currentWidthRef.current = resetWidth
    panelRef.current?.style.setProperty('--pane-width', `${resetWidth}px`)
    updateAriaValues(handleRef.current, {current: resetWidth}, formatValueText)
    saveWidth(resetWidth)
  }, [currentWidthRef, getDefaultWidth, saveWidth])

  return (
    <div className={classes.StandaloneContainer}>
      <div
        ref={panelRef}
        className={classes.StandalonePanel}
        style={
          {
            '--pane-width': `${currentWidth}px`,
          } as React.CSSProperties
        }
      >
        Drag the right edge, use arrow keys, or double-click to reset.
        <div className={classes.StandaloneHandleBar}>
          <DragHandle
            handleRef={handleRef}
            dragTargetRef={panelRef}
            data-component="StandaloneResizablePanel.DragHandle"
            aria-valuemin={minPaneWidth}
            aria-valuemax={maxPaneWidth}
            aria-valuenow={currentWidth}
            formatValueText={formatValueText}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onDoubleClick={handleDoubleClick}
          />
        </div>
      </div>
      <div className={classes.StandaloneContent}>
        <Placeholder height={228} label="Main content" />
      </div>
    </div>
  )
}

export const StandaloneResize: StoryFn = () => <StandaloneResizablePanel />

export default meta
