import React, { Component } from 'react'
import styled from 'styled-components'
import cnst from '../constants'

const StatusBarStyled = styled.div`
  height: ${cnst.statusBarHeight}px;
  background-color: ${cnst.colours.bar};
  color: ${cnst.colours.barText};
  padding-left: 20px;
  line-height: ${cnst.statusBarHeight}px;
`

class StatusBar extends Component {
  render () {
    return (
      <StatusBarStyled>
        {this.props.statusText}
      </StatusBarStyled>
    )
  }
}

export default StatusBar
