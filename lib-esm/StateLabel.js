import { QuestionIcon, IssueOpenedIcon, GitPullRequestIcon, IssueClosedIcon, SkipIcon, GitMergeIcon, IssueDraftIcon } from '@primer/octicons-react';
import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { get } from './constants.js';
import StyledOcticon from './StyledOcticon.js';
import sx from './sx.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const octiconMap = {
  issueOpened: IssueOpenedIcon,
  pullOpened: GitPullRequestIcon,
  issueClosed: IssueClosedIcon,
  issueClosedNotPlanned: SkipIcon,
  pullClosed: GitPullRequestIcon,
  pullMerged: GitMergeIcon,
  draft: GitPullRequestIcon,
  issueDraft: IssueDraftIcon
};
const colorVariants = variant({
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
const sizeVariants = variant({
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
const StateLabelBase = styled.span.withConfig({
  displayName: "StateLabel__StateLabelBase",
  componentId: "sc-4oy091-0"
})(["display:inline-flex;align-items:center;font-weight:", ";line-height:16px;color:", ";text-align:center;border-radius:", ";", ";", ";", ";"], get('fontWeights.bold'), get('colors.canvas.default'), get('radii.3'), colorVariants, sizeVariants, sx);

function StateLabel({
  children,
  status,
  variant: variantProp,
  ...rest
}) {
  const octiconProps = variantProp === 'small' ? {
    width: '1em'
  } : {};
  return /*#__PURE__*/React.createElement(StateLabelBase, _extends({}, rest, {
    variant: variantProp,
    status: status
  }), status && /*#__PURE__*/React.createElement(StyledOcticon, _extends({}, octiconProps, {
    icon: octiconMap[status] || QuestionIcon,
    sx: {
      mr: 1
    }
  })), children);
}

StateLabel.displayName = "StateLabel";
StateLabel.defaultProps = {
  variant: 'normal'
};

export { StateLabel as default };
