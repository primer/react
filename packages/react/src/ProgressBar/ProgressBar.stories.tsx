import React, {useEffect} from 'react'
import type {Meta} from '@storybook/react-vite'
import {ProgressBar, type ProgressBarProps} from '..'

const sectionColorsDefault = [
  'success.emphasis',
  'accent.emphasis',
  'done.emphasis',
  'severe.emphasis',
  'danger.emphasis',
  'attention.emphasis',
]

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
} as Meta<typeof ProgressBar>

export const Default = () => <ProgressBar aria-label="Upload test.png" />

export const Playground = ({sections, ...args}: ProgressBarProps & {sections: number}) => {
  const [sectionColors, setSectionColors] = React.useState(sectionColorsDefault)

  useEffect(() => {
    if (args.bg && args.bg !== '') {
      setSectionColors([args.bg, ...sectionColorsDefault])
    }
  }, [args.bg])

  if (sections === 1) {
    return <ProgressBar {...args} style={{...(args.inline ? {width: '100px'} : {})}} aria-label="Upload test.png" />
  } else {
    return (
      <ProgressBar aria-label="Upload test.png">
        {[...Array(sections).keys()].map(i => (
          <ProgressBar.Item key={i} progress={100 / sections} bg={sectionColors[i]} />
        ))}
      </ProgressBar>
    )
  }
}

Playground.args = {
  progress: 66,
  barSize: 'default',
  inline: false,
  bg: 'success.emphasis',
  sections: 1,
}

Playground.argTypes = {
  progress: {
    control: {
      type: 'number',
    },
  },
  barSize: {
    control: {
      type: 'radio',
    },
    options: ['small', 'default', 'large'],
  },
  inline: {
    control: {
      type: 'boolean',
    },
  },
  sections: {
    control: {
      type: 'number',
      min: 1,
      max: 5,
      step: 1,
    },
  },
}
