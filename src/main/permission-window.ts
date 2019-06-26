import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { AppWindow } from './app-window';
import { TOOLBAR_HEIGHT } from '~/renderer/app/constants/design';

export class PermissionWindow extends BrowserWindow {
  constructor(public appWindow: AppWindow) {
    super({
      frame: false,
      resizable: false,
      width: 350,
      height: 200,
      transparent: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      skipTaskbar: true,
    });

    if (process.env.ENV === 'dev') {
      this.webContents.openDevTools({ mode: 'detach' });
      this.loadURL('http://localhost:4444/permissions.html');
    } else {
      this.loadURL(join('file://', app.getAppPath(), 'build/permissions.html'));
    }

    this.setParentWindow(this.appWindow);
  }

  public async requestPermission(
    name: string,
    url: string,
    details: any,
  ): Promise<boolean> {
    return new Promise(resolve => {
      this.rearrange();
      this.show();

      this.webContents.send('request-permission', { name, url, details });

      ipcMain.once('request-permission-result', (e: any, r: boolean) => {
        resolve(r);
        this.hide();
      });
    });
  }

  public rearrange() {
    const cBounds = this.appWindow.getContentBounds();
    this.setBounds({ x: cBounds.x, y: cBounds.y + TOOLBAR_HEIGHT } as any);
  }
}
