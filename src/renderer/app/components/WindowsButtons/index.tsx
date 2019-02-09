import * as React from 'react';

import { icons } from '~/renderer/app/constants';
import { WindowsButton } from '../WindowsButton';
import {
  minimizeWindow,
  maximizeWindow,
  closeWindow,
} from '~/renderer/app/utils';

export const WindowsButtons = () => {
  return (
    <React.Fragment>
      <WindowsButton icon={icons.windowsMinimize} onClick={minimizeWindow} />
      <WindowsButton icon={icons.windowsMaximize} onClick={maximizeWindow} />
      <WindowsButton icon={icons.windowsClose} onClick={closeWindow} isClose />
    </React.Fragment>
  );
};
