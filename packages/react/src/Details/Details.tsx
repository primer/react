import React, {type ComponentPropsWithoutRef, type ReactElement} from 'react'
import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx from '../sx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import {clsx} from 'clsx'
import classes from './Details.module.css'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

const StyledDetails = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'details',
  styled.details<SxProp>`
    & > summary {
      list-style: none;
    }
    & > summary::-webkit-details-marker {
      display: none;
    }

    ${sx};
  `,
)

const Details = React.forwardRef<HTMLDetailsElement, DetailsProps>(
  ({className, children, ...rest}, ref): ReactElement => {
    const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
    return (
      <StyledDetails className={clsx(className, {[classes.Details]: enabled})} {...rest} ref={ref}>
        {children}
      </StyledDetails>
    )
  },
)

Details.displayName = 'Details'

export type DetailsProps = ComponentPropsWithoutRef<'details'> & SxProp
export default Details
