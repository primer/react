import {clsx} from 'clsx'
import React from 'react'
import styled, {css} from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import {useFeatureFlag} from '../FeatureFlags'
import {warning} from '../utils/warning'

const Timeline = styled.div<{clipSidebar?: boolean} & SxProp>`
  display: flex;
  flex-direction: column;
  list-style: none;

  .Timeline-Group {
    padding-inline-start: 0;
    margin-block-start: 0;
    margin-block-end: 0;
  }

  ${props =>
    props.clipSidebar &&
    css`
      .Timeline-Item:first-child {
        padding-top: 0;
      }

      .Timeline-Item:last-child {
        padding-bottom: 0;
      }
    `}

  ${sx};
`

type StyledTimelineItemProps = {condensed?: boolean} & SxProp

const StyledTimelineItem = styled.div.attrs<StyledTimelineItemProps>(props => ({
  className: clsx('Timeline-Item', props.className),
}))<StyledTimelineItemProps>`
  display: flex;
  position: relative;
  padding: ${get('space.3')} 0;
  margin-left: ${get('space.3')};

  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 2px;
    content: '';
    background-color: ${get('colors.border.muted')};
  }

  ${props =>
    props.condensed &&
    css`
      padding-top: ${get('space.1')};
      padding-bottom: 0;
      &:last-child {
        padding-bottom: ${get('space.3')};
      }

      .TimelineItem-Badge {
        height: 16px;
        margin-top: ${get('space.2')};
        margin-bottom: ${get('space.2')};
        color: ${get('colors.fg.muted')};
        background-color: ${get('colors.canvas.default')};
        border: 0;
      }
    `}

  ${sx};
`

export type TimelineItemsProps<As extends React.ElementType> = {
  as?: As
} & SxProp &
  React.ComponentProps<As>

function TimelineItem<As extends React.ElementType>(props: TimelineItemsProps<As>) {
  const asList = useFeatureFlag('primer_react_timeline_as_list')
  return <StyledTimelineItem as={asList ? 'li' : 'div'} {...props} />
}

export type TimelineBadgeProps = {children?: React.ReactNode} & SxProp

const TimelineBadge = (props: TimelineBadgeProps) => {
  return (
    <Box position="relative" zIndex={1}>
      <Box
        display="flex"
        className="TimelineItem-Badge"
        flexShrink={0}
        borderRadius="50%"
        borderWidth="2px"
        borderStyle="solid"
        borderColor="canvas.default"
        overflow="hidden"
        color="fg.muted"
        bg="timeline.badgeBg"
        width="32px"
        height="32px"
        mr={2}
        ml="-15px"
        alignItems="center"
        justifyContent="center"
        sx={props.sx}
      >
        {props.children}
      </Box>
    </Box>
  )
}

const TimelineBody = styled.div<SxProp>`
  min-width: 0;
  max-width: 100%;
  margin-top: ${get('space.1')};
  color: ${get('colors.fg.muted')};
  flex: auto;
  font-size: ${get('fontSizes.1')};
  ${sx};
`

const StyledTimelineBreak = styled.div<SxProp>`
  position: relative;
  z-index: 1;
  height: 24px;
  margin: 0;
  margin-bottom: -${get('space.3')};
  margin-left: 0;
  background-color: ${get('colors.canvas.default')};
  border: 0;
  border-top: ${get('space.1')} solid ${get('colors.border.default')};
  ${sx};
`

function TimelineBreak(props: ComponentProps<typeof StyledTimelineBreak>) {
  const asList = useFeatureFlag('primer_react_timeline_as_list')
  return <StyledTimelineBreak aria-hidden={asList ? true : undefined} {...props} />
}

function TimelineGroup({children, ...props}: React.ComponentPropsWithoutRef<'ul'>) {
  const asList = useFeatureFlag('primer_react_timeline_as_list')
  warning(
    !asList,
    `Timeline.Group is only meant to be used with the timeline as list feature, you may want to turn on the 'primer_react_timeline_as_list' feature flag. Using Timeline.Group without this feature may have unintended consequences`,
  )
  return (
    <Box as={asList ? 'ul' : 'div'} className="Timeline-Group" {...props}>
      {children}
    </Box>
  )
}

TimelineGroup.displayName = 'Timeline.Group'

TimelineItem.displayName = 'Timeline.Item'

TimelineBadge.displayName = 'Timeline.Badge'

TimelineBody.displayName = 'Timeline.Body'

TimelineBreak.displayName = 'Timeline.Break'

export type TimelineProps = ComponentProps<typeof Timeline>
export type TimelineBodyProps = ComponentProps<typeof TimelineBody>
export type TimelineBreakProps = ComponentProps<typeof TimelineBreak>
export type TimelineGroupProps = ComponentProps<typeof TimelineGroup>
export default Object.assign(Timeline, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak,
  Group: TimelineGroup,
})
