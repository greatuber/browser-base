import { UITheme } from '../enums';
import opacity from '../defaults/opacity';

export const getComponentColor = (
  color: string,
  toggled: boolean,
  disabled: boolean,
  theme: UITheme,
  returnOnlyAlpha: boolean = false,
) => {
  const isLightTheme = theme === UITheme.Light;
  const rgb = isLightTheme ? 0 : 255;

  let alpha;

  if (disabled) {
    alpha = isLightTheme ? opacity.light.disabledIcon : opacity.dark.disabledIcon;
  } else if (!toggled) {
    alpha = isLightTheme ? opacity.light.inactiveIcon : opacity.dark.inactiveIcon;
  }

  if (returnOnlyAlpha) return alpha;
  return alpha != null ? `rgba(${rgb}, ${rgb}, ${rgb}, ${alpha})` : color;
};

export const getComponentRippleColor = (color: string, toggled: boolean, theme: UITheme) => {
  if (toggled) return color;
  return theme === UITheme.Light ? '#000' : '#fff';
};

export const getComponentOpacity = (
  toggled: boolean,
  disabled: boolean,
  theme: UITheme,
  background: boolean = true,
  transparency?: any,
) => getComponentColor(null, toggled, disabled, theme, true);

export const getComponentForeground = (disabled: boolean, theme: UITheme) => {
  if (disabled) {
    if (theme === UITheme.Light) {
      return `rgba(0,0,0,${opacity.light.disabledIcon})`;
    }
    return `rgba(255,255,255,${opacity.dark.disabledIcon})`;
  }
  if (theme === UITheme.Light) {
    return `rgba(0,0,0,${opacity.light.inactiveIcon})`;
  }
  return `rgba(255,255,255,${opacity.dark.inactiveIcon})`;
};
