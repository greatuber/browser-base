import { AppWindow } from '../windows';
import { Dialog } from '.';
import { ipcMain } from 'electron';

const WIDTH = 350;

export class DownloadsDialog extends Dialog {
  public visible = false;

  private height = 0;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'downloads',
      bounds: {
        width: WIDTH,
        height: 0,
        y: 36,
      },
    });

    ipcMain.on(`height-${this.webContents.id}`, (e, height) => {
      this.height = height;
      this.rearrange();
    });
  }

  public rearrange() {
    const { width, height } = this.appWindow.getContentBounds();

    const maxHeight = height - 36 - 16;

    super.rearrange({
      x: width - WIDTH,
      height: Math.min(height, this.height + 16),
    });

    this.webContents.send(`max-height`, Math.min(maxHeight, this.height));
  }

  public show() {
    super.show();
    this.webContents.send('visible', true);
  }
}
