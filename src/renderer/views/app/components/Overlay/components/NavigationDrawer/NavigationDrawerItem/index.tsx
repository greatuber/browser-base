import * as React from 'react';
import { observer } from 'mobx-react';

import { StyledNavigationDrawerItem, Icon } from './style';

export const NavigationDrawerItem = observer(
  ({
    children,
    selected,
    onClick,
    icon,
  }: {
    children: any;
    selected?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    icon?: string;
  }) => {
    return (
      <StyledNavigationDrawerItem selected={selected} onClick={onClick}>
        {icon && <Icon style={{ backgroundImage: `url(${icon})` }} />}
        {children}
      </StyledNavigationDrawerItem>
    );
  },
);
