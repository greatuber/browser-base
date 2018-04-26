import * as React from 'react';
import styled, { StyledComponentClass } from 'styled-components';

import { shadows, typography } from 'nersent-ui';
import { center } from '../../mixins/images';
import { invertColors } from '../../mixins/icons';

export const StyledContainer = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 16px;
  cursor: pointer;

  &:first-child {
    margin-left: 24px;
  }
`;

export interface IStyledIcon {
  image: string;
}

export const StyledIcon = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props: IStyledIcon) => props.image});
  ${center('24px', 'auto')};
  ${invertColors()};
`;
