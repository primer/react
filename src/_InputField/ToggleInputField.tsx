import React from 'react'
import {Box, useSSRSafeId} from '..'
import {get} from '../constants'
import {Slots} from './slots'
import ToggleInputLeadingVisual from './ToggleInputLeadingVisual'
import {Props as InputFieldProps} from './InputField'
import {FormValidationStatus} from '../utils/types/FormValidationStatus'
import InputFieldCaption from './InputFieldCaption'

export interface ToggleInputFieldProps extends Pick<InputFieldProps, 'disabled' | 'id'> {
  /**
   * Styles the field to visually communicate the result of form validation
   */
  validationStatus?: FormValidationStatus
}

const ToggleInputField: React.FC<ToggleInputFieldProps> = ({children, disabled, id: idProp, validationStatus}) => {
  const id = useSSRSafeId(idProp)
  const captionChildren: React.ReactElement[] | undefined | null = React.Children.map(children, child =>
    React.isValidElement(child) && child.type === InputFieldCaption ? child : null
  )?.filter(Boolean)
  const captionId = captionChildren?.length ? `${id}-caption` : undefined

  return (
    <Slots
      context={{
        captionId,
        disabled,
        id,
        validationStatus
      }}
    >
      {slots => {
        return (
          <Box display="flex" alignItems={slots.LeadingVisual ? 'center' : undefined}>
            {children}
            <Box sx={{'> input': {marginLeft: 0, marginRight: 0}}}>{slots.Input}</Box>
            {slots.LeadingVisual && (
              <Box
                color={disabled ? 'fg.muted' : 'fg.default'}
                sx={{
                  '> *': {
                    minWidth: slots.Caption ? get('fontSizes.4') : get('fontSizes.2'),
                    minHeight: slots.Caption ? get('fontSizes.4') : get('fontSizes.2'),
                    fill: 'currentColor'
                  }
                }}
                ml={2}
              >
                {slots.LeadingVisual}
              </Box>
            )}
            {(React.isValidElement(slots.Label) && !slots.Label.props.visuallyHidden) || slots.Caption ? (
              <Box display="flex" flexDirection="column" ml={2}>
                {slots.Label}
                {slots.Caption}
              </Box>
            ) : (
              <>
                {slots.Label}
                {slots.Caption}
              </>
            )}
          </Box>
        )
      }}
    </Slots>
  )
}

export default Object.assign(ToggleInputField, {
  LeadingVisual: ToggleInputLeadingVisual
})
