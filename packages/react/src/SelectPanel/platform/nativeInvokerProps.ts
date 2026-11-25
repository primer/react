import {reactMajorVersion} from '../../utils/environment'

export function nativeInvokerProps(
  targetId: string,
  command: 'show-modal' | 'close' | 'toggle-popover' | 'hide-popover',
) {
  return {
    command,
    ...(reactMajorVersion >= 19 ? {commandFor: targetId} : {commandfor: targetId}),
  }
}
