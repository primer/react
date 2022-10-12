import {Meta} from '@storybook/react'
import {StickyPane, CustomStickyHeader} from './PageLayout.stories'
import {within} from '@storybook/testing-library'
import {expect} from '@storybook/jest'

const meta: Meta = {
  title: 'Components/PageLayout/Interactions',
  // component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  args: {
    // Debug controls
    'Render header?': true,
    'Render pane?': true,
    'Render footer?': true,
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
    'Footer.hidden.wide': false
  },
  argTypes: {
    // Debug controls
    'Render header?': {
      type: 'boolean',
      table: {category: 'Debug'}
    },
    'Render pane?': {
      type: 'boolean',
      table: {category: 'Debug'}
    },
    'Render footer?': {
      type: 'boolean',
      table: {category: 'Debug'}
    },
    'Header placeholder height': {
      type: 'number',
      table: {category: 'Debug'}
    },
    'Pane placeholder height': {
      type: 'number',
      table: {category: 'Debug'}
    },
    'Content placeholder height': {
      type: 'number',
      table: {category: 'Debug'}
    },
    'Footer placeholder height': {
      type: 'number',
      table: {category: 'Debug'}
    },

    // PageLayout prop controls
    containerWidth: {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge']
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    padding: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    rowGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },
    columnGap: {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      control: {type: 'radio'},
      table: {category: 'PageLayout props'}
    },

    // Header prop controls
    'Header.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
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
      control: {type: 'radio'},
      table: {category: 'Header props'}
    },
    'Header.hidden.regular': {
      type: 'boolean',
      table: {category: 'Header props'}
    },
    'Header.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Header props'}
    },
    'Header.hidden.wide': {
      type: 'boolean',
      table: {category: 'Header props'}
    },

    // Content prop controls
    'Content.width': {
      type: {
        name: 'enum',
        value: ['full', 'medium', 'large', 'xlarge']
      },
      control: {type: 'radio'},
      table: {category: 'Content props'}
    },
    'Content.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      control: {type: 'radio'},
      table: {category: 'Content props'}
    },
    'Content.hidden.regular': {
      type: 'boolean',
      table: {category: 'Content props'}
    },
    'Content.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Content props'}
    },
    'Content.hidden.wide': {
      type: 'boolean',
      table: {category: 'Content props'}
    },

    // Pane prop controls
    'Pane.position.regular': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.position.narrow': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.position.wide': {
      type: {
        name: 'enum',
        value: ['start', 'end']
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.width': {
      type: {
        name: 'enum',
        value: ['small', 'medium', 'large']
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.sticky': {
      type: 'boolean',
      table: {category: 'Pane props'}
    },
    'Pane.padding': {
      type: {
        name: 'enum',
        value: ['none', 'condensed', 'normal']
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.narrow': {
      type: {
        name: 'enum',
        value: ['none', 'line', 'filled']
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },
    'Pane.divider.wide': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
      control: {type: 'radio'},
      table: {category: 'Pane props'}
    },

    // Footer prop controls
    'Footer.divider.regular': {
      type: {
        name: 'enum',
        value: ['none', 'line']
      },
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
      control: {type: 'radio'},
      table: {category: 'Footer props'}
    },
    'Footer.hidden.regular': {
      type: 'boolean',
      table: {category: 'Footer props'}
    },
    'Footer.hidden.narrow': {
      type: 'boolean',
      table: {category: 'Footer props'}
    },
    'Footer.hidden.wide': {
      type: 'boolean',
      table: {category: 'Footer props'}
    }
  }
}

StickyPane.args = {
  sticky: true,
  numParagraphsInPane: 3,
  numParagraphsInContent: 30
}

StickyPane.argTypes = {
  sticky: {
    type: 'boolean'
  },
  numParagraphsInPane: {
    type: 'number'
  },
  numParagraphsInContent: {
    type: 'number'
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

NonStickyPane.args = {
  sticky: false,
  numParagraphsInPane: 6,
  numParagraphsInContent: 30
}

NonStickyPane.argTypes = {
  sticky: {
    type: 'boolean'
  },
  numParagraphsInPane: {
    type: 'number'
  },
  numParagraphsInContent: {
    type: 'number'
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

CustomStickyHeader.args = {
  sticky: true,
  offsetHeader: '8rem',
  numParagraphsInPane: 10,
  numParagraphsInContent: 30
}

CustomStickyHeader.argTypes = {
  sticky: {
    type: 'boolean'
  },
  offsetHeader: {
    type: 'string'
  },
  numParagraphsInPane: {
    type: 'number'
  },
  numParagraphsInContent: {
    type: 'number'
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
