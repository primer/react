import {IconProps} from '@primer/octicons-react'
import React, {forwardRef, MouseEventHandler} from 'react'
import {Box, Tooltip} from '.'
import {Button, ButtonProps, IconButton} from './Button2'
import {SxProp} from './sx'

type TextInputActionProps = Omit<React.HTMLProps<HTMLButtonElement>, 'onClick' | 'children' | 'size'> & {
  children?: React.ReactNode
  onClick: MouseEventHandler
  icon?: React.FunctionComponent<IconProps>
  iconLabel?: string
  tooltipMessage?: string
  variant?: ButtonProps['variant']
} & SxProp

const buttonStyleOverrides = {
  color: 'fg.default'
}

// TODO: modify this to _just_ render out a tooltip. No need for `wrapper`
const ConditionalWrapper: React.FC<{
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactNode
}> = ({condition, wrapper, children}) => <>{condition ? wrapper(children) : children}</>

const TextInputAction = forwardRef<HTMLButtonElement, TextInputActionProps>(
  ({children, icon, iconLabel, sx: sxProp, tooltipMessage, variant, ...rest}, forwardedRef) => {
    const sx = {
      ...buttonStyleOverrides,
      ...sxProp
    }

    if (icon && !iconLabel) {
      console.warn('Use the `iconLabel` prop to provide an accessible label for assistive technology')
    }

    return (
      <Box as="span" className="TextInput-action">
        <ConditionalWrapper
          condition={Boolean(tooltipMessage)}
          wrapper={tooltipLabel => <Tooltip aria-label={tooltipMessage}>{tooltipLabel}</Tooltip>}
        >
          {icon && iconLabel ? (
            <IconButton
              variant={variant}
              type="button"
              icon={icon}
              iconLabel={iconLabel}
              sx={sx}
              {...rest}
              ref={forwardedRef}
            />
          ) : (
            <Button variant={variant} size="small" type="button" sx={sx} {...rest} ref={forwardedRef}>
              {children}
            </Button>
          )}
        </ConditionalWrapper>
      </Box>
    )
  }
)

TextInputAction.defaultProps = {
  variant: 'invisible'
}

export default TextInputAction
