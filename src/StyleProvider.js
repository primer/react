import React from 'react'
import css from './css'

export default function StyleProvider(props) {
  /* eslint-disable-next-line react/no-danger */
  return <style {...props} dangerouslySetInnerHTML={{__html: css}} />
}
