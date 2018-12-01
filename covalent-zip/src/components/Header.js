import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import cnst from '../constants'

const HeaderStyled = styled.div`
  height: ${cnst.headerHeight}px;
  background-color: ${cnst.colours.bar};
  color: ${cnst.colours.barText};
  line-height: ${cnst.headerHeight}px;
  padding-left: 20px;
  font-size: 30px;
  font-family: 'Arial Black', 'Arial', sans-serif;
`
const MenuStyled = styled.div`
  float: right;
  font-size: 25px;
  font-family: 'Arial', sans-serif;
  cursor: pointer;
`
const MenuItem = styled.div`
  float: left;
  margin-right: 20px;
`

class Header extends Component {
  render () {
    return (
      <HeaderStyled>
          Covalent Zip

          <MenuStyled>
            {this.props.zipOpen ?
              <Fragment>
                <MenuItem onClick={this.props.newFolder}>new folder</MenuItem>
                <MenuItem onClick={this.props.uploadFile}>upload file</MenuItem>
                <MenuItem onClick={this.props.downloadZip}>compress</MenuItem>
                <MenuItem onClick={this.props.closeZip}>close</MenuItem>
              </Fragment>
              : <MenuItem onClick={this.props.createZip}>create</MenuItem>
            }
          </MenuStyled>
      </HeaderStyled>
    )
  }
}

export default Header
