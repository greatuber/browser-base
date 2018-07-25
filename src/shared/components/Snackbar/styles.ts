import styled, { css } from 'styled-components';
import shadows from '../../mixins/shadows';
import opacity from '../../defaults/opacity';
import typography from '../../mixins/typography';

export const Root = styled.div`
  height: 48px;
  width: 344px;
  display: flex;
  align-items: center;
  box-shadow: ${shadows(6)};
  position: absolute;
  z-index: 9999;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, ${opacity.light.primaryText});
  transition: 0.2s bottom;
  will-change: transition, bottom;

  ${({ visible }: { visible: boolean }) => css`
    bottom: ${visible ? 16 : -48}px;
  `};
`;

export const Content = styled.div`
  margin-left: 16px;
  flex: 1;
  ${typography.body2()};
  color: rgba(255, 255, 255, ${opacity.light.primaryText});
`;

export const Actions = styled.div`
  margin-right: 8px;
  margin-left: 8px;
`;
