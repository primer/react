import React from 'react'
import animation from './PrimerComponentsAnimation.json'
import ReactBodymovin from 'react-bodymovin'

const bodymovinOptions = {
  loop: true,
  autoplay: true,
  prerender: true,
  animationData: animation
}

const PrimerComponentsAnimation = props => <ReactBodymovin options={bodymovinOptions} {...props} />

export default PrimerComponentsAnimation
