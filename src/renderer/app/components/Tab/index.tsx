import { observer } from 'mobx-react';
import React from 'react';

import Preloader from '../../../components/Preloader';
import Ripple from '../../../components/Ripple';
import {
  Circle,
  StyledTab,
  Content,
  Icon,
  Title,
  Close,
  Overlay,
  RightBorder,
} from './styles';
import { Tab } from '../../models';
import store from 'app-store';
import { closeWindow } from 'utils/window';
import { TAB_ANIMATION_DURATION } from 'constants/';
import { colors } from 'defaults';

@observer
export default class extends React.Component<{ tab: Tab }, {}> {
  private ripple: Ripple;

  public componentDidMount() {
    const { tab } = this.props;

    tab.setLeft(tab.getLeft(), false);
    tab.tabGroup.updateTabsBounds(true);

    const frame = () => {
      if (tab.ref != null) {
        const boundingRect = tab.ref.getBoundingClientRect();
        if (
          store.mouse.x >= boundingRect.left &&
          store.mouse.x <= boundingRect.left + tab.ref.offsetWidth &&
          store.mouse.y >= boundingRect.top &&
          store.mouse.y <= boundingRect.top + tab.ref.offsetHeight
        ) {
          if (!tab.hovered && !store.tabsStore.isDragging) {
            tab.hovered = true;
          }
        } else if (tab.hovered) {
          tab.hovered = false;
        }
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { pageX, pageY } = e;
    const { tab } = this.props;
    const { tabGroup } = tab;

    const selected = tabGroup.selectedTab === tab.id;

    store.addressBarStore.canToggle = selected;

    tab.select();

    store.tabsStore.lastMouseX = 0;
    store.tabsStore.isDragging = true;
    store.tabsStore.mouseStartX = pageX;
    store.tabsStore.tabStartX = tab.left;
    store.tabsStore.dragDirection = '';

    store.tabbarStore.lastScrollLeft = store.tabbarStore.ref.scrollLeft;

    this.ripple.makeRipple(pageX, pageY);
  };

  public onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  public onCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { tab } = this.props;
    const { tabGroup } = tab;
    const { tabs } = tabGroup;
    const selected = tabGroup.selectedTab === tab.id;

    e.stopPropagation();

    store.pagesStore.removePage(tab.id);

    store.tabsStore.resetRearrangeTabsTimer();

    const notClosingTabs = tabs.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(tab);

    tab.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = tabs[index - 1];
      tab.setLeft(previousTab.getNewLeft() + tab.getWidth(), true);
      tabGroup.updateTabsBounds(true);
    }

    tab.setWidth(0, true);
    tabGroup.setTabsLefts(true);

    store.extensionsStore.emitEvent('tabs', 'onRemoved', tab.id, {
      windowId: 0,
      isWindowClosing: false,
    });

    if (selected) {
      index = tabs.indexOf(tab);

      if (index + 1 < tabs.length && !tabs[index + 1].isClosing) {
        const nextTab = tabs[index + 1];
        nextTab.select();

        store.extensionsStore.emitEvent('tabs', 'onRemoved', tab.id, {
          windowId: 0,
          isWindowClosing: false,
        });
      } else if (index - 1 >= 0 && !tabs[index - 1].isClosing) {
        const prevTab = tabs[index - 1];
        prevTab.select();

        store.extensionsStore.emitEvent('tabs', 'onRemoved', tab.id, {
          windowId: 0,
          isWindowClosing: false,
        });
      } else if (store.tabsStore.groups.length === 1) {
        closeWindow();

        store.extensionsStore.emitEvent('tabs', 'onRemoved', tab.id, {
          windowId: 0,
          isWindowClosing: true,
        });
      }
    }

    setTimeout(() => {
      tabGroup.removeTab(tab.id);
    }, TAB_ANIMATION_DURATION * 1000);

    store.extensionsStore.emitEvent('tabs', 'onRemoved', tab.id, {
      windowId: 0,
      isWindowClosing: true,
    });
  };

  public onClick = () => {
    if (store.addressBarStore.canToggle) {
      store.addressBarStore.toggled = true;
    }
  };

  public render() {
    const { tab, children } = this.props;
    const { title, isClosing, hovered, favicon, loading, tabGroup } = tab;
    const { tabs } = tabGroup;

    const selected = tabGroup.selectedTab === tab.id;
    const tabIndex = tabs.indexOf(tab);

    let rightBorderVisible = true;

    if (
      hovered ||
      selected ||
      ((tabIndex + 1 !== tabs.length &&
        (tabs[tabIndex + 1].hovered ||
          tabGroup.selectedTab === tabs[tabIndex + 1].id)) ||
        tabIndex === tabs.length - 1)
    ) {
      rightBorderVisible = false;
    }

    return (
      <StyledTab
        selected={selected}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        isClosing={isClosing}
        visible={!store.addressBarStore.toggled}
        innerRef={(r: HTMLDivElement) => (tab.ref = r)}
      >
        <Content hovered={hovered} selected={selected}>
          {!loading && <Icon favicon={favicon.trim()} />}
          {loading && <Preloader thickness={6} size={16} />}
          <Title selected={selected} loading={loading} favicon={favicon}>
            {title}
          </Title>
        </Content>
        <Close
          onMouseDown={this.onCloseMouseDown}
          onClick={this.onCloseClick}
          hovered={hovered}
          selected={selected}
        >
          <Circle />
        </Close>
        {children}
        <Overlay hovered={hovered} selected={selected} />
        <Ripple
          rippleTime={0.6}
          ref={r => (this.ripple = r)}
          opacity={0.15}
          color={colors.blue['500']}
        />
        <RightBorder visible={rightBorderVisible} />
      </StyledTab>
    );
  }
}
