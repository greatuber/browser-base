import { observable, observe, intercept } from 'mobx'

export default new class Store {
  @observable tabGroups = []
  @observable addTabLeft = 0
  @observable selectedTab = -1
  @observable tabDragData = {}
  @observable tabAnimateLeft = true
  @observable tabAnimateWidth = true

  @observable foreground = 'black'
  @observable backgroundColor = '#fff'
  @observable border = true

  @observable currentTabGroup = 0
  @observable editingTabGroup = -1
  @observable isFullscreen = false

  @observable extensions = []

  @observable dictionary

  url = ''
  certificates = []

  pageMenuData = {}
  cursor = {}
}
