import { observable, computed } from 'mobx';

import { TabsStore } from './tabs';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { ipcRenderer, remote } from 'electron';
import { OverlayStore } from './overlay';
import { HistoryStore } from './history';
import { FaviconsStore } from './favicons';
import { SuggestionsStore } from './suggestions';
import { ExtensionsStore } from './extensions';
import { extname } from 'path';
import { BookmarksStore } from './bookmarks';
import { DownloadsStore } from './downloads';
import { lightTheme } from '~/renderer/constants/themes';
import { WeatherStore } from './weather';
import { SettingsStore } from './settings';
import { AddBookmarkStore } from './add-bookmark';
import { extensionsRenderer } from 'electron-extensions';
import { AutoFillStore } from './autofill';
import { getCurrentWindow } from '../utils';
import { EditAddressStore } from './edit-address';
import { StartupTabsStore } from './startup-tabs';

export class Store {
  public history = new HistoryStore();
  public bookmarks = new BookmarksStore();
  public settings = new SettingsStore(this);
  public suggestions = new SuggestionsStore();
  public favicons = new FaviconsStore();
  public addTab = new AddTabStore();
  public tabGroups = new TabGroupsStore();
  public tabs = new TabsStore();
  public overlay = new OverlayStore();
  public extensions = new ExtensionsStore();
  public downloads = new DownloadsStore();
  public weather = new WeatherStore();
  public addBookmark = new AddBookmarkStore();
  public autoFill = new AutoFillStore();
  public editAddress = new EditAddressStore();
  public startupTabs = new StartupTabsStore();

  @observable
  public theme = lightTheme;

  @observable
  public isAlwaysOnTop = false;

  @observable
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

  @observable
  public updateInfo = {
    available: false,
    version: '',
  };

  @observable
  public navigationState = {
    canGoBack: false,
    canGoForward: false,
  };

  @computed
  public get tabbarVisible() {
    return (
      this.tabGroups.currentGroup.tabs.length > 0 &&
      this.overlay.currentContent === 'default'
    );
  }

  @computed
  public get searchEngine() {
    return this.settings.object.searchEngines[
      this.settings.object.searchEngine
    ];
  }

  public canToggleMenu = false;

  public mouse = {
    x: 0,
    y: 0,
  };

  public windowId = getCurrentWindow().id;

  @observable
  public isIncognito = ipcRenderer.sendSync(`is-incognito-${this.windowId}`);

  public constructor() {
    ipcRenderer.on('update-navigation-state', (e, data) => {
      this.navigationState = data;
    });

    ipcRenderer.on('fullscreen', (e, fullscreen: boolean) => {
      this.isFullscreen = fullscreen;
    });

    ipcRenderer.on('html-fullscreen', (e, fullscreen: boolean) => {
      this.isHTMLFullscreen = fullscreen;
    });

    ipcRenderer.on('update-available', (e, version: string) => {
      this.updateInfo.version = version;
      this.updateInfo.available = true;
    });

    extensionsRenderer.on(
      'set-badge-text',
      (extensionId: string, details: chrome.browserAction.BadgeTextDetails) => {
        if (details.tabId) {
          const browserAction = this.extensions.queryBrowserAction({
            extensionId,
            tabId: details.tabId,
          })[0];

          if (browserAction) {
            browserAction.badgeText = details.text;
          }
        } else {
          this.extensions
            .queryBrowserAction({
              extensionId,
            })
            .forEach(item => {
              item.badgeText = details.text;
            });
        }
      },
    );

    ipcRenderer.on('toggle-overlay', () => {
      if (!this.overlay.isNewTab) {
        this.overlay.visible = !this.overlay.visible;
      }
    });

    ipcRenderer.on('find', () => {
      const tab = this.tabs.selectedTab;
      if (tab) {
        ipcRenderer.send(`find-show-${this.windowId}`, tab.id, tab.findInfo);
      }
    });

    ipcRenderer.send('update-check');

    requestAnimationFrame(() => {
      if (remote.process.argv.length > 1 && remote.process.env.ENV !== 'dev') {
        const path = remote.process.argv[1];
        const ext = extname(path);

        if (ext === '.html') {
          this.tabs.addTab({ url: `file:///${path}`, active: true });
        }
      }
    });
  }
}

export default new Store();
