import {Meta} from '@storybook/react'
import {StickyPane, CustomStickyHeader} from './PageLayout.stories'
import {within} from '@storybook/testing-library'
import {expect} from '@storybook/jest'

const meta: Meta = {
  title: 'Layout/PageLayout/interactions',
  // component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  argTypes: {
    // Debug controls
    'Render header?': {
      type: 'boolean',
      defaultValue: true,
      table: {category: 'Debug'}
    },
    'Render pane?': {
      type: 'boolean',
      defaultValue: true,
      table: {category: 'Debug'}
    },
    'Render footer?': {
      type: 'boolean',
      defaultValue: true,
      table: {category: 'Debug'}
    },
    'Header placeholder height': {
      type: 'number',
      defaultValue: 64,
      table: {category: 'Debug'}
    },
    'Pane placeholder height': {
      type: 'number',
      defaultValue: 200,
      table: {category: 'Debug'}
    },
    'Content placeholder height': {
      type: 'number',
      defaultValue: 400,
      table: {category: 'Debug'}
    },
    'Footer placeholder height': {
      type: 'number',
      defaultValue: 64,
      table: {category: 'Debug'}
    },

    // PageLayout prop controls
    containerWidth: {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge']
      },
      defaultValue: 'xlarge',
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    padding: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'normal',
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    rowGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'normal',
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    columnGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'normal',
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },

    // Header prop controls
    'Header.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Header props'
      }
    },
    'Header.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Header props'
      }
    },
    'Header.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Header props'
      }
    },
    'Header.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Header props'}
    },
    'Header.hidden.regular': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Header props'}
    },
    'Header.hidden.narrow': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Header props'}
    },
    'Header.hidden.wide': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Header props'}
    },

    // Content prop controls
    'Content.width': {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge']
      },
      defaultValue: 'full',
      control: {type: 'radio'},
      table: {category: 'Content props'}
    },
    'Content.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Content props'}
    },
    'Content.hidden.regular': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Content props'}
    },
    'Content.hidden.narrow': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Content props'}
    },
    'Content.hidden.wide': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Content props'}
    },

    // Pane prop controls
    'Pane.position.regular': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'end',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.position.narrow': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'end',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.position.wide': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      defaultValue: 'end',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.width': {
      type: {
        name: 'enum',
        value: ['small', 'medium', 'large']
      },
      defaultValue: 'medium',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.sticky': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Pane props'}
    },
    'Pane.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },

    // Footer prop controls
    'Footer.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Footer props'
      }
    },
    'Footer.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Footer props'
      }
    },
    'Footer.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      defaultValue: 'none',
      control: {
        type: 'radio'
      },
      table: {
        category: 'Footer props'
      }
    },
    'Footer.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      defaultValue: 'none',
      control: {type: 'radio'},
      table: {category: 'Footer props'}
    },
    'Footer.hidden.regular': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Footer props'}
    },
    'Footer.hidden.narrow': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Footer props'}
    },
    'Footer.hidden.wide': {
      type: 'boolean',
      defaultValue: false,
      table: {category: 'Footer props'}
    }
  }
}

StickyPane.argTypes = {
  sticky: {
    type: 'boolean',
    defaultValue: true
  },
  numParagraphsInPane: {
    type: 'number',
    defaultValue: 3
  },
  numParagraphsInContent: {
    type: 'number',
    defaultValue: 30
  }
}

const isInViewPort = (boundingRect: {top: number; left: number; right: number; bottom: number}) => {
  return (
    boundingRect.top >= 0 &&
    boundingRect.left >= 0 &&
    boundingRect.right <= document.documentElement.clientWidth &&
    boundingRect.bottom <= document.documentElement.clientHeight
  )
}

StickyPane.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const content3 = await canvas.getByTestId('content3')
  content3.scrollIntoView()
  const paragraph0 = await canvas.getByTestId('paragraph0')
  const paragraphRect = paragraph0.getBoundingClientRect()
  expect(isInViewPort(paragraphRect)).toBe(true)
}

const NonStickyPane = StickyPane.bind({})
NonStickyPane.argTypes = {
  sticky: {
    type: 'boolean',
    defaultValue: false
  },
  numParagraphsInPane: {
    type: 'number',
    defaultValue: 6
  },
  numParagraphsInContent: {
    type: 'number',
    defaultValue: 30
  }
}

NonStickyPane.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const content3 = await canvas.getByTestId('content3')
  content3.scrollIntoView()
  const paragraph0 = await canvas.getByTestId('paragraph0')
  const paragraphRect = paragraph0.getBoundingClientRect()
  expect(isInViewPort(paragraphRect)).toBe(false)
}

CustomStickyHeader.argTypes = {
  sticky: {
    type: 'boolean',
    defaultValue: true
  },
  stickyTop: {
    type: 'string',
    defaultValue: '8rem'
  },
  numParagraphsInPane: {
    type: 'number',
    defaultValue: 10
  },
  numParagraphsInContent: {
    type: 'number',
    defaultValue: 30
  }
}

CustomStickyHeader.play = async ({canvasElement}: {canvasElement: HTMLElement}) => {
  const canvas = within(canvasElement)
  const contentToScroll = await canvas.getByTestId('content3')
  contentToScroll.scrollIntoView()

  const stickyPaneFirstParagraph = await canvas.getByTestId('paragraph0')
  const paragraphBoundaries = stickyPaneFirstParagraph.getBoundingClientRect()
  const stickyHeader = await canvas.getByTestId('sticky-header')
  const stickyHeaderBoundaries = stickyHeader.getBoundingClientRect()
  expect(isInViewPort(paragraphBoundaries)).toBe(true)
  expect(isInViewPort(stickyHeaderBoundaries)).toBe(true)
}
export default meta
export {StickyPane, NonStickyPane, CustomStickyHeader}
