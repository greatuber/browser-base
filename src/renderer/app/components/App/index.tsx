import { observer } from 'mobx-react';
import * as React from 'react';
import { createGlobalStyle } from 'styled-components';

import { Style } from '~/renderer/app/style';
import { Toolbar } from '../Toolbar';
import { Overlay } from '../Overlay';
import { ipcRenderer } from 'electron';
import { Line, Screenshot, StyledApp } from './style';
import store from '../../store';
import { WindowsButtons } from '../WindowsButtons';
import { platform } from 'os';

const GlobalStyle = createGlobalStyle`${Style}`;

window.onbeforeunload = () => {
  ipcRenderer.send('browserview-clear');
};

export const App = observer(() => {
  return (
    <StyledApp>
      <GlobalStyle />
      <Toolbar />
      <Line />
      <Screenshot
        style={{
          backgroundImage: `url(${store.tabsStore.selectedTab &&
            store.tabsStore.selectedTab.screenshot})`,
          display: store.overlayStore.visible ? 'block' : 'none',
        }}
      />
      <Overlay />
      {platform() !== 'darwin' && <WindowsButtons />}
    </StyledApp>
  );
});
