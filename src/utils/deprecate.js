/* eslint-disable no-console */

export default function({name, message, version}){
  if (process.env.NODE_ENV !== "production") {
    console.warn(`WARNING! ${name} will be deprecated in version ${version}. ${message}`)
  }
}
