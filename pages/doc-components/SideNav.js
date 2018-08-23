import React from 'react'
import {Button, Link} from '../../src'

class SideNav extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showComponents: false
    }
  }

  showComponents = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      showComponents: !prevState.showComponents
    }))
  }

  render() {
    return (
      <React.Fragment>
        <nav className="menu">
          <a className="menu-item" href="/">Home</a>
          <a className="menu-item" onClick={this.showComponents}>Components</a>
          {this.state.showComponents &&
            <Link pl={4} className="menu-item" href="/components/avatar">Avatar</Link>
          }
          <a className="menu-item" href="/demos">Demos</a>
        </nav>
      </React.Fragment>
    )
  }
}
export default SideNav
