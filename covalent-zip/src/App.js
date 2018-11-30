// App handles all zip logic and basically acts as a global scope

import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import cnst from './constants'
import StatusBar from './components/StatusBar'
import Header from './components/Header'
import FileDrop from 'react-file-drop'
import zipHandler from './zipHandler'

const Browser = () => {
 return <div>File loaded.</div>
}

const WelcomeStyled = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: calc(100% - ${cnst.headerHeight + cnst.statusBarHeight}px);
`

class Welcome extends Component {
  handleDrop(files, event) {
    if (files[0]) {
      // They've given us something!
    }
  }

  render() {
   return (
     <WelcomeStyled>
      <FileDrop onDrop={this.handleDrop}>
        <h1>The next level zip app</h1>
        <h4>Drop a file here, or click to browse</h4>
      </FileDrop>
     </WelcomeStyled>
   )
  }
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
        <StatusBar statusText="Idle"/>
      </Fragment>
    )
  }
}

export default App
