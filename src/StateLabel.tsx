import {
  GitMergeIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueDraftIcon,
  IssueOpenedIcon,
  QuestionIcon
} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'
import {variant} from 'styled-system'
import {COMMON, get, SystemCommonProps} from './constants'
import StyledOcticon from './StyledOcticon'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const octiconMap = {
  issueOpened: IssueOpenedIcon,
  pullOpened: GitPullRequestIcon,
  issueClosed: IssueClosedIcon,
  pullClosed: GitPullRequestIcon,
  pullMerged: GitMergeIcon,
  draft: GitPullRequestIcon,
  issueDraft: IssueDraftIcon
}

const colorVariants = variant({
  prop: 'status',
  variants: {
    issueClosed: {
      backgroundColor: 'danger.emphasis',
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
})

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
})

type StyledStateLabelBaseProps = {
  variant?: 'small' | 'normal'
  status?: keyof typeof octiconMap
} & SystemCommonProps &
  SxProp

const StateLabelBase = styled.span<StyledStateLabelBaseProps>`
  display: inline-flex;
  align-items: center;
  font-weight: ${get('fontWeights.bold')};
  line-height: 16px;
  color: ${get('colors.canvas.default')};
  text-align: center;
  border-radius: ${get('radii.3')};
  ${colorVariants};
  ${sizeVariants};
  ${COMMON};
  ${sx};
`

export type StateLabelProps = ComponentProps<typeof StateLabelBase>

function StateLabel({children, status, variant: variantProp, ...rest}: StateLabelProps) {
  const octiconProps = variantProp === 'small' ? {width: '1em'} : {}
  return (
    <StateLabelBase {...rest} variant={variantProp} status={status}>
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      {status && <StyledOcticon mr={1} {...octiconProps} icon={octiconMap[status] || QuestionIcon} />}
      {children}
    </StateLabelBase>
  )
}

StateLabel.defaultProps = {
  variant: 'normal'
}

export default StateLabel
