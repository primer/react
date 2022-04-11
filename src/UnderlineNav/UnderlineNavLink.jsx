import React from 'react'
import Box from '../Box'
import {merge} from '../sx'
import {get} from '../constants'

export const UnderlineNavLink = ({
  sx: sxProp = {},
  href = '#',
  children,
  selected = false,
  leadingIcon: LeadingIcon,
  ...props
}) => {
  const linkStyles = {
    display: 'inline-flex',
    color: 'fg.default',
    textAlign: 'center',
    borderBottom: '2px solid transparent',
    borderColor: selected ? 'primer.border.active' : 'transparent',
    textDecoration: 'none',
    paddingX: get('space.2'),
    paddingY: get('space.3'),
    marginRight: get('space.3'),
    fontSize: get('fontSizes.1'),
    '&:hover, &:focus': {
      borderColor: 'neutral.muted',
      transition: '0.2s ease'
    }
  }
  const iconWrapStyles = {
    display: 'inline-block',
    marginRight: '8px'
  }
  return (
    <li>
      <Box as="a" {...props} href={href} sx={merge(linkStyles, sxProp)}>
        {LeadingIcon && (
          <Box as="span" data-component="leadingIcon" sx={iconWrapStyles}>
            <LeadingIcon />
          </Box>
        )}
        {children && <span data-component="text">{children}</span>}
      </Box>
    </li>
  )
}
