import { AppWindow } from '../windows';
import { clipboard, nativeImage, Menu } from 'electron';
import { isURL, prefixHttp } from '~/utils';
import { saveAs, viewSource } from './common-actions';

export const getViewMenu = (
  appWindow: AppWindow,
  params: Electron.ContextMenuParams,
  webContents: Electron.WebContents,
) => {
  let menuItems: Electron.MenuItemConstructorOptions[] = [];

  if (params.linkURL !== '') {
    menuItems = menuItems.concat([
      {
        label: 'Open link in new tab',
        click: () => {
          appWindow.viewManager.create(
            {
              url: params.linkURL,
              active: false,
            },
            true,
          );
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Copy link address',
        click: () => {
          clipboard.clear();
          clipboard.writeText(params.linkURL);
        },
      },
      {
        type: 'separator',
      },
    ]);
  }

  if (params.hasImageContents) {
    menuItems = menuItems.concat([
      {
        label: 'Open image in new tab',
        click: () => {
          appWindow.viewManager.create(
            {
              url: params.srcURL,
              active: false,
            },
            true,
          );
        },
      },
      {
        label: 'Copy image',
        click: () => {
          const img = nativeImage.createFromDataURL(params.srcURL);

          clipboard.clear();
          clipboard.writeImage(img);
        },
      },
      {
        label: 'Copy image address',
        click: () => {
          clipboard.clear();
          clipboard.writeText(params.srcURL);
        },
      },
      {
        label: 'Save image as...',
        click: () => {
          webContents.downloadURL(params.srcURL);
        },
      },
      {
        type: 'separator',
      },
    ]);
  }

  if (params.isEditable) {
    menuItems = menuItems.concat([
      {
        role: 'undo',
      },
      {
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        role: 'cut',
      },
      {
        role: 'copy',
      },
      {
        role: 'pasteAndMatchStyle',
      },
      {
        role: 'paste',
      },
      {
        role: 'selectAll',
      },
      {
        type: 'separator',
      },
    ]);
  }

  if (!params.isEditable && params.selectionText !== '') {
    menuItems = menuItems.concat([
      {
        role: 'copy',
      },
    ]);

    const trimmedText = params.selectionText.trim();

    if (isURL(trimmedText)) {
      menuItems = menuItems.concat([
        {
          label: 'Go to ' + trimmedText,
          click: () => {
            appWindow.viewManager.create(
              {
                url: prefixHttp(trimmedText),
                active: true,
              },
              true,
            );
          },
        },
      ]);
    }
  }

  if (
    !params.hasImageContents &&
    params.linkURL === '' &&
    params.selectionText === '' &&
    !params.isEditable
  ) {
    menuItems = menuItems.concat([
      {
        label: 'Go back',
        accelerator: 'Alt+Left',
        enabled: webContents.canGoBack(),
        click: () => {
          webContents.goBack();
        },
      },
      {
        label: 'Go forward',
        accelerator: 'Alt+Right',
        enabled: webContents.canGoForward(),
        click: () => {
          webContents.goForward();
        },
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          webContents.reload();
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Save as...',
        accelerator: 'CmdOrCtrl+S',
        click: async () => {
          saveAs();
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'View page source',
        accelerator: 'CmdOrCtrl+U',
        click: () => {
          viewSource();
        },
      },
    ]);
  }

  menuItems.push({
    label: 'Inspect',
    accelerator: 'CmdOrCtrl+Shift+I',
    click: () => {
      webContents.inspectElement(params.x, params.y);

      if (webContents.isDevToolsOpened()) {
        webContents.devToolsWebContents.focus();
      }
    },
  });

  return Menu.buildFromTemplate(menuItems);
};
