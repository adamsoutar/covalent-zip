import React, { Component, Fragment } from 'react'
import FolderIcon from '../icons/folder.png'
import DocumentIcon from '../icons/document.png'
import ImageIcon from '../icons/image.png'
import CrossIcon from '../icons/cross.png'
import styled from 'styled-components'
import cnst from '../constants'

const BrowserStyled = styled.div`
  height: calc(100% - ${cnst.headerHeight + cnst.statusBarHeight}px);
  overflow-y: scroll;
`

const ZipItemStyled = styled.div`
  height: ${cnst.zipItemHeight}px;
  line-height: ${cnst.zipItemHeight}px;
  border-bottom: 1px solid black;
  padding-left: 20px;
  cursor: pointer;
`
const iconHeight = cnst.zipItemHeight - cnst.zipIconPadding
const ItemIcon = styled.img`
  width: ${iconHeight}px;
  height: ${iconHeight}px;
  margin-top: ${(cnst.zipItemHeight - iconHeight) / 2}px;
  margin-right: 5px;
  float: left;
`

class ZipItem extends Component {
  determineIcon () {
    if (!(this.props.file || this.props.folder)) {
      return CrossIcon
    }
    if (this.props.file) {
      const fileSplit = this.props.item.split('.')
      const ext = fileSplit[fileSplit.length - 1]
      return (cnst.imageTypes.includes(ext.toLowerCase())) ? ImageIcon : DocumentIcon
    } else {
      return FolderIcon
    }
  }

  render () {
    return (
      <ZipItemStyled onClick={this.props.onClick}>
        <ItemIcon src={this.determineIcon()} />
        <div style={{ float: 'left' }}>{this.props.item}</div>
      </ZipItemStyled>
    )
  }
}

class Browser extends Component {
  hasContent () {
    return (
      this.props.contents.files.length > 0 ||
      this.props.contents.folders.length > 0
    )
  }

  render () {
    return (
      <BrowserStyled>
        {this.props.isRoot ? <Fragment /> : <ZipItem item='..' folder onClick={() => {
          this.props.upOneFolder()
        }} /> }

        {this.hasContent()
          ? <Fragment>
            {this.props.contents.folders.map((x) => {
              return <ZipItem key={x} item={x} folder onClick={() => {
                this.props.enterFolder(x)
              }} />
            })}

            {this.props.contents.files.map((x) => {
              return <ZipItem key={x} item={x} file onClick={() => {
                this.props.downloadFile(x)
              }} />
            })}
          </Fragment>
          : <ZipItem item='This folder is empty' />
        }

      </BrowserStyled>
    )
  }
}

export default Browser
