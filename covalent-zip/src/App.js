import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import cnst from './constants'
import StatusBar from './components/StatusBar'
import Header from './components/Header'
import FileDrop from 'react-file-drop'
import zipHandler from './zipHandler'
import Browser from './components/Browser'
import FileSaver from 'file-saver'

const WelcomeStyled = styled(FileDrop)`
  height: calc(100% - ${cnst.headerHeight + cnst.statusBarHeight}px);
`

class Welcome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mainTitle: 'The next level zip app',
      loading: false,
      fileName: 'unknown.zip'
    }
  }

  handleDrop (files) {
    if (files[0]) {
      // They've given us something!
      // TODO: Show loading
      const fileName = files[0].name
      this.props.updateStatusBar('Loading preview...')
      zipHandler.loadFile(files[0], (err, zip) => {
        this.setState({
          loading: false
        })
        if (err) {
          this.props.updateStatusBar(`Failed to open ${fileName}`)
          console.log(err)
          this.setState({
            mainTitle: 'Whoops! Are you sure that was a ZIP file?'
          })
          return
        }
        this.props.updateStatusBar(`Previewing ${fileName}`)
        this.props.zipLoaded()
      })
      this.setState({
        loading: true,
        fileName: fileName
      })
    } else {
      this.props.updateStatusBar('Preview failed, no files dropped.')
    }
  }

  render () {
    return (
      <Fragment>
        <WelcomeStyled onDrop={(files) => { this.handleDrop(files) }}>
          {this.state.loading
            ? <Fragment>
              <h1>Unpacking preview...</h1>
              <h4>Please wait while load {this.state.fileName}</h4>
            </Fragment>
            : <Fragment>
              <h1>{this.state.mainTitle}</h1>
              <h4>Drop a file here, or click to browse</h4>
            </Fragment>
          }
        </WelcomeStyled>
      </Fragment>
    )
  }
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      browsing: false,
      relativePath: '',
      folderContents: [],
      status: 'Idle'
    }
  }

  updateStatusBar (newStr) {
    this.setState({
      status: newStr
    })
  }

  browseZipFolder (relativePath) {
    this.setState({
      relativePath: relativePath,
      folderContents: zipHandler.filesInPath(relativePath),
      browsing: true
    })
  }

  enterFolder (folderName) {
    this.browseZipFolder(`${this.state.relativePath}${folderName}/`)
  }

  // It's 1:04AM
  upOneFolder () {
    // TODO: Investigate why this always returns to root
    const folders = this.state.relativePath.split('/')
    folders.pop()
    folders.pop()
    const rP = folders.join('/')
    const newPath = `${rP}${(rP === '') ? '' : '/'}`
    this.browseZipFolder(newPath)
  }

  downloadFile (relName) {
    const fileName = `${this.state.relativePath}${relName}`
    zipHandler.getFileAsBlob(fileName, (err, fBlob) => {
      if (err) {
        this.updateStatusBar('Failed to download file.')
        console.log(err)
        return
      }
      FileSaver.saveAs(fBlob, relName)
    })
  }

  render () {
    return (
      <Fragment>
        <Header />
        {this.state.browsing
          ? <Browser
            isRoot={(this.state.relativePath === '')}
            enterFolder={(x) => { this.enterFolder(x) }}
            upOneFolder={() => { this.upOneFolder() }}
            updateStatusBar={(x) => { this.updateStatusBar(x) }}
            downloadFile={(relName) => { this.downloadFile(relName) }}
            contents={this.state.folderContents} />
          : <Welcome
            zipLoaded={() => { this.browseZipFolder('') }}
            updateStatusBar={(x) => { this.updateStatusBar(x) }}
          />}
        <StatusBar statusText={this.state.status} />
      </Fragment>
    )
  }
}

export default App
