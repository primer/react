import classnames from 'classnames';
import React from 'react';
import styled, { css } from 'styled-components';
import Box from './Box.js';
import { get } from './constants.js';
import sx from './sx.js';

const Timeline = styled.div.withConfig({
  displayName: "Timeline",
  componentId: "sc-1u6eyef-0"
})(["display:flex;flex-direction:column;", " ", ";"], props => props.clipSidebar && css([".Timeline-Item:first-child{padding-top:0;}.Timeline-Item:last-child{padding-bottom:0;}"]), sx);
const TimelineItem = styled.div.attrs(props => ({
  className: classnames('Timeline-Item', props.className)
})).withConfig({
  displayName: "Timeline__TimelineItem",
  componentId: "sc-1u6eyef-1"
})(["display:flex;position:relative;padding:", " 0;margin-left:", ";&::before{position:absolute;top:0;bottom:0;left:0;display:block;width:2px;content:'';background-color:", ";}", " ", ";"], get('space.3'), get('space.3'), get('colors.border.muted'), props => props.condensed && css(["padding-top:", ";padding-bottom:0;&:last-child{padding-bottom:", ";}.TimelineItem-Badge{height:16px;margin-top:", ";margin-bottom:", ";color:", ";background-color:", ";border:0;}"], get('space.1'), get('space.3'), get('space.2'), get('space.2'), get('colors.fg.muted'), get('colors.canvas.default')), sx);

const TimelineBadge = props => {
  return /*#__PURE__*/React.createElement(Box, {
    position: "relative",
    zIndex: 1
  }, /*#__PURE__*/React.createElement(Box, {
    display: "flex",
    className: "TimelineItem-Badge",
    flexShrink: 0,
    borderRadius: "50%",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "canvas.default",
    overflow: "hidden",
    color: "fg.muted",
    bg: "timeline.badgeBg",
    width: "32px",
    height: "32px",
    mr: 2,
    ml: "-15px",
    alignItems: "center",
    justifyContent: "center",
    sx: props.sx
  }, props.children));
};

TimelineBadge.displayName = "TimelineBadge";
const TimelineBody = styled.div.withConfig({
  displayName: "Timeline__TimelineBody",
  componentId: "sc-1u6eyef-2"
})(["min-width:0;max-width:100%;margin-top:", ";color:", ";flex:auto;font-size:", ";", ";"], get('space.1'), get('colors.fg.muted'), get('fontSizes.1'), sx);
const TimelineBreak = styled.div.withConfig({
  displayName: "Timeline__TimelineBreak",
  componentId: "sc-1u6eyef-3"
})(["position:relative z-index:1;height:24px;margin:0;margin-bottom:-", ";margin-left:0;background-color:", ";border:0;border-top:", " solid ", ";", ";"], get('space.3'), get('colors.canvas.default'), get('space.1'), get('colors.border.default'), sx);
TimelineItem.displayName = 'Timeline.Item';
TimelineBadge.displayName = 'Timeline.Badge';
TimelineBody.displayName = 'Timeline.Body';
TimelineBreak.displayName = 'Timeline.Break';
var Timeline$1 = Object.assign(Timeline, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
  Break: TimelineBreak
});

export { Timeline$1 as default };
