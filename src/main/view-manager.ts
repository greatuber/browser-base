import { ipcMain } from 'electron';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { View } from './view';
import { AppWindow } from './windows';

export class ViewManager {
  public views: View[] = [];
  public selectedId = 0;
  public _fullscreen = false;

  public isHidden = false;
  public incognito: boolean;

  private interval: any;
  private window: AppWindow;

  public get fullscreen() {
    return this._fullscreen;
  }

  public set fullscreen(val: boolean) {
    this._fullscreen = val;
    this.fixBounds();
  }

  public constructor(window: AppWindow, incognito: boolean) {
    this.window = window;
    this.incognito = incognito;

    const { id } = window;
    ipcMain.on(
      `view-create-${id}`,
      (e, details: chrome.tabs.CreateProperties) => {
        this.create(details);
      },
    );

    ipcMain.on(`view-select-${id}`, (e, id: number, force: boolean) => {
      const view = this.views.find(x => x.webContents.id === id);
      this.select(id);
      view.updateNavigationState();

      if (force) this.isHidden = false;
    });

    ipcMain.on(`view-destroy-${id}`, (e, id: number) => {
      this.destroy(id);
    });

    ipcMain.on(`browserview-call-${id}`, async (e, data) => {
      const view = this.views.find(x => x.webContents.id === data.tabId);
      let scope: any = view;

      if (data.scope && data.scope.trim() !== '') {
        const scopes = data.scope.split('.');
        for (const s of scopes) {
          scope = scope[s];
        }
      }

      let result = scope.apply(view.webContents, data.args);

      if (result instanceof Promise) {
        result = await result;
      }

      if (data.callId) {
        this.window.webContents.send(
          `browserview-call-result-${data.callId}`,
          result,
        );
      }
    });

    ipcMain.on(`browserview-hide-${id}`, () => {
      this.hideView();
    });

    ipcMain.on(`browserview-show-${id}`, () => {
      this.showView();
    });

    ipcMain.on(`mute-view-${id}`, (e, tabId: number) => {
      const view = this.views.find(x => x.webContents.id === tabId);
      view.webContents.setAudioMuted(true);
    });

    ipcMain.on(`unmute-view-${id}`, (e, tabId: number) => {
      const view = this.views.find(x => x.webContents.id === tabId);
      view.webContents.setAudioMuted(false);
    });

    this.interval = setInterval(() => {
      for (const view of this.views) {
        if (view.isDestroyed()) return;

        const url = view.webContents.getURL();

        if (url !== view.url) {
          this.window.webContents.send(
            `view-url-updated-${view.webContents.id}`,
            url,
          );

          view.url = url;
          view.updateCredentials();
        }
      }
    }, 200);

    ipcMain.on(`browserview-clear-${id}`, () => {
      this.clear();
    });
  }

  public get selected() {
    return this.views.find(r => r.webContents.id === this.selectedId);
  }

  public get settingsView() {
    return this.views.find(r =>
      r.webContents.getURL().startsWith('wexond://settings'),
    );
  }

  public create(details: chrome.tabs.CreateProperties, isNext = false) {
    const view = new View(this.window, details.url, this.incognito);
    this.views.push(view);

    this.window.webContents.send(
      'api-tabs-create',
      { ...details },
      isNext,
      view.webContents.id,
    );

    return view;
  }

  public clear() {
    clearInterval(this.interval);
    this.window.setBrowserView(null);
    for (const view of this.views) {
      view.destroy();
    }
  }

  public select(id: number) {
    const selected = this.selected;
    const view = this.views.find(x => x.webContents.id === id);
    this.selectedId = id;

    if (!view || view.isDestroyed()) {
      this.destroy(id);
      this.window.removeBrowserView(view);
      return;
    }

    if (this.isHidden) return;

    this.window.removeBrowserView(selected);
    this.window.addBrowserView(view);

    this.window.menuDialog.hide();
    this.window.searchDialog.hide();
    this.window.findDialog.hide();

    this.fixBounds();
  }

  public fixBounds() {
    const view = this.selected;

    if (!view) return;

    const { width, height } = this.window.getContentBounds();
    view.setBounds({
      x: 0,
      y: this.fullscreen ? 0 : TOOLBAR_HEIGHT + 1,
      width,
      height: this.fullscreen ? height : height - TOOLBAR_HEIGHT,
    });
    view.setAutoResize({
      width: true,
      height: true,
    } as any);
  }

  public hideView() {
    this.isHidden = true;
    this.window.setBrowserView(null);
  }

  public showView() {
    this.isHidden = false;
    this.select(this.selectedId);
  }

  public destroy(id: number) {
    const view = this.views.find(x => x.webContents.id === id);

    this.views = this.views.filter(x => x.webContents.id !== id);

    if (view) {
      this.window.removeBrowserView(view);
      view.destroy();
    }
  }
}
