import {RelativeTimeElement} from '@github/relative-time-element'
import {createComponent} from '@lit-labs/react'
import React from 'react'
import styled from 'styled-components'
import sx from '../sx'
import {ComponentProps} from '../utils/types'

const RelativeTime = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)

export type RelativeTimeProps = ComponentProps<typeof RelativeTime>
export default RelativeTime
