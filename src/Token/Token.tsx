import React, { forwardRef, KeyboardEventHandler, MouseEventHandler } from 'react'
import styled from 'styled-components'
import { get } from '../constants'
import TokenBase, { isTokenInteractive, TokenBaseProps } from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'

export interface TokenProps extends TokenBaseProps {
    /**
     * A function that renders a component before the token text
     */
    leadingVisual?: React.FunctionComponent<any>
    /**
     * Whether the remove button should be rendered in the token
     */
    hideRemoveButton?: boolean
}

const tokenBorderWidthPx = 1;

const DefaultTokenStyled = styled(TokenBase)<TokenProps>`
    background-color: ${get('colors.neutral.subtle')};
    border-color: ${props => props.isSelected ? get('colors.fg.default') : get('colors.border.subtle')};
    border-style: solid;
    border-width: 1px;
    color: ${props => props.isSelected ? get('colors.fg.default') : get('colors.fg.muted')};
    max-width: 100%;
    padding-right: ${props => !props.hideRemoveButton ? 0 : undefined};

    &:hover {
        background-color: ${props => isTokenInteractive(props) ? get('colors.neutral.muted') : undefined};
        box-shadow: ${props => isTokenInteractive(props) ? get('colors.shadow.medium') : undefined};
        color: ${props => isTokenInteractive(props) ? get('colors.fg.default') : undefined};
    }
`;

const TokenTextContainer = styled('span')`
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const LeadingVisualContainer = styled('span')`
    flex-shrink: 0;
    line-height: 0;
`;

const Token = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, TokenProps>((props, forwardedRef) => {
    const {
        as,
        handleRemove,
        id,
        leadingVisual: LeadingVisual,
        ref,
        text,
        variant,
        hideRemoveButton,
        ...rest
    } = props;
    const hasMultipleActionTargets = isTokenInteractive(props) && Boolean(handleRemove) && !hideRemoveButton
    const handleRemoveClick: MouseEventHandler = (e) => {
        e.stopPropagation()
        handleRemove && handleRemove()
    }

    return (
        <DefaultTokenStyled
            as={as}
            handleRemove={handleRemove}
            hideRemoveButton={hideRemoveButton || !handleRemove}
            id={id?.toString()}
            text={text}
            ref={forwardedRef}
            variant={variant}
            {...rest}
        >
            {LeadingVisual ? (
                <LeadingVisualContainer>
                    <LeadingVisual />
                </LeadingVisualContainer>
            ) : null}
            <TokenTextContainer>{text}</TokenTextContainer>
            {!hideRemoveButton && handleRemove ? (
                <RemoveTokenButton
                    borderOffset={tokenBorderWidthPx}
                    parentTokenTag={as || 'span'}
                    onClick={handleRemoveClick}
                    variant={variant}
                    parentTokenIsInteractive={isTokenInteractive(props)}
                    aria-hidden={hasMultipleActionTargets ? "true" : "false"}
                />
            ) : null}
        </DefaultTokenStyled>
    )
});

export default Token;
