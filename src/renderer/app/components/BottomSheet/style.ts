import styled, { css } from 'styled-components';
import { shadows } from '~/shared/mixins';

export const StyledBottomSheet = styled.div`
  position: absolute;
  z-index: 99999;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  left: 50%;
  transform: translateX(-50%);
  transition: 0.15s top;
  width: 700px;
  color: black;
`;

export const SmallBar = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 20px;
  height: 4px;
  width: 32px;
  background-color: rgba(0, 0, 0, 0.12);
  margin-top: 8px;
`;
