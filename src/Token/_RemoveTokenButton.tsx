import { XIcon } from '@primer/octicons-react'
import styled from 'styled-components'
import { defaultTokenSize } from "./TokenBase"
import { TokenButtonProps, tokenButtonStyles, variants, getTokenButtonIconSize } from './_tokenButtonUtils'

const RemoveTokenButton = styled.span.attrs<TokenButtonProps>(({borderOffset, parentTokenTag, variant, parentTokenIsInteractive, ...rest}) => {
    delete rest.children

    return ({
        borderOffset,
        as: parentTokenIsInteractive ? 'span' : 'button',
        tabIndex: parentTokenIsInteractive ? -1 : undefined,
        'aria-label': !parentTokenIsInteractive ? 'Remove token' : undefined,
        children: <XIcon size={getTokenButtonIconSize(variant)} />
    })
})<TokenButtonProps>`
    ${tokenButtonStyles}
    ${variants}
    transform: ${props => `translate(${props.borderOffset}px, -${props.borderOffset}px)`};
`

RemoveTokenButton.defaultProps = {
    variant: defaultTokenSize
}

export default RemoveTokenButton
