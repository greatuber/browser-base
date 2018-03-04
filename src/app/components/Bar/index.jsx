import React from 'react'

import AddressBar from '../AddressBar'
import Ripple from '../../Material/Ripple'

import * as pagesActions from '../../../actions/pages'
import * as tabsActions from '../../../actions/tabs'

import { observer } from 'mobx-react'
import Store from '../../../stores/store'

import Colors from '../../../utils/colors'

@observer
export default class Bar extends React.Component {
  constructor () {
    super()

    this.state = {
      canGoBack: false,
      canGoForward: false
    }
  }

  refreshIconsState () {
    this.setState(pagesActions.getNavigationState())
  }

  render () {
    const {
      canGoBack,
      canGoForward
    } = this.state

    const onBackClick = () => {
      const page = pagesActions.getSelectedPage()
      page.page.goBack()
    }

    const onForwardClick = () => {
      const page = pagesActions.getSelectedPage()
      page.page.goForward()
    }

    const onRefreshClick = () => {
      const page = pagesActions.getSelectedPage()
      page.page.refresh()
    }

    const onMenuClick = () => {
      Store.app.menu.show()
    }

    const barStyle = {
      backgroundColor: Store.backgroundColor,
      display: (Store.isFullscreen) ? 'none' : 'flex'
    }

    return (
      <div className={'bar ' + Store.foreground + (!Store.border ? ' disabled-border' : '')} style={barStyle}>
        <div className={'bar-icon back-icon ' + ((!canGoBack) ? 'disabled' : '')} onClick={onBackClick} >
          <Ripple center={true} scale={12} offsetX={15} />
        </div>
        <div className={'bar-icon forward-icon ' + ((!canGoForward) ? 'disabled' : '')} onClick={onForwardClick} >
          <Ripple center={true} scale={12} offsetX={-5} />
        </div>
        <div className='bar-icon refresh-icon' onClick={onRefreshClick} >
          <Ripple center={true} scale={12} />
        </div>
        <AddressBar ref={(r) => { this.addressBar = r }} />
        <div className='bar-icon menu-icon' onClick={onMenuClick} >
          <Ripple center={true} scale={12} offsetX={-5} />
        </div>
      </div>
    )
  }
}