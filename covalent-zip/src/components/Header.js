import React, { Component, Fragment } from 'react'
import UpIcon from '../icons/up.png'
import SaveIcon from '../icons/save.png'
import FolderIcon from '../icons/folder.png'
import CloseIcon from '../icons/cross.png'
import CreateIcon from '../icons/create.png'
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
  height: 1px;
`
const menuIconSize = cnst.headerHeight - cnst.headerIconPadding * 2
const MenuItem = styled.img`
  position: relative;
  top: ${cnst.headerIconPadding}px;
  width: ${menuIconSize}px;
  height: ${menuIconSize}px;
  margin-right: 20px;
`

class Header extends Component {
  render () {
    return (
      <HeaderStyled>
          Covalent Zip

        <MenuStyled>
          {this.props.zipOpen
            ? <Fragment>
              <MenuItem onClick={this.props.newFolder} src={FolderIcon} />
              <MenuItem onClick={this.props.uploadFile} src={UpIcon} />
              <MenuItem onClick={this.props.downloadZip} src={SaveIcon} />
              <MenuItem onClick={this.props.closeZip} src={CloseIcon} />
            </Fragment>
            : <MenuItem onClick={this.props.createZip} src={CreateIcon} />
          }
        </MenuStyled>
      </HeaderStyled>
    )
  }
}

export default Header
