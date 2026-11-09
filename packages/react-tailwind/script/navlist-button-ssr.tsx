import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {NavList} from '../src/components/NavList/NavList'

export const CustomButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button {...props} ref={ref} type="button" />
  },
)

const nav = (
  <NavList aria-label="Settings" style={{width: 'min(100%, 280px)'}}>
    <NavList.Item href="#item" data-testid="link">
      Item
    </NavList.Item>
    <NavList.Item as="button" type="button" data-testid="button">
      Item
    </NavList.Item>
    <NavList.Item as={CustomButton} data-testid="custom-button">
      Item
    </NavList.Item>
    <NavList.Item href="#current" aria-current="page" data-testid="current-link">
      Item
    </NavList.Item>
    <NavList.Item as="button" type="button" aria-current="page" data-testid="current-button">
      Item
    </NavList.Item>
    <NavList.Item href="#inactive" inactiveText="Unavailable" data-testid="inactive-link">
      Item
    </NavList.Item>
    <NavList.Item as="button" type="button" inactiveText="Unavailable" data-testid="inactive-button">
      Item
    </NavList.Item>
    <NavList.Item as="button" type="button" className="box-border border-2 bg-muted font-mono" data-testid="override">
      Item
    </NavList.Item>
  </NavList>
)

const namingExamples = (
  <>
    <span id="deployment-status" className="sr-only">
      Done
    </span>
    <NavList aria-label="Deployments">
      <NavList.Item href="#natural">
        <NavList.LeadingVisual>
          <span className="sr-only">Done</span>
        </NavList.LeadingVisual>
        Natural name
      </NavList.Item>
      <NavList.Item href="#description">
        <NavList.LeadingVisual>
          <span className="sr-only">Done</span>
        </NavList.LeadingVisual>
        Named by label
        <NavList.Description>Deployment details</NavList.Description>
      </NavList.Item>
      <NavList.Item href="#status" aria-describedby="deployment-status">
        <NavList.LeadingVisual aria-hidden="true">Icon</NavList.LeadingVisual>
        Described status
      </NavList.Item>
      <NavList.Item href="#explicit" aria-label="Custom name">
        <NavList.LeadingVisual>
          <span className="sr-only">Done</span>
        </NavList.LeadingVisual>
        Explicit label
      </NavList.Item>
    </NavList>
  </>
)

process.stdout.write(
  JSON.stringify({
    unscoped: renderToStaticMarkup(nav),
    scoped: renderToStaticMarkup(<div data-component="BaseStyles">{nav}</div>),
    names: renderToStaticMarkup(namingExamples),
  }),
)
