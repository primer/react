'use strict';

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('./constants.js');
var StyledOcticon = require('./StyledOcticon.js');
var sx = require('./sx.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const octiconMap = {
  issueOpened: octiconsReact.IssueOpenedIcon,
  pullOpened: octiconsReact.GitPullRequestIcon,
  issueClosed: octiconsReact.IssueClosedIcon,
  issueClosedNotPlanned: octiconsReact.SkipIcon,
  pullClosed: octiconsReact.GitPullRequestIcon,
  pullMerged: octiconsReact.GitMergeIcon,
  draft: octiconsReact.GitPullRequestIcon,
  issueDraft: octiconsReact.IssueDraftIcon
};
const colorVariants = styledSystem.variant({
  prop: 'status',
  variants: {
    issueClosed: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis'
    },
    issueClosedNotPlanned: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis'
    },
    pullClosed: {
      backgroundColor: 'danger.emphasis',
      color: 'fg.onEmphasis'
    },
    pullMerged: {
      backgroundColor: 'done.emphasis',
      color: 'fg.onEmphasis'
    },
    issueOpened: {
      backgroundColor: 'success.emphasis',
      color: 'fg.onEmphasis'
    },
    pullOpened: {
      backgroundColor: 'success.emphasis',
      color: 'fg.onEmphasis'
    },
    draft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis'
    },
    issueDraft: {
      backgroundColor: 'neutral.emphasis',
      color: 'fg.onEmphasis'
    }
  }
});
const sizeVariants = styledSystem.variant({
  prop: 'variant',
  variants: {
    small: {
      paddingX: 2,
      paddingY: 1,
      fontSize: 0
    },
    normal: {
      paddingX: '12px',
      paddingY: 2,
      fontSize: 1
    }
  }
});
const StateLabelBase = styled__default["default"].span.withConfig({
  displayName: "StateLabel__StateLabelBase",
  componentId: "sc-4oy091-0"
})(["display:inline-flex;align-items:center;font-weight:", ";line-height:16px;color:", ";text-align:center;border-radius:", ";", ";", ";", ";"], constants.get('fontWeights.bold'), constants.get('colors.canvas.default'), constants.get('radii.3'), colorVariants, sizeVariants, sx["default"]);

function StateLabel({
  children,
  status,
  variant: variantProp,
  ...rest
}) {
  const octiconProps = variantProp === 'small' ? {
    width: '1em'
  } : {};
  return /*#__PURE__*/React__default["default"].createElement(StateLabelBase, _extends({}, rest, {
    variant: variantProp,
    status: status
  }), status && /*#__PURE__*/React__default["default"].createElement(StyledOcticon, _extends({}, octiconProps, {
    icon: octiconMap[status] || octiconsReact.QuestionIcon,
    sx: {
      mr: 1
    }
  })), children);
}

StateLabel.displayName = "StateLabel";
StateLabel.defaultProps = {
  variant: 'normal'
};

module.exports = StateLabel;
