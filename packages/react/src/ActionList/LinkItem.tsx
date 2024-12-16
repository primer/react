import React from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Link from '../Link'
import type {SxProp} from '../sx'
import {merge} from '../sx'
import {Item} from './Item'
import type {ActionListItemProps} from './shared'
import Box from '../Box'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useFeatureFlag} from '../FeatureFlags'
import {actionListCssModulesFlag} from './featureflag'

// adopted from React.AnchorHTMLAttributes
type LinkProps = {
  download?: string
  href?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
  className?: string
}

// LinkItem does not support selected, loading, variants, etc.
export type ActionListLinkItemProps = Pick<
  ActionListItemProps,
  'active' | 'children' | 'sx' | 'inactiveText' | 'variant'
> &
  LinkProps

export const LinkItem = React.forwardRef(
  ({sx = defaultSxProp, active, inactiveText, variant, as: Component, className, ...props}, forwardedRef) => {
    const styles = {
      // occupy full size of Item
      paddingX: 2,
      paddingY: '6px', // custom value off the scale
      display: 'flex',
      flexGrow: 1, // full width
      borderRadius: 2,

      // inherit Item styles
      color: 'inherit',
      '&:hover': {color: 'inherit', textDecoration: 'none'},
    }

    const enabled = useFeatureFlag(actionListCssModulesFlag)

    if (enabled) {
      if (sx !== defaultSxProp) {
        return (
          <Item
            className={className}
            active={active}
            inactiveText={inactiveText}
            data-inactive={inactiveText ? true : undefined}
            variant={variant}
            _PrivateItemWrapper={({children, onClick, ...rest}) => {
              const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
                onClick && onClick(event)
                props.onClick && props.onClick(event as React.MouseEvent<HTMLAnchorElement>)
              }
              return inactiveText ? (
                <span {...rest}>{children}</span>
              ) : (
                <Link as={Component} {...rest} {...props} onClick={clickHandler} ref={forwardedRef}>
                  {children}
                </Link>
              )
            }}
          >
            {props.children}
          </Item>
        )
      }

      return (
        <Item
          className={className}
          active={active}
          inactiveText={inactiveText}
          data-inactive={inactiveText ? true : undefined}
          variant={variant}
          _PrivateItemWrapper={({children, onClick, ...rest}) => {
            const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
              onClick && onClick(event)
              props.onClick && props.onClick(event as React.MouseEvent<HTMLAnchorElement>)
            }
            return inactiveText ? (
              <span {...rest}>{children}</span>
            ) : (
              <Link as={Component} {...rest} {...props} onClick={clickHandler} ref={forwardedRef}>
                {children}
              </Link>
            )
          }}
        >
          {props.children}
        </Item>
      )
    }

    return (
      <Item
        className={className}
        active={active}
        sx={{paddingY: 0, paddingX: 0}}
        inactiveText={inactiveText}
        data-inactive={inactiveText ? true : undefined}
        _PrivateItemWrapper={({children, onClick, ...rest}) => {
          const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
            onClick && onClick(event)
            props.onClick && props.onClick(event as React.MouseEvent<HTMLAnchorElement>)
          }
          return inactiveText ? (
            <Box sx={merge(styles, sx as SxProp)} {...rest}>
              {children}
            </Box>
          ) : (
            <Link
              as={Component}
              sx={merge(styles, sx as SxProp)}
              {...rest}
              {...props}
              onClick={clickHandler}
              ref={forwardedRef}
            >
              {children}
            </Link>
          )
        }}
      >
        {props.children}
      </Item>
    )
  },
) as PolymorphicForwardRefComponent<'a', ActionListLinkItemProps>
