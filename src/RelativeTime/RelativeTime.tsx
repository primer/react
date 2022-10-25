import React from 'react'
import styled from 'styled-components'
import {RelativeTimeElement} from '@github/time-elements'
import {createComponent} from '@lit-labs/react'
import sx from '../sx'

export const RelativeTime = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)
