import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import primitives from '@primer/primitives'
import { TokenBaseProps, defaultTokenSize, tokenSizes } from './TokenBase'
import Token from './Token'
import { Avatar } from '..'

export interface TokenProfileProps extends TokenBaseProps {
    avatarSrc: string
}

const StyledToken = styled(Token)`
    padding-left: ${get('space.1')};
`

const TokenProfile = forwardRef<HTMLElement, TokenProfileProps>(({
    avatarSrc,
    id,
    ref,
    variant,
    ...rest
}, forwardedRef) => (
    <StyledToken
        leadingVisual={() => (
            <Avatar
                src={avatarSrc}
                size={tokenSizes[variant || defaultTokenSize] - (parseInt(primitives.spacing.normal.spacer[1], 10) * 2)}
            />
        )}
        variant={variant}
        id={id?.toString()}
        ref={forwardedRef}
        {...rest}
    />
))

export default TokenProfile
