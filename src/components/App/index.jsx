import React from 'react'

import Store from '../../stores/store'
import { observer } from 'mobx-react'

import SystemBar from './SystemBar'
import Tabs from './Tabs'
import Pages from './Pages'
import Bar from './Bar'
import Suggestions from './Suggestions'
import Menu from './Menu'
import MenuNavigation from './MenuNavigation'
import TabGroupsMenu from './TabGroupsMenu'
import BackgroundExtensions from './BackgroundExtensions'

import mainMenuItems from '../../defaults/main-menu-items'
import tabMenuItems from '../../defaults/tab-menu-items';
import pageMenuItems from '../../defaults/page-menu-items'

import { ipcRenderer } from 'electron'
import ipcMessages from '../../defaults/ipc-messages'

import * as pagesActions from '../../actions/pages'
import * as tabsActions from '../../actions/tabs'
import * as tabGroupsActions from '../../actions/tab-groups'
import * as pageMenuActions from '../../actions/page-menu'
import * as extensionsActions from '../../actions/extensions'

import * as languageActions from '../../actions/language'

@observer
export default class App extends React.Component {
  constructor () {
    super()

    languageActions.loadDictionary()
  }

  async componentDidMount () {
    Store.app = this
    extensionsActions.loadExtensions()

    window.addEventListener('mousedown', (e) => {
      this.suggestions.hide()
      this.pageMenu.hide()
      this.tabMenu.hide()
      this.tabGroupsMenu.hide()
      this.menu.hide()
    })

    window.addEventListener('click', (e) => {
      this.pageMenu.hide()
      this.tabGroupsMenu.hide()
      this.menu.hide()
    })

    window.addEventListener('mousemove' , (e) => {
      Store.cursor.x = e.pageX
      Store.cursor.y = e.pageY
    })

    window.addEventListener('keydown', e => {
      if (e.ctrlKey) {
        if (e.shiftKey) {
          if (e.keyCode === 9) { // Tab key
            const tabGroup = tabGroupsActions.getCurrentTabGroup()
            const selectedTab = tabsActions.getSelectedTab()
  
            const prevTab = tabGroup.tabs[tabGroup.tabs.indexOf(selectedTab) - 1]
  
            if (prevTab != null) {
              Store.selectedTab = prevTab.id
            } else {
              Store.selectedTab = tabGroup.tabs[tabGroup.tabs.length - 1].id
            }
          }
        } else {
          if (e.keyCode === 9) { // Tab key
            const tabGroup = tabGroupsActions.getCurrentTabGroup()
            const selectedTab = tabsActions.getSelectedTab()
  
            const nextTab = tabGroup.tabs[tabGroup.tabs.indexOf(selectedTab) + 1]
  
            if (nextTab != null) {
              Store.selectedTab = nextTab.id
            } else {
              Store.selectedTab = 0
            }
          }
        }
      }
    })

    window.addEventListener('keyup', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.altKey) return
        if (e.keyCode === 70) {
          pagesActions.getSelectedPage().page.findMenu.toggle()
        }
        if (e.keyCode === 84) { // T key
          tabsActions.addTab()
        }
        if (e.keyCode === 87) { // W key
          tabsActions.getSelectedTab().tab.close()
        }
        if (e.keyCode === 116) { // F5 key
          pagesActions.getSelectedPage().page.webview.reloadIgnoringCache()
        }
        if (e.keyCode === 76) { // L key
          this.bar.addressBar.focus()
        }
        if (e.keyCode === 72) { // H key
          tabsActions.addTab({
            select: true,
            url: 'wexond://newtab'
          })
        }
        if (e.keyCode === 80) { // P key
          pageMenuActions.print()
        }
        if (e.keyCode === 83) { // S key
          pageMenuActions.saveAs()
        }
      } else if (e.altKey) {

      } else {
        if (e.keyCode === 116) { // F5 key
          pagesActions.getSelectedPage().page.webview.reload()
        }
        if (e.keyCode === 123) { // F12 key
          pagesActions.getSelectedPage().page.webview.openDevTools()
        }
      }
    })

    ipcRenderer.on(ipcMessages.BROWSER_GO_BACK, (e, arg) => {
      pagesActions.getSelectedPage().page.webview.goBack()
    })

    ipcRenderer.on(ipcMessages.BROWSER_GO_FORWARD, (e, arg) => {
      pagesActions.getSelectedPage().page.webview.goForward()
    })
    // docs for "arg"
    // https://electronjs.org/docs/api/download-item
    ipcRenderer.on(ipcMessages.DOWNLOAD_STARTED, (e, arg) => {
      //TODO
    })

    ipcRenderer.on(ipcMessages.DOWNLOAD_INTERRUPTED, (e, arg) => {
      //TODO
    })

    ipcRenderer.on(ipcMessages.DOWNLOAD_PAUSED, (e, arg) => {
      //TODO
    })

    ipcRenderer.on(ipcMessages.DOWNLOAD_PROGRESS, (e, arg) => {
      //TODO
    })

    ipcRenderer.on(ipcMessages.DOWNLOAD_COMPLETE, (e, arg) => {
      //TODO
    })

    ipcRenderer.on(ipcMessages.DOWNLOAD_FAILED, (e, arg) => {
      //TODO
    })

    this.menu.setState({items: mainMenuItems()})
    this.tabMenu.setState({items: tabMenuItems()})
    this.pageMenu.setState({items: pageMenuItems()})
  }

  refreshIconsState () {
    this.menuNavigation.refreshIconsState()
    this.bar.refreshIconsState()
  }

  restoreTabsAnimations () {
    if (!Store.tabAnimateLeft) Store.tabAnimateLeft = true
    if (!Store.tabAnimateWidth) Store.tabAnimateWidth = true
    if (Store.app != null && !Store.app.tabs.addTab.state.animateLeft) Store.app.tabs.addTab.setState({animateLeft: true})
  }

  render () {
    const onVisibilityChange = (e) => {
      if (!e) {
        Store.editingTabGroup = -1
      }
    }

    return (
      <div className='app'>
        <SystemBar>
          <Tabs ref={(r) => { this.tabs = r }} />
        </SystemBar>
        <Bar ref={(r) => { this.bar = r }} />
        <Suggestions ref={(r) => { this.suggestions = r }} />
        <Pages />
        <Menu ref={(r) => { this.pageMenu = r }} itemsStyle={{paddingBottom: 12, paddingTop: 0}}>
          <MenuNavigation ref={(r) => { this.menuNavigation = r }}></MenuNavigation>
          <div className='separator' style={{marginTop: 0}}></div>
        </Menu>
        <Menu ref={(r) => { this.tabMenu = r }} itemsStyle={{ paddingBottom: 12, paddingTop: 0 }}>
          <MenuNavigation ref={(r) => { this.menuNavigation = r }}></MenuNavigation>
          <div className='separator' style={{ marginTop: 0 }}></div>
        </Menu>
        <Menu ref={(r) => { this.tabGroupsMenu = r }} right={8} top={8} onVisibilityChange={onVisibilityChange}>
          <TabGroupsMenu></TabGroupsMenu>
        </Menu>
        <Menu ref={(r) => { this.menu = r }} right={8} top={40}>

        </Menu>
        <BackgroundExtensions />
      </div>
    )
  }
}
