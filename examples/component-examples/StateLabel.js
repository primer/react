import React from 'react'
import Octicon from '@github/octicons-react'
import { Block, StateLabel } from '../../src'
import ExampleHeading from '../ExampleHeading'

const StateLabelExample =
  {
    name: 'StateLabel',
    element: (
      <div>
        <Block mb={2}>
          <StateLabel state='open'>Open</StateLabel>
        </Block>
        <Block mb={2}>
          <StateLabel state='closed'>Closed</StateLabel>
        </Block>
        <Block mb={4}>
          <StateLabel state='merged'>Merged</StateLabel>
        </Block>
        <Block mb={4}>
          <ExampleHeading>By state (Octicons built in)</ExampleHeading>
          <Block mb={2}>
            <StateLabel>Unknown</StateLabel>
          </Block>
          <Block mb={2}>
            <StateLabel state='open'>Open</StateLabel>
          </Block>
          <Block mb={2}>
            <StateLabel state='closed'>Closed</StateLabel>
          </Block>
          <Block mb={2}>
            <StateLabel state='merged'>Merged</StateLabel>
          </Block>
          <Block mb={2}>
            <StateLabel state='reopened'>Reopened</StateLabel>
          </Block>
        </Block>
        <Block mb={4}>
          <ExampleHeading>By color</ExampleHeading>
          <Block mb={2}>
            <StateLabel scheme='invalid'>Invalid</StateLabel>
          </Block>
          <Block mb={2}>
            <StateLabel scheme='green'>Green</StateLabel>
          </Block>
          <Block mb={2}>
            <StateLabel scheme='red'>Red</StateLabel>
          </Block>
          <Block mb={2}>
            <StateLabel scheme='purple'>Purple</StateLabel>
          </Block>
        </Block>
        <Block mb={4}>
          <ExampleHeading>Small, by state</ExampleHeading>
          <Block mb={2}>
            <span className='mr-2'>
              <StateLabel small>Unknown</StateLabel>
            </span>
            <span className='mr-2'>
              <StateLabel small state='open'>Open</StateLabel>
            </span>
            <span className='mr-2'>
              <StateLabel small state='closed'>Closed</StateLabel>
            </span>
            <span className='mr-2'>
              <StateLabel small state='merged'>Merged</StateLabel>
            </span>
            <span className='mr-2'>
              <StateLabel small state='reopened'>Reopened</StateLabel>
            </span>
          </Block>
        </Block>
        <Block mb={4}>
          <ExampleHeading>Small, by color</ExampleHeading>
          <Block mb={2}>
            <span className='mr-2'>
              <StateLabel small scheme='invalid'>Invalid</StateLabel>
            </span>
            <span className='mr-2'>
              <StateLabel small scheme='green'>Green</StateLabel>
            </span>
            <span className='mr-2'>
              <StateLabel small scheme='red'>Red</StateLabel>
            </span>
            <span className='mr-2'>
              <StateLabel small scheme='purple'>Purple</StateLabel>
            </span>
            <span className='mr-2'>
              <StateLabel small scheme='green' icon={<Octicon name='git-branch'/>}>
                Custom Octicon
              </StateLabel>
            </span>
          </Block>
        </Block>
      </div>
    )
  }

export default StateLabelExample
