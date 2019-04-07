import styled from 'styled-components';
import { icons } from '../../constants';
import { centerImage } from '~/shared/mixins';

export const StyledTabGroups = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const AddTabGroup = styled.div`
  width: 32px;
  height: 32px;
  border: 1px solid black;
  opacity: 0.54;
  border-radius: 50px;
  ${centerImage('18px', '18px')};
  background-image: url(${icons.add});
  transition: 0.1s opacity;
  filter: invert(100%);
  margin-bottom: 8px;

  &:hover {
    opacity: 1;
  }
`;
