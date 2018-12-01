import React, { Component } from 'react'
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

class Header extends Component {
  render() {
    return (
      <HeaderStyled>
          Covalent Zip
      </HeaderStyled>
    )
  }
}

export default Header
