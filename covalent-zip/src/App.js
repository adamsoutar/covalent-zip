import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import cnst from './constants'
import StatusBar from './components/StatusBar'
import Header from './components/Header'
import FileDrop from 'react-file-drop'
import zipHandler from './zipHandler'
import Browser from './components/Browser'

const WelcomeStyled = styled(FileDrop)`
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
     <WelcomeStyled onDrop={(files) => { this.handleDrop(files) }}>
        <h1>The next level zip app</h1>
        <h4>Drop a file here, or click to browse</h4>
     </WelcomeStyled>
   )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      browsing: false,
      relativePath: '',
      folderContents: []
    }
  }

  browseZipFolder(relativePath) {
    this.setState({
      relativePath: relativePath,
      folderContents: zipHandler.filesInPath(relativePath),
      browsing: true
    })
  }

  enterFolder(folderName) {
    this.browseZipFolder(`${this.state.relativePath}${folderName}/`)
  }

  // It's 1:04AM
  upOneFolder() {
    // TODO: Investigate why this always returns to root
    var folders = this.state.relativePath.split('/').splice(-1, 1)
    var rP = folders.join('/')
    this.browseZipFolder(`${rP}${(rP === '') ? '' : '/'}`)
  }

  render() {
    return (
      <Fragment>
        <Header />
        {this.state.browsing ?
          <Browser
            isRoot={(this.state.relativePath === '')}
            enterFolder={(x) => { this.enterFolder(x) }}
            upOneFolder={() => { this.upOneFolder() }}
            contents={this.state.folderContents} /> :
          <Welcome zipLoaded={() => { this.browseZipFolder('') } } />}
        <StatusBar statusText="Idle"/>
      </Fragment>
    )
  }
}

export default App
