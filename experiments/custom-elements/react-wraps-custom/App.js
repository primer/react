import {fixClassnameAttrs} from './dangerfile'
import React, {Component} from 'react'
import CopyButton from './CopyButton'

export default class App extends Component {
  componentDidMount() {
    const {root} = this
    fixClassnameAttrs(root)
    root.addEventListener('copy', event => {
      console.warn('copy:', event)
    })
  }

  render() {
    return (
      <div ref={ref => (this.root = ref)}>
        <p className='mb-2'>
          <CopyButton for='text-1' className='btn btn-primary'>
            Copy this:
          </CopyButton>
          <tt id='text-1' className='ml-2'>some text</tt>
        </p>
        <p>Then you can paste it here:</p>
        <input type='text'/>
      </div>
    )
  }
}
