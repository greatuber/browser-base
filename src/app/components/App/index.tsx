import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { StyledApp } from './styles';
import Store from '../../store';
import GlobalStore from '../../../global-store';
import Pages from '../Pages';
import Toolbar from '../Toolbar';
import Menu from '../Menu';
import WorkspacesMenu from '../WorkspacesMenu';
import ContextMenu from '../../../shared/components/ContextMenu';
import History from '../../../menu/history/components/History';
import About from '../../../menu/about/components/About';
import HistoryStore from '../../../menu/history/store';
import { deleteHistoryItem } from '../../../menu/history/utils';

const historyIcon = require('../../../shared/icons/history.svg');
const clearIcon = require('../../../shared/icons/clear.svg');
const bookmarksIcon = require('../../../shared/icons/bookmarks.svg');
const settingsIcon = require('../../../shared/icons/settings.svg');
const extensionsIcon = require('../../../shared/icons/extensions.svg');
const aboutIcon = require('../../../shared/icons/info.svg');
const selectAllIcon = require('../../../shared/icons/select-all.svg');
const closeIcon = require('../../../shared/icons/close.svg');
const trashIcon = require('../../../shared/icons/delete.svg');

const historyActions = {
  selectAll: () => {
    const { selectedItems, sections } = HistoryStore;
    for (const section of sections) {
      for (const item of section.items) {
        item.selected = true;
        selectedItems.push(item);
      }
    }
  },
  deselectAll: () => {
    const { selectedItems } = HistoryStore;
    for (let i = selectedItems.length - 1; i >= 0; i--) {
      selectedItems[i].selected = false;
      selectedItems.splice(i, 1);
    }
  },
  deleteAllSelectedItems: () => {
    const { selectedItems, sections } = HistoryStore;
    for (let i = selectedItems.length - 1; i >= 0; i--) {
      const selectedItem = selectedItems[i];
      deleteHistoryItem(selectedItem.id);
      selectedItems.splice(i, 1);
    }
  },
};

@observer
class App extends React.Component {
  public onInspectElementClick = () => {
    const { x, y } = Store.webviewContextMenuParams;
    Store.getSelectedPage().webview.inspectElement(x, y);
  };

  public async componentDidMount() {
    ipcRenderer.on('fullscreen', (e: Electron.IpcMessageEvent, isFullscreen: boolean) => {
      Store.isFullscreen = isFullscreen;
    });

    window.addEventListener('mousemove', e => {
      Store.mouse.x = e.pageX;
      Store.mouse.y = e.pageY;
    });

    window.addEventListener('mousedown', () => {
      Store.pageMenu.toggle(false);
    });

    window.addEventListener('keydown', e => {
      // 37 - Arrow left
      // 39 - Arrow right

      const { workspaces } = Store;

      if (e.ctrlKey && e.keyCode === 37) {
        workspaces.visible = true;

        if (workspaces.selected - 1 >= 0) {
          workspaces.selected--;
        }
      } else if (e.ctrlKey && e.keyCode === 39) {
        workspaces.visible = true;

        if (workspaces.selected + 1 < workspaces.list.length) {
          workspaces.selected++;
        }
      }
    });

    // ipcRenderer.send(ipcMessages.PLUGIN_INSTALL, 'wexond/wexond-example-plugin');
  }

  public componentWillUnmount() {
    Store.pages = [];
  }

  public render() {
    const editingHistory = HistoryStore.selectedItems.length > 0;
    const dictionary = GlobalStore.dictionary;

    return (
      <StyledApp>
        <Toolbar />
        <Pages />
        <ContextMenu
          large
          dense
          ref={(r: ContextMenu) => (Store.pageMenu = r)}
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: Store.pageMenuData.x,
            top: Store.pageMenuData.y,
            zIndex: 999,
          }}
        >
          <ContextMenu.Item onClick={this.onInspectElementClick}>Inspect element</ContextMenu.Item>
        </ContextMenu>
        <Menu title="Wexond">
          <Menu.Item
            title={dictionary.history.title}
            icon={historyIcon}
            searchVisible
            content={<History />}
          >
            <Menu.Item title={dictionary.history.clearHistory} icon={clearIcon} />
            <Menu.Item
              title={dictionary.selecting.selectAll}
              visible={!editingHistory}
              icon={selectAllIcon}
              onClick={historyActions.selectAll}
            />
            <Menu.Item
              title={dictionary.selecting.deselectAll}
              visible={editingHistory}
              icon={closeIcon}
              onClick={historyActions.deselectAll}
            />
            <Menu.Item
              title={dictionary.selecting.deleteSelected}
              visible={editingHistory}
              icon={trashIcon}
              onClick={historyActions.deleteAllSelectedItems}
            />
          </Menu.Item>
          <Menu.Item
            title={dictionary.bookmarks.title}
            icon={bookmarksIcon}
            searchVisible
            content={<div />}
          />
          <Menu.Item
            title={dictionary.settings.title}
            icon={settingsIcon}
            searchVisible
            content={<div />}
          />
          <Menu.Item
            title={dictionary.extensions.title}
            icon={extensionsIcon}
            searchVisible
            content={<div />}
          />
          <Menu.Item
            title={dictionary.about.title}
            icon={aboutIcon}
            searchVisible={false}
            content={<About />}
          />
        </Menu>
        <WorkspacesMenu />
      </StyledApp>
    );
  }
}

export default hot(module)(App);
