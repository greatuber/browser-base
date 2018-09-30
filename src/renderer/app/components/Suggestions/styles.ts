import styled, { css } from 'styled-components';

import { transparency } from '@/constants/renderer';
import { caption, shadows } from '@/mixins';
import { TOOLBAR_HEIGHT } from '@/constants/app';

export const StyledSuggestions = styled.div`
  width: 100%;
  color: rgba(0, 0, 0, ${transparency.light.primaryText});
  overflow: hidden;
  padding-bottom: 8px;
`;

export const Caption = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
  margin-left: 16px;
  opacity: ${transparency.light.secondaryText};
  ${caption()};
`;

export const Dial = styled.div`
  padding: 16px;
  justify-content: center;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'flex' : 'none'};
  `};
`;
