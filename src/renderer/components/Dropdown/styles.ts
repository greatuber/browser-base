import styled, { css } from 'styled-components';

import { EASING_FUNCTION, transparency, icons } from '~/renderer/constants';
import { centerIcon, shadows } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const StyledDropdown = styled.div`
  width: 200px;
  height: 32px;
  position: relative;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['control.backgroundColor']};

    &:hover {
      background-color: ${theme['control.hover.backgroundColor']};
    }
  `}
`;

export const DropIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-left: auto;
  margin-right: 2px;
  opacity: ${transparency.icons.inactive};
  background-image: url(${icons.dropDown});
  transition: 0.2s ${EASING_FUNCTION} transform;
  ${centerIcon(24)};

  ${({ activated, theme }: { activated: boolean; theme: ITheme }) => css`
    transform: ${activated ? 'rotate(180deg)' : 'rotate(0deg)'};
    filter: ${theme['control.icon'] === 'dark' ? 'invert(100%)' : 'unset'};
  `}
`;

export const Value = styled.div`
  font-size: 13px;
  margin-left: 8px;
  color: rgba(0, 0, 0, ${transparency.text.high});

  ${({ theme }: { theme: ITheme }) => css`
    color: ${theme['control.valueColor']};
  `}
`;
