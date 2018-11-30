// App handles all zip logic and basically acts as a global scope

import React, { Component, Fragment } from 'react';

const Header = () => {
 return <div>Test header</div>
}

const Browser = () => {
 return <div>File loaded.</div>
}

const Welcome = () => {
 return <div>Hello World!</div>
}

const StatusBar = () => {
 return <div>Status bar</div>
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      browsing: false,
      zipFile: undefined
    }
  }

  render() {
    return (
      <Fragment>
        <Header />
        {this.state.browsing ? <Browser /> : <Welcome />}
        <StatusBar />
      </Fragment>
    );
  }
}

export default App;
