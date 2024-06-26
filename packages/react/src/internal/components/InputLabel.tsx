import React from 'react'
import type {FC, PropsWithChildren} from 'react'
import Box from '../../Box'
import type {SxProp} from '../../sx'
import VisuallyHidden from '../../_VisuallyHidden'

type BaseProps = SxProp & {
  disabled?: boolean
  required?: boolean
  requiredText?: string
  requiredIndicator?: boolean
  visuallyHidden?: boolean
  id?: string
}

export type LabelProps = BaseProps & {
  /** The unique identifier for the associated input */
  htmlFor?: string
  /**
   * The label element can be changed to a 'legend' when it's being used to label a fieldset, or a 'span' when it's being used to label an element that is not a form input. For example: when using a FormControl to render a labeled SegementedControl, the label should be a 'span'
   * @default label
   */
  as?: 'label'
}

export type LegendOrSpanProps = BaseProps & {
  as: 'legend' | 'span'
  htmlFor?: undefined
}

type Props = LabelProps | LegendOrSpanProps

const InputLabel: FC<PropsWithChildren<Props>> = ({
  children,
  disabled,
  htmlFor,
  id,
  required,
  requiredText,
  requiredIndicator,
  visuallyHidden,
  sx,
  as = 'label',
  ...props
}) => {
  return (
    <VisuallyHidden
      isVisible={!visuallyHidden}
      as={
        as as 'label' /* This assertion is clearly wrong, but it's the only way TS will allow the htmlFor prop to be possibly defined */
      }
      htmlFor={htmlFor}
      id={id}
      sx={{
        fontWeight: 'bold',
        fontSize: 1,
        display: 'block',
        color: disabled ? 'fg.muted' : 'fg.default',
        cursor: disabled ? 'not-allowed' : 'pointer',
        alignSelf: 'flex-start',
        ...sx,
      }}
      {...props}
    >
      {required || requiredText ? (
        <Box display="flex" as="span">
          <Box mr={1}>{children}</Box>
          <span aria-hidden={requiredIndicator ? undefined : true}>{requiredText ?? '*'}</span>
        </Box>
      ) : (
        children
      )}
    </VisuallyHidden>
  )
}

export default InputLabel
