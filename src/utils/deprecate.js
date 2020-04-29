/* eslint-disable no-console */

export default function({name, message, version}){
  if (process.env.NODE_ENV !== "production") {
    console.warn(`WARNING! ${name} is deprecated and will be removed in version ${version}. ${message}`)
  }
}
