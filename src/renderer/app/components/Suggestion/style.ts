import styled, { css } from 'styled-components';
import { body2, centerIcon } from '~/shared/mixins';
import { transparency } from '~/renderer/constants';

export const StyledSuggestion = styled.div`
  width: 100%;
  height: 48px;
  min-height: 48px;
  display: flex;
  position: relative;
  align-items: center;
  overflow: hidden;

  ${({ selected, hovered }: { selected: boolean; hovered: boolean }) => {
    let backgroundColor = 'transparent';
    if (selected) {
      backgroundColor = 'rgba(255, 255, 255, 0.06)';
    } else if (hovered) {
      backgroundColor = 'rgba(255, 255, 255, 0.03)';
    }
    return css`
      background-color: ${backgroundColor};
    `;
  }};
`;

export const PrimaryText = styled.div`
  ${body2()};
  margin-left: 16px;
  white-space: nowrap;
  color: white;
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
  color: white;
  padding-right: 16px;
  font-size: 13px;
  opacity: ${transparency.text.medium};
`;

export const Icon = styled.div`
  margin-left: 16px;
  width: 16px;
  min-width: 16px;
  height: 16px;
  ${centerIcon()};
`;

export const Dash = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  color: white;
  opacity: ${transparency.text.medium};
`;
