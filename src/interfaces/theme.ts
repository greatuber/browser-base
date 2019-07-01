export interface ITheme {
  'toolbar.backgroundColor': string;
  'toolbar.bottomLine.backgroundColor': string;
  'toolbar.icons.invert': boolean;
  'toolbar.separator.color': string;
  'tab.backgroundOpacity': number;
  'tab.selectedHover.backgroundOpacity': number;
  'tab.hover.backgroundColor': string;
  'tab.selected.textColor': string;
  'tab.textColor': string;
  'tab.allowLightBackground': boolean;
  'overlay.windowsButtons.invert': boolean;
  'overlay.backgroundColor': string;
  'overlay.section.backgroundColor': string;
  'overlay.foreground': 'light' | 'dark';
  'overlay.dialog.backgroundColor': string;
  'overlay.separator.color': string;
  'overlay.scrollbar.backgroundColor': string;
  'overlay.scrollbar.hover.backgroundColor': string;
  'toolbar.overlay.backgroundColor': string;
  'control.backgroundColor': string;
  'control.hover.backgroundColor': string;
  'control.valueColor': string;
  'control.icon': 'light' | 'dark';
  'switch.backgroundColor': string;
  accentColor: string;
  animations?: boolean;
}
