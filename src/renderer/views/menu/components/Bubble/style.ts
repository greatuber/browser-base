import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { centerIcon } from '~/renderer/mixins';

export const StyledBubble = styled.div`
  border-radius: 16px;
  margin-top: 8px;
  padding: 16px 8px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${({ disabled, theme }: { disabled: boolean; theme: ITheme }) => css`
    pointer-events: ${disabled ? 'none' : 'inherit'};
    opacity: ${disabled ? 0.54 : 1};

    &:hover {
      background-color: ${theme['overlay.foreground'] === 'light'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)'};
    }
  `};
`;

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 16px;
  ${centerIcon(32)};
  transition: 0.2s filter;

  ${({
    invert,
    toggled,
    theme,
  }: {
    invert: boolean;
    toggled?: boolean;
    theme?: ITheme;
  }) => css`
    transition: ${theme.animations ? '0.2s filter' : 'none'};
    filter: ${invert || toggled ? 'invert(100%)' : 'none'};
  `}
`;

export const Circle = styled.div`
  width: 56px;
  height: 56px;
  overflow: hidden;
  background-color: #212121;
  border-radius: 50%;
  margin-bottom: 16px;
  ${centerIcon(32)};

  ${({ theme, toggled }: { theme?: ITheme; toggled?: boolean }) => css`
    transition: ${theme.animations ? '0.2s background-color' : 'none'};

    background-color: ${toggled
      ? theme.accentColor
      : theme['overlay.foreground'] === 'light'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.08)'};
  `}
`;

export const Title = styled.div`
  font-size: 13px;
  text-align: center;
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
