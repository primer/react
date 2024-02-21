import React from 'react'
import styled from 'styled-components'
import {RelativeTimeElement} from '@github/relative-time-element'
import {createComponent} from '@lit-labs/react'
import type {ComponentProps} from '../utils/types'
import sx from '../sx'

const RelativeTime = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)

export type RelativeTimeProps = ComponentProps<typeof RelativeTime>
export default RelativeTime
