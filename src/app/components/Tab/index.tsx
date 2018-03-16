import { observer } from "mobx-react";
import React from "react";

// Mixins
import images from "../../../shared/mixins/images";

// Actions
import * as tabs from "../../actions/tabs";

// Interfaces
import { ITab, ITabGroup } from "../../interfaces";

// Constants and defaults
import { colors } from "nersent-ui";
import { TAB_MAX_WIDTH } from "../../constants/design";
import { tabAnimations } from "../../defaults/tabs";

// Utils
import { closeWindow } from "../../utils/window";

// Components
import { Ripples } from "nersent-ui";

// Styles
import { Close, StyledTab, Title } from "./styles";

import Store from "../../store";

interface IProps {
  key: number;
  tab: ITab;
  tabGroup: ITabGroup;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  styles?: any;
}

@observer
export default class Tab extends React.Component<IProps, {}> {
  private ripples: Ripples;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.makeRipple(e.pageX, e.pageY);
    this.props.onMouseDown(e);
  };

  public onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    this.ripples.removeRipples();
  };

  public onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  public close = (e: React.MouseEvent<HTMLDivElement>) => {
    const { tabGroup, tab } = this.props;

    const tabIndex = tabGroup.tabs.indexOf(tab);

    if (
      tabIndex + 1 < tabGroup.tabs.length &&
      !tabGroup.tabs[tabIndex + 1].isRemoving
    ) {
      tabGroup.selectedTab = tabGroup.tabs[tabIndex + 1].id;
    } else if (tabIndex - 1 >= 0 && !tabGroup.tabs[tabIndex - 1].isRemoving) {
      tabGroup.selectedTab = tabGroup.tabs[tabIndex - 1].id;
    } else {
      if (Store.tabGroups.length === 1) {
        closeWindow();
      }
    }

    if (tabs.getScrollingMode(tabGroup) || tab.width === TAB_MAX_WIDTH) {
      tab.isRemoving = true;
      tabs.animateTab(tab, "width", 0);

      tabs.setTabsWidths();
      tabs.setTabsPositions();

      setTimeout(() => {
        tabs.removeTab(tab);
      }, tabAnimations.left.duration * 1000);
    } else {
      tabs.removeTab(tab);
      tabs.setTabsWidths();
      tabs.setTabsPositions();
    }
  };

  public styles() {
    return {
      tab: {},
      title: {},
      close: {}
    };
  }

  public render() {
    const { selected, tab, tabGroup } = this.props;
    const { left, width, title, id, isRemoving } = tab;

    const styles = {
      ...this.styles(),
      ...this.props.styles
    };

    return (
      <StyledTab
        selected={selected}
        style={{ left, width, ...styles.tab }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        isRemoving={isRemoving}
      >
        <Title style={{ ...styles.title }}>{title}</Title>
        <Close
          onMouseDown={this.onCloseMouseDown}
          selected={selected}
          onClick={this.close}
          style={{ ...styles.close }}
        />
        <Ripples
          rippleTime={0.6}
          ref={r => (this.ripples = r)}
          color={colors.blue["500"]}
        />
      </StyledTab>
    );
  }
}
