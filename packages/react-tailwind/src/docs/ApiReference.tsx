import React from 'react'
import {ScrollableRegion} from '../components/ScrollableRegion'

interface ApiReferenceProps {
  props: ReadonlyArray<{
    name: string
    type: string
    description?: string
    defaultValue?: string
    required?: boolean
  }>
  passthrough?: {element: string; url: string}
}

export function ApiReference({props, passthrough}: ApiReferenceProps) {
  return (
    <>
      <ScrollableRegion aria-label="Component-specific props">
        <table>
          <caption>Component-specific props</caption>
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Type</th>
              <th scope="col">Required</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map(prop => (
              <tr key={prop.name}>
                <th scope="row">
                  <code>{prop.name}</code>
                </th>
                <td style={{overflowWrap: 'anywhere'}}>
                  <code>{prop.type}</code>
                </td>
                <td>{prop.required ? 'Yes' : 'No'}</td>
                <td>{prop.defaultValue ? <code>{prop.defaultValue}</code> : '—'}</td>
                <td>{prop.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableRegion>
      {passthrough && (
        <p>
          Additional props are forwarded to{' '}
          <a href={passthrough.url}>
            <code>{passthrough.element}</code>
          </a>
          .
        </p>
      )}
    </>
  )
}
