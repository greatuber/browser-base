import styled, { css } from 'styled-components';
import { transparency } from '~/renderer/constants';
import { ITheme } from '~/interfaces';
import { body2, centerIcon } from '~/renderer/mixins';

export const StyledSuggestion = styled.div`
  width: 100%;
  height: 38px;
  min-height: 38px;
  display: flex;
  position: relative;
  align-items: center;
  overflow: hidden;
  ${({
    selected,
    hovered,
    theme,
  }: {
    selected: boolean;
    hovered: boolean;
    theme?: ITheme;
  }) => {
    let backgroundColor = 'transparent';
    if (selected) {
      backgroundColor = theme['searchBox.lightForeground']
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.06)';
    } else if (hovered) {
      backgroundColor = theme['searchBox.lightForeground']
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.03)';
    }
    return css`
      background-color: ${backgroundColor};
    `;
  }};
`;

export const PrimaryText = styled.div`
  ${body2()};
  margin-left: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  opacity: ${transparency.text.high};
`;

export const SecondaryText = styled.div`
  ${body2()};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 16px;
  flex: 1;
  font-size: 13px;
  opacity: ${transparency.text.medium};
`;

export const Icon = styled.div`
  margin-left: 11px;
  width: 16px;
  min-width: 16px;
  height: 16px;
  ${centerIcon()};
`;

export const Dash = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  opacity: ${transparency.text.medium};
`;
