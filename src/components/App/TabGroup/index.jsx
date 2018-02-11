import React from 'react'

import { observer } from 'mobx-react'
import { observe } from 'mobx'
import Store from '../../../stores/store'

import Tab from '../Tab'

import * as tabsActions from '../../../actions/tabs'

import tabDefaults from '../../../defaults/tabs'

@observer
export default class TabGroup extends React.Component {
  constructor () {
    super()

    this.timer = {
      canReset: false
    }

    this.state = {
      tabs: []
    }
  }

  componentDidMount () {
    const tabGroup = Store.tabGroups.filter((tabGroup) => {
      return tabGroup.id === this.props.id
    })[0]

    this.setState({tabs: tabGroup.tabs.slice()})

    // Start the timer.
    setInterval(() => { // Invoke the function each 3 seconds.
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (this.timer.canReset && this.timer.time === 3) {
        Store.app.tabs.updateTabs()
        this.timer.canReset = false
      }
      this.timer.time += 1
    }, 1000)

    // Check for changes in Store.tabsGroups[this.props.id].
    observe(tabGroup.tabs, change => {
      if (change.addedCount > 0 && change.removedCount > 0) return
      // If an item was added.
      if (change.addedCount > 0) {
        // Add the item to state.
        this.setState({tabs: change.object.slice()})

        // Get and set initial left for new tab.
        const tab = change.added[0]
        tab.left = tabsActions.getPosition(change.index)

        // Enable left animation.
        setTimeout(() => {
          tab.animateLeft = true
          Store.app.tabs.updateTabs()
        })

        return
      }
      // If an item was removed.
      if (change.removedCount > 0) {
        // Remove it from state after delay, to keep close animation.
        setTimeout(() => {
          this.setState({tabs: change.object.slice()})
        }, tabDefaults.transitions.width.duration * 1000)
        
        return
      }
    })

    window.addEventListener('resize', (e) => {
      if (!e.isTrusted) return
      
      // Turn off left animation for add tab button.
      Store.app.tabs.addTab.setState({animateLeft: false})

      // Disable animations for all tabs.
      for (var i = 0; i < tabGroup.tabs.length; i++) {
        const tab = tabGroup.tabs[i]

        Store.tabAnimateLeft = false
        Store.tabAnimateWidth = false
      }

      Store.app.tabs.updateTabs()
    })

    Store.currentTabGroup = this.props.id
    tabsActions.addTab()
  }

  resetTimer () {
    this.timer.canReset = true
    this.timer.time = 0
  }


  render () {
    return (
      <div className='tab-group' style={{display: (Store.currentTabGroup === this.props.id) ? 'block' : 'none'}}>
        {this.state.tabs.map((item) => {
          return <Tab tabs={Store.app.tabs} tabGroup={this} getTabsWidth={Store.app.tabs.getWidth} tab={item} key={item.id}></Tab>
        })}
      </div>
    )
  }
}
