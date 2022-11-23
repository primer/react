import React from 'react'
import styled from 'styled-components'
import '../polyfills/custom-elements'
import {RelativeTimeElement} from '@github/time-elements'
import {createComponent} from '@lit-labs/react'
import {ComponentProps} from '../utils/types'
import sx from '../sx'

const RelativeTime = styled(createComponent(React, 'relative-time', RelativeTimeElement))(sx)

export type RelativeTimeProps = ComponentProps<typeof RelativeTime>
export default RelativeTime
