import styled, { css } from 'styled-components';
import typography from '../../../mixins/typography';
import opacity from '../../../defaults/opacity';
import images from '../../../mixins/images';

export const StyledSuggestion = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;

  ${({ selected, hovered }: { selected: boolean; hovered: boolean }) => {
    let backgroundColor = 'transparent';

    if (selected) backgroundColor = 'rgba(0, 0, 0, 0.08)';
    else if (hovered) backgroundColor = 'rgba(0, 0, 0, 0.04)';

    return css`
      background-color: ${backgroundColor};
    `;
  }};
`;

export const PrimaryText = styled.div`
  ${typography.body2()};
  margin-left: 64px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  opacity: ${opacity.light.primaryText};
`;

export const SecondaryText = styled.div`
  ${typography.body2()};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 16px;
  font-size: 13px;
  opacity: ${opacity.light.secondaryText};
`;

export const Icon = styled.div`
  position: absolute;
  left: 16px;
  width: 16px;
  height: 16px;
  ${images.center('16px', '16px')};
`;

export const Dash = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  opacity: ${opacity.light.secondaryText};
`;
