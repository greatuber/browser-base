import { AppWindow } from '../windows';
import { ipcMain } from 'electron';
import { Dialog } from '.';
import { NEWTAB_URL } from '~/constants/tabs';

const WIDTH = 800;
const HEIGHT = 56;

export class SearchDialog extends Dialog {
  private queueShow = false;

  private lastHeight = 0;
  private isPreviewVisible = false;

  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'search',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 48,
      },
      hideTimeout: 300,
      devtools: false,
    });

    ipcMain.on(`height-${this.webContents.id}`, (e, height) => {
      const { width } = this.appWindow.getContentBounds();
      super.rearrange({
        height: this.isPreviewVisible
          ? Math.max(120, 56 + height)
          : 56 + height,
        x: Math.round(width / 2 - WIDTH / 2),
      });
      this.lastHeight = 56 + height;
    });

    ipcMain.on(`can-show-${this.webContents.id}`, () => {
      if (this.queueShow) this.show();
    });

    ipcMain.handle(`is-newtab-${this.webContents.id}`, () => {
      return appWindow.viewManager.selected
        ? appWindow.viewManager.selected.webContents
            .getURL()
            .startsWith(NEWTAB_URL)
        : false;
    });
  }

  public toggle() {
    if (!this.visible) this.show();
    else this.hide();
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    super.rearrange({ x: Math.round(width / 2 - WIDTH / 2) });
  }

  public rearrangePreview(toggle: boolean) {
    this.isPreviewVisible = toggle;
    if (toggle) {
      super.rearrange({
        height: Math.max(120, this.bounds.height),
      });
    } else {
      super.rearrange({
        height: this.lastHeight,
      });
    }
  }

  public show() {
    if (this.appWindow.dialogs.previewDialog.visible) {
      this.appWindow.dialogs.previewDialog.hide(true);
    }

    super.show();

    this.queueShow = true;

    const selected = this.appWindow.viewManager.selected;

    const url = selected.webContents.getURL();

    this.webContents.send('visible', true, {
      id: this.appWindow.viewManager.selectedId,
      url: url.startsWith('wexond-error') ? selected.errorURL : url,
    });

    this.appWindow.webContents.send('get-search-tabs');

    ipcMain.once('get-search-tabs', (e, tabs) => {
      this.webContents.send('search-tabs', tabs);
    });
  }

  public hide(bringToTop = false) {
    super.hide(bringToTop);
    this.queueShow = false;
  }
}
