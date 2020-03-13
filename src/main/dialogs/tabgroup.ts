import { AppWindow } from '../windows';
import { TOOLBAR_HEIGHT } from '~/constants/design';
import { Dialog } from '.';

const WIDTH = 266;
const HEIGHT = 180;

export class TabGroupDialog extends Dialog {
  public visible = false;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'tabgroup',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: TOOLBAR_HEIGHT - 3,
      },
    });
  }

  public rearrange() {
    super.rearrange({ x: this.bounds.x - 20 });
  }

  public edit(tabGroup: any) {
    this.bounds.x = Math.round(tabGroup.x);
    super.show();
    this.webContents.send('visible', true, tabGroup);
  }
}
