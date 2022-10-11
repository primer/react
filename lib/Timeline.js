'use strict';

var classnames = require('classnames');
var React = require('react');
var styled = require('styled-components');
var Box = require('./Box.js');
var constants = require('./constants.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var classnames__default = /*#__PURE__*/_interopDefaultLegacy(classnames);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

const Timeline = styled__default["default"].div.withConfig({
  displayName: "Timeline",
  componentId: "sc-1u6eyef-0"
})(["display:flex;flex-direction:column;", " ", ";"], props => props.clipSidebar && styled.css([".Timeline-Item:first-child{padding-top:0;}.Timeline-Item:last-child{padding-bottom:0;}"]), sx["default"]);
const TimelineItem = styled__default["default"].div.attrs(props => ({
  className: classnames__default["default"]('Timeline-Item', props.className)
})).withConfig({
  displayName: "Timeline__TimelineItem",
  componentId: "sc-1u6eyef-1"
})(["display:flex;position:relative;padding:", " 0;margin-left:", ";&::before{position:absolute;top:0;bottom:0;left:0;display:block;width:2px;content:'';background-color:", ";}", " ", ";"], constants.get('space.3'), constants.get('space.3'), constants.get('colors.border.muted'), props => props.condensed && styled.css(["padding-top:", ";padding-bottom:0;&:last-child{padding-bottom:", ";}.TimelineItem-Badge{height:16px;margin-top:", ";margin-bottom:", ";color:", ";background-color:", ";border:0;}"], constants.get('space.1'), constants.get('space.3'), constants.get('space.2'), constants.get('space.2'), constants.get('colors.fg.muted'), constants.get('colors.canvas.default')), sx["default"]);

const TimelineBadge = props => {
  return /*#__PURE__*/React__default["default"].createElement(Box, {
    position: "relative",
    zIndex: 1
  }, /*#__PURE__*/React__default["default"].createElement(Box, {
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
const TimelineBody = styled__default["default"].div.withConfig({
  displayName: "Timeline__TimelineBody",
  componentId: "sc-1u6eyef-2"
})(["min-width:0;max-width:100%;margin-top:", ";color:", ";flex:auto;font-size:", ";", ";"], constants.get('space.1'), constants.get('colors.fg.muted'), constants.get('fontSizes.1'), sx["default"]);
const TimelineBreak = styled__default["default"].div.withConfig({
  displayName: "Timeline__TimelineBreak",
  componentId: "sc-1u6eyef-3"
})(["position:relative z-index:1;height:24px;margin:0;margin-bottom:-", ";margin-left:0;background-color:", ";border:0;border-top:", " solid ", ";", ";"], constants.get('space.3'), constants.get('colors.canvas.default'), constants.get('space.1'), constants.get('colors.border.default'), sx["default"]);
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

module.exports = Timeline$1;
