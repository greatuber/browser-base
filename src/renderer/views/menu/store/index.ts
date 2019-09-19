import { ipcRenderer, remote } from 'electron';
import { observable } from 'mobx';
import { getTheme } from '~/utils/themes';
import { ISettings } from '~/interfaces';
import { DEFAULT_SETTINGS } from '~/constants';

export class Store {
  @observable
  public theme = getTheme('wexond-light');

  @observable
  public settings: ISettings = DEFAULT_SETTINGS;

  @observable
  public visible = true;

  @observable
  public id = remote.getCurrentWebContents().id;

  public constructor() {
    ipcRenderer.on('visible', (e, flag) => {
      this.visible = flag;
    });

    setTimeout(() => {
      this.visible = false;
    });

    window.addEventListener('blur', () => {
      if (this.visible) {
        setTimeout(() => {
          ipcRenderer.send(`hide-${this.id}`);
        });
      }
    });

    const obj = ipcRenderer.sendSync('get-settings-sync');
    this.updateSettings(obj);

    ipcRenderer.on('update-settings', (e, settings: ISettings) => {
      this.updateSettings(settings);
    });
  }

  public updateSettings(newSettings: ISettings) {
    this.settings = { ...this.settings, ...newSettings };

    requestAnimationFrame(() => {
      this.theme = getTheme(this.settings.theme);
    });
  }

  public async save() {
    ipcRenderer.send('save-settings', {
      settings: JSON.stringify(this.settings),
    });
  }
}

export default new Store();
