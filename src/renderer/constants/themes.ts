import { ITheme } from '~/interfaces';
import { BLUE_500 } from './colors';

export const lightTheme: ITheme = {
  'toolbar.backgroundColor': '#fff',
  'toolbar.bottomLine.backgroundColor': 'rgba(0, 0, 0, 0.12)',
  'toolbar.lightForeground': false,
  'toolbar.separator.color': 'rgba(0, 0, 0, 0.12)',
  'tab.backgroundOpacity': 0.7,
  'tab.selectedHover.backgroundOpacity': 0.65,
  'tab.hover.backgroundOpacity': 0.9,
  'tab.selected.textColor': '#000',
  'tab.textColor': `rgba(0, 0, 0, 0.7)`,
  'tab.allowLightBackground': false,
  'control.backgroundColor': 'rgba(0, 0, 0, 0.08)',
  'control.hover.backgroundColor': 'rgba(0, 0, 0, 0.1)',
  'control.valueColor': '#000',
  'control.lightIcon': false,
  'switch.backgroundColor': 'rgba(0, 0, 0, 0.16)',
  'dialog.backgroundColor': '#fff',
  'dialog.separator.color': 'rgba(0, 0, 0, 0.12)',
  'menu.header.background':
    'linear-gradient(to bottom right, #00b0ff, #3d5afe)',
  'dialog.textColor': '#000',
  'dialog.lightForeground': false,
  'searchBox.subHeading.backgroundColor': '#fafafa',
  'searchBox.subHeading.textColor': 'rgba(0, 0, 0, 0.54)',
  'searchBox.input.backgroundColor': '#fff',
  'searchBox.input.lightForeground': false,
  'searchBox.input.textColor': '#000',
  'searchBox.suggestions.backgroundColor': '#fff',
  'searchBox.suggestions.lightForeground': false,
  'searchBox.suggestions.textColor': '#000',
  'pages.backgroundColor': '#fff',
  'pages.lightForeground': false,
  'pages.textColor': '#000',
  'dropdown.backgroundColor': '#fff',
  'pages.navigationDrawer1.backgroundColor': '#f5f5f5',
  'pages.navigationDrawer2.backgroundColor': '#fafafa',

  accentColor: BLUE_500,
  backgroundColor: '#fff',
};

export const darkTheme: ITheme = {
  'toolbar.backgroundColor': '#1c1c1c',
  'toolbar.bottomLine.backgroundColor': 'rgba(255, 255, 255, 0.08)',
  'toolbar.lightForeground': true,
  'toolbar.separator.color': 'rgba(255, 255, 255, 0.12)',
  'tab.backgroundOpacity': 0.6,
  'tab.hover.backgroundOpacity': 0.5,
  'tab.selectedHover.backgroundOpacity': 0.45,
  'tab.selected.textColor': '#fff',
  'tab.textColor': 'rgba(255, 255, 255, 0.54)',
  'tab.allowLightBackground': true,
  'control.backgroundColor': 'rgba(255, 255, 255, 0.1)',
  'control.hover.backgroundColor': 'rgba(255, 255, 255, 0.12)',
  'control.valueColor': '#fff',
  'control.lightIcon': true,
  'switch.backgroundColor': 'rgba(255, 255, 255, 0.24)',
  'dialog.backgroundColor': '#424242',
  'dialog.separator.color': 'rgba(255, 255, 255, 0.12)',
  'menu.header.background':
    'linear-gradient(to bottom right, #00b0ff, #3d5afe)',
  'dialog.textColor': '#fff',
  'dialog.lightForeground': true,
  'searchBox.subHeading.backgroundColor': 'rgba(0, 0, 0, 0.12)',
  'searchBox.subHeading.textColor': 'rgba(255, 255, 255, 0.54)',
  'searchBox.input.backgroundColor': '#424242',
  'searchBox.input.lightForeground': true,
  'searchBox.input.textColor': '#fff',
  'searchBox.suggestions.backgroundColor': '#424242',
  'searchBox.suggestions.lightForeground': true,
  'searchBox.suggestions.textColor': '#fff',
  'pages.backgroundColor': '#212121',
  'pages.lightForeground': true,
  'pages.textColor': '#fff',
  'dropdown.backgroundColor': '#424242',
  'pages.navigationDrawer1.backgroundColor': 'rgba(255, 255, 255, 0.1)',
  'pages.navigationDrawer2.backgroundColor': 'rgba(255, 255, 255, 0.05)',

  backgroundColor: '#1c1c1c',
  accentColor: BLUE_500,
};
