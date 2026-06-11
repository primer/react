import {apply} from 'invokers-polyfill/fn'
import {canUseDOM} from '../utils/environment'

if (canUseDOM) {
  apply()
}
