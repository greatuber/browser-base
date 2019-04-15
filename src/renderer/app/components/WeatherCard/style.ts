import styled, { css } from 'styled-components';
import { centerIcon, overline } from '~/shared/mixins';

export const StyledCard = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  margin-bottom: 24px;
  border-radius: 30px;
  color: white;
  overflow: hidden;
  width: 264px;
`;

export const Header = styled.div`
  width: 100%;
  padding: 24px;
  background-image: linear-gradient(to bottom right, #64b5f6, #1e88e5);
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 8px;
`;

export const Degrees = styled.div`
  font-size: 64px;
  font-weight: 500;
  display: flex;
`;

export const Left = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Icon = styled.div`
  ${centerIcon()};
  width: 80px;
  height: 80px;
`;

export const SmallIcon = styled.div`
  ${centerIcon()};
  width: 32px;
  height: 32px;
  margin-top: 16px;
`;

export const Items = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Item = styled.div`
  display: flex;
  flex: 1;
  padding-top: 16px;
  padding-bottom: 16px;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

export const SmallDegrees = styled.div`
  font-size: 14px;

  ${({ night }: { night?: boolean }) => css`
    margin-top: ${night ? 4 : 16}px;
    opacity: ${night ? 0.54 : 1};
  `};
`;

export const Overline = styled.div`
  ${overline()};
`;
