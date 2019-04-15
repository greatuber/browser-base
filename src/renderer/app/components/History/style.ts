import styled, { css } from 'styled-components';

import { centerIcon, shadows } from '~/shared/mixins';
import { icons } from '../../constants';
import { Button } from '~/renderer/components/Button';
import { platform } from 'os';

export const Sections = styled.div`
  margin-left: 300px;
  width: calc(100% - 300px);
  display: flex;
  flex-flow: column;
  align-items: center;
`;

export const DeletionDialog = styled.div`
  width: fit-content;
  height: 68px;
  background-color: #303030;
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  transform: translateX(150px);
  box-shadow: ${shadows(8)};
  will-change: opacity;
  transition: 0.15s opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const DeletionDialogLabel = styled.div`
  font-size: 14px;
`;
