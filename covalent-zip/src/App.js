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
  handleDrop(files) {
    if (files[0]) {
      // They've given us something!
      // TODO: Show loading
      zipHandler.loadFile(files[0], (zip) => {
        this.props.zipLoaded()
      })
    } else {
      // TODO: Clean
      alert('No files were dropped!')
    }
  }

  render() {
   return (
     <WelcomeStyled>
      <FileDrop onDrop={(files) => { this.handleDrop(files) }}>
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
      folderContents: []
    }
  }

  zipLoaded() {
    this.setState({
      browsing: true
    })
    this.browseZipFolder('')
  }

  browseZipFolder(relativePath) {
      // DUMMY
  }

  render() {
    return (
      <Fragment>
        <Header />
        {this.state.browsing ?
          <Browser contents={this.state.contents} /> :
          <Welcome zipLoaded={() => { this.zipLoaded() } } />}
        <StatusBar statusText="Idle"/>
      </Fragment>
    )
  }
}

export default App
