import {LiveRegionElement} from './element'
import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'live-region': React.DetailedHTMLProps<React.HTMLAttributes<LiveRegionElement>, LiveRegionElement>
    }
  }
}
