import styled from 'styled-components'
import React, {type ComponentProps} from 'react'
import {clsx} from 'clsx'
import {get} from '../constants'
import sx, {type SxProp} from '../sx'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import classes from './Pagehead.module.css'
import {useFeatureFlag} from '../FeatureFlags'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

/**
 * @deprecated
 */
const StyledComponentPagehead = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'div',
  styled.div<SxProp>`
    position: relative;
    padding-top: ${get('space.4')};
    padding-bottom: ${get('space.4')};
    margin-bottom: ${get('space.4')};
    border-bottom: 1px solid ${get('colors.border.default')};
    ${sx};
  `,
)

const Pagehead = ({className, ...rest}: PageheadProps) => {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  if (enabled) {
    return <StyledComponentPagehead className={clsx(classes.Pagehead, className)} {...rest} />
  }

  return <StyledComponentPagehead {...rest} />
}

/**
 * @deprecated
 */
export type PageheadProps = ComponentProps<typeof StyledComponentPagehead> & SxProp
export default Pagehead
