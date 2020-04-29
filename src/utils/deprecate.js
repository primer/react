/* eslint-disable no-console */

export default function({name, message, version}){
  console.warn(`WARNING! ${name} is deprecated and will be removed in version ${version}. ${message}`)
}
