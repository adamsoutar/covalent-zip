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
  margin-right: 20px;
  font-size: 25px;
  font-family: 'Arial', sans-serif;
  cursor: pointer;
`

class Header extends Component {
  render () {
    return (
      <HeaderStyled>
          Covalent Zip

          <MenuStyled>
            {this.props.zipOpen ?
              <span onClick={this.props.closeZip}>close</span> :
              <span onClick={this.props.createZip}>create</span>
            }
          </MenuStyled>
      </HeaderStyled>
    )
  }
}

export default Header
