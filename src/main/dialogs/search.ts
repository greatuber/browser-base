import { AppWindow } from '../windows';
import { ipcMain } from 'electron';
import { Dialog } from '.';

const WIDTH = 800;
const HEIGHT = 56;

export class SearchDialog extends Dialog {
  private queueShow = false;

  public constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'search',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 48,
      },
      hideTimeout: 300,
    });

    ipcMain.on(`height-${this.webContents.id}`, (e, height) => {
      const { width } = this.appWindow.getContentBounds();
      super.rearrange({
        height: HEIGHT + height,
        x: Math.round(width / 2 - WIDTH / 2),
      });
    });

    ipcMain.on(`can-show-${this.webContents.id}`, () => {
      if (this.queueShow) this.show();
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

  public show() {
    this.appWindow.previewDialog.hide();

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

  public hide() {
    super.hide();
    this.queueShow = false;
    this.webContents.send('visible', false);
  }
}
