import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import cnst from './constants'
import StatusBar from './components/StatusBar'
import Header from './components/Header'
import FileDrop from 'react-file-drop'
import zipHandler from './zipHandler'
import Browser from './components/Browser'

var statusBarText = 'Idle'

const WelcomeStyled = styled(FileDrop)`
  height: calc(100% - ${cnst.headerHeight + cnst.statusBarHeight}px);
`

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mainTitle: 'The next level zip app',
      loading: false,
      fileName: 'unknown.zip'
    }
  }

  handleDrop(files) {
    if (files[0]) {
      // They've given us something!
      // TODO: Show loading
      const fileName = files[0].name
      statusBarText = 'Loading preview...'
      zipHandler.loadFile(files[0], (err, zip) => {
        this.setState({
          loading: false
        })
        if (err) {
          statusBarText = 'Failed to open that file!'
          console.log(err)
          this.setState({
            mainTitle: 'Whoops! Are you sure that was a ZIP file?'
          })
          return
        }
        statusBarText = `Previewing ${fileName}`
        this.props.zipLoaded()
      })
      this.setState({
        loading: true,
        fileName: fileName
      })
    } else {
      statusBarText = 'Preview failed, no files dropped.'
    }
  }

  render() {
   return (
     <Fragment>
         <WelcomeStyled onDrop={(files) => { this.handleDrop(files) }}>
         {this.state.loading ? (
           <Fragment>
             <h1>Unpacking preview...</h1>
             <h4>Please wait while load {this.state.fileName}</h4>
           </Fragment>)
           : (
           <Fragment>
             <h1>{this.state.mainTitle}</h1>
             <h4>Drop a file here, or click to browse</h4>
           </Fragment>)
         }
        </WelcomeStyled>
      </Fragment>
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
    const folders = this.state.relativePath.split('/')
    folders.pop()
    folders.pop()
    console.log(folders)
    const rP = folders.join('/')
    console.log(rP)
    const newPath = `${rP}${(rP === '') ? '' : '/'}`
    console.log(newPath)
    this.browseZipFolder(newPath)
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
        <StatusBar statusText={statusBarText}/>
      </Fragment>
    )
  }
}

export default App
