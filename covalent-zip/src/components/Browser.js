import React, { Component, Fragment } from 'react'
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
`

class ZipItem extends Component {
  render () {
    return (
      <ZipItemStyled onClick={this.props.onClick}>
        {this.props.item}
      </ZipItemStyled>
    )
  }
}

class Browser extends Component {
  render () {
    return (
      <BrowserStyled>
        {this.props.isRoot ? <Fragment /> : <ZipItem item='..' onClick={() => {
          this.props.upOneFolder()
        }} /> }

        {this.props.contents.folders.map((x) => {
          return <ZipItem key={x} item={x} onClick={() => {
            this.props.enterFolder(x)
          }} />
        })}

        {this.props.contents.files.map((x) => {
          return <ZipItem key={x} item={x} />
        })}
      </BrowserStyled>
    )
  }
}

export default Browser
