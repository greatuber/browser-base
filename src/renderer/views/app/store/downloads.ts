import { observable } from 'mobx';
import { ipcRenderer } from 'electron';

import { DownloadItem } from '~/interfaces';
import store from '.';

export class DownloadsStore {
  @observable
  public list: DownloadItem[] = [];

  constructor() {
    ipcRenderer.on('download-started', (e: any, item: DownloadItem) => {
      this.list.push(item);

      const not = new Notification(`Downloading ${item.fileName}`, {
        body: 'Open Overlay to see the downloads.',
      });

      not.onclick = () => {
        store.overlay.visible = true;
      };
    });

    ipcRenderer.on('download-progress', (e: any, item: DownloadItem) => {
      const i = this.list.find(x => x.id === item.id);
      i.receivedBytes = item.receivedBytes;
    });

    ipcRenderer.on('download-completed', (e: any, id: string) => {
      const i = this.list.find(x => x.id === id);
      i.completed = true;
    });
  }
}
