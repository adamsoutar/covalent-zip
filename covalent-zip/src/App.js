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
      mainTitle: 'A zip app built with web technologies',
      loading: false,
      fileName: 'unknown.zip'
    }
    this.fileInput = React.createRef()
  }

  handleFiles (files) {
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
            mainTitle: 'Whoops! Are you sure that was a zip file?'
          })
          return
        }
        this.props.updateStatusBar(`Previewing ${fileName}`)
        this.props.zipLoaded(fileName)
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
        <WelcomeStyled onDrop={(files) => { this.handleFiles(files) }}>
          {this.state.loading
            ? <Fragment>
              <h1>Unpacking preview...</h1>
              <h4>Please wait while load {this.state.fileName}</h4>
            </Fragment>
            : <Fragment>
              <h1>{this.state.mainTitle}</h1>
              <label htmlFor='clickInput'><h4>Drop a file on the window, or click here to browse</h4></label>
              <input
                id='clickInput'
                type='file'
                onChange={() => { this.handleFiles(this.fileInput.current.files) }}
                ref={this.fileInput}
                style={{ position: 'fixed', top: '-1000px' }} />
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
      status: 'Idle',
      fileName: 'none'
    }
    this.fileUploader = React.createRef()
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

  closeZip () {
    this.updateStatusBar(`Preview closed`)
    this.setState({
      browsing: false
    })
  }
  createZip () {
    zipHandler.createNew()
    this.zipLoaded('newZip.zip')
    this.updateStatusBar('Zip file created')
  }
  downloadZip () {
    zipHandler.getZipAsBlob((err, fBlob) => {
      if (err) {
        this.updateStatusBar('Failed to compress files!')
        console.log(err)
        return
      }
      FileSaver.saveAs(fBlob, this.state.fileName)
    })
  }
  newFolder () {
    // TODO: Use a styled modal, not prompt
    const folderName = prompt('Name for new folder:')
    if (folderName) {
      zipHandler.createFolder(`${this.state.relativePath}${folderName}`)
      // Update the view
      this.browseZipFolder(this.state.relativePath)
      this.updateStatusBar(`Created ${folderName}/`)
    } else {
      this.updateStatusBar("Can't create a folder with no name!")
    }
  }
  uploadFile () {
    this.fileUploader.current.click()
  }
  handleFileUpload () {
    var files = this.fileUploader.current.files
    if (files.length > 0) {
      var filesUploaded = 0
      var errors = false

      function fileUploaded (success) {
        filesUploaded++
        if (!success) {
          errors = true
        }
        if (filesUploaded === files.length) {
          this.updateStatusBar((errors)
            ? 'Some errors occurred while uploading. Check console.'
            : 'All files added successfully.'
          )
          this.browseZipFolder(this.state.relativePath)
        }
      }

      for (let f of files) {
        zipHandler.addFile(f, `${this.state.relativePath}${f.name}`, fileUploaded.bind(this))
      }
    } else {
      this.updateStatusBar('No files were selected')
    }
  }

  zipLoaded (fileName) {
    this.setState({
      fileName: fileName
    })
    this.browseZipFolder('')
  }

  render () {
    return (
      <Fragment>
        <Header
          closeZip={() => { this.closeZip() }}
          createZip={() => { this.createZip() }}
          downloadZip={() => { this.downloadZip() }}
          newFolder={() => { this.newFolder() }}
          uploadFile={() => { this.uploadFile() }}
          zipOpen={this.state.browsing} />
        {this.state.browsing
          ? <Browser
            isRoot={(this.state.relativePath === '')}
            enterFolder={(x) => { this.enterFolder(x) }}
            upOneFolder={() => { this.upOneFolder() }}
            updateStatusBar={(x) => { this.updateStatusBar(x) }}
            downloadFile={(relName) => { this.downloadFile(relName) }}
            contents={this.state.folderContents} />
          : <Welcome
            zipLoaded={(x) => { this.zipLoaded(x) }}
            updateStatusBar={(x) => { this.updateStatusBar(x) }}
          />}
        <StatusBar statusText={this.state.status} />

        <input
          id='fileUploader'
          type='file'
          onChange={this.handleFileUpload.bind(this)}
          ref={this.fileUploader}
          style={{ position: 'fixed', top: '-1000px' }} />
      </Fragment>
    )
  }
}

export default App
