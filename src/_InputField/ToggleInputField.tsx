import React from 'react'
import {Box} from '..'
import {get} from '../constants'
import {uniqueId} from '../utils/uniqueId'
import {Slots} from './slots'
import ToggleInputLeadingVisual from './ToggleInputLeadingVisual'
import {Props as InputFieldProps} from './InputField'

export interface Props extends Pick<InputFieldProps, 'disabled' | 'id'> {
  /**
   * Styles the field to visually communicate the result of form validation
   */
  validationStatus?: 'error' | 'warning' | 'success'
}

const ToggleInputField: React.FC<Props> = ({children, disabled, id, validationStatus}) => {
  const fieldId = id || uniqueId()

  return (
    <Slots
      context={{
        captionId: `${id}-caption`,
        disabled,
        id: fieldId,
        validationStatus
      }}
    >
      {slots => {
        return (
          <Box display="flex" alignItems={slots.LeadingVisual ? 'center' : undefined}>
            {children}
            <div>{slots.Input}</div>
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
