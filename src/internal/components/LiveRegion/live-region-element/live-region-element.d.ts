import {LiveRegionElement} from './element'
import type {DetailedHTMLProps, HTMLAttributes} from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'live-region': DetailedHTMLProps<HTMLAttributes<LiveRegionElement>, LiveRegionElement>
    }
  }
}
