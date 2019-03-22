import { observable, observe } from 'mobx';
import * as React from 'react';
import { TweenLite } from 'gsap';

import { Tab } from '~/renderer/app/models';

import {
  TAB_ANIMATION_DURATION,
  defaultTabOptions,
  TABS_PADDING,
  TOOLBAR_HEIGHT,
  TAB_ANIMATION_EASING,
} from '~/renderer/app/constants';

import HorizontalScrollbar from '~/renderer/app/components/HorizontalScrollbar';
import store from '.';
import { ipcRenderer } from 'electron';

export class TabsStore {
  @observable
  public isDragging: boolean = false;

  @observable
  public scrollbarVisible: boolean = false;

  @observable
  public selectedTabId: number;

  @observable
  public hoveredTabId: number;

  @observable
  public tabs: Tab[] = [];

  @observable
  public scrollable = false;

  public lastScrollLeft: number = 0;
  public lastMouseX: number = 0;
  public mouseStartX: number = 0;
  public tabStartX: number = 0;

  public scrollbarRef = React.createRef<HorizontalScrollbar>();
  public containerRef = React.createRef<HTMLDivElement>();

  private rearrangeTabsTimer = {
    canReset: false,
    time: 0,
    interval: null as any,
  };

  constructor() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);

    this.rearrangeTabsTimer.interval = setInterval(() => {
      // Set widths and positions for tabs 3 seconds after a tab was closed
      if (
        this.rearrangeTabsTimer.canReset &&
        this.rearrangeTabsTimer.time === 3
      ) {
        this.updateTabsBounds(true);
        this.rearrangeTabsTimer.canReset = false;
      }
      this.rearrangeTabsTimer.time++;
    }, 1000);

    ipcRenderer.on('tabs-resize', (e: any) => {
      this.updateTabsBounds(false);
    });

    ipcRenderer.on(
      'api-tabs-create',
      (e: any, options: chrome.tabs.CreateProperties) => {
        this.addTab(options);
      },
    );
  }

  public resetRearrangeTabsTimer() {
    this.rearrangeTabsTimer.time = 0;
    this.rearrangeTabsTimer.canReset = true;
  }

  public onResize = (e: Event) => {
    if (e.isTrusted) {
      store.tabsStore.updateTabsBounds(false);
    }
  };

  public get containerWidth() {
    if (this.containerRef.current) {
      return this.containerRef.current.offsetWidth;
    }
    return 0;
  }

  public get selectedTab() {
    return this.getTabById(this.selectedTabId);
  }

  public get hoveredTab() {
    return this.getTabById(this.hoveredTabId);
  }

  public getTabById(id: number) {
    return this.tabs.find(x => x.id === id);
  }

  public addTab(options = defaultTabOptions) {
    const tab = new Tab(options, store.tabGroupsStore.currentGroupId);
    this.tabs.push(tab);

    this.emitEvent('onCreated', tab.getApiTab());

    requestAnimationFrame(() => {
      tab.setLeft(tab.getLeft(), false);
      this.updateTabsBounds(true);

      this.scrollbarRef.current.scrollToEnd(TAB_ANIMATION_DURATION * 1000);
    });

    return tab;
  }

  public removeTab(id: number) {
    (this.tabs as any).remove(this.getTabById(id));
  }

  public updateTabsBounds(animation: boolean) {
    this.setTabsWidths(animation);
    this.setTabsLefts(animation);
  }

  public setTabsWidths(animation: boolean) {
    const tabs = this.tabs.filter(
      x => !x.isClosing && x.tabGroupId === store.tabGroupsStore.currentGroupId,
    );

    const containerWidth = this.containerWidth;

    for (const tab of tabs) {
      const width = tab.getWidth(containerWidth, tabs);
      tab.setWidth(width, animation);

      this.scrollable = width === 72;
    }
  }

  public setTabsLefts(animation: boolean) {
    const tabs = this.tabs
      .filter(
        x =>
          !x.isClosing && x.tabGroupId === store.tabGroupsStore.currentGroupId,
      )
      .slice()
      .sort((a, b) => a.position - b.position);

    const { containerWidth } = store.tabsStore;

    let left = 0;

    for (const tab of tabs) {
      tab.setLeft(left, animation);

      left += tab.width + TABS_PADDING;
    }

    store.addTabStore.setLeft(
      Math.min(left, containerWidth + TABS_PADDING),
      animation,
    );
  }

  public replaceTab(firstTab: Tab, secondTab: Tab) {
    const position1 = firstTab.tempPosition;

    secondTab.setLeft(firstTab.getLeft(true), true);

    firstTab.tempPosition = secondTab.tempPosition;
    secondTab.tempPosition = position1;
  }

  public getTabsToReplace(callingTab: Tab, direction: string) {
    let tabs = this.tabs
      .slice()
      .sort((a, b) => a.tempPosition - b.tempPosition);

    const index = tabs.indexOf(callingTab);

    if (direction === 'left') {
      for (let i = index - 1; i >= 0; i--) {
        const tab = tabs[i];
        if (callingTab.left <= tab.width / 2 + tab.left) {
          this.replaceTab(tabs[i + 1], tab);
          tabs = tabs.sort((a, b) => a.tempPosition - b.tempPosition);
        } else {
          break;
        }
      }
    } else if (direction === 'right') {
      for (let i = index + 1; i < tabs.length; i++) {
        const tab = tabs[i];
        if (callingTab.left + callingTab.width >= tab.width / 2 + tab.left) {
          this.replaceTab(tabs[i - 1], tab);
          tabs = tabs.sort((a, b) => a.tempPosition - b.tempPosition);
        } else {
          break;
        }
      }
    }
  }

  public onMouseUp = () => {
    const selectedTab = this.selectedTab;

    this.isDragging = false;

    for (const tab of this.tabs) {
      tab.position = tab.tempPosition;
    }

    this.setTabsLefts(true);

    if (selectedTab) {
      selectedTab.isDragging = false;
    }
  };

  public onMouseMove = (e: any) => {
    const tabGroup = store.tabGroupsStore.currentGroup;
    if (!tabGroup) return;

    const { selectedTab } = store.tabsStore;

    if (this.isDragging) {
      const container = this.containerRef;
      const {
        tabStartX,
        mouseStartX,
        lastMouseX,
        lastScrollLeft,
      } = store.tabsStore;

      const boundingRect = container.current.getBoundingClientRect();

      if (Math.abs(e.pageX - mouseStartX) < 5) {
        return;
      }

      store.canToggleMenu = false;
      selectedTab.isDragging = true;

      const newLeft =
        tabStartX +
        e.pageX -
        mouseStartX -
        (lastScrollLeft - container.current.scrollLeft);

      let left = Math.max(0, newLeft);

      if (
        newLeft + selectedTab.width >
        store.addTabStore.left + container.current.scrollLeft - TABS_PADDING
      ) {
        left =
          store.addTabStore.left -
          selectedTab.width +
          lastScrollLeft -
          TABS_PADDING;
      }

      selectedTab.setLeft(left, false);

      if (
        e.pageY > TOOLBAR_HEIGHT + 16 ||
        e.pageY < -16 ||
        e.pageX < boundingRect.left ||
        e.pageX - boundingRect.left > store.addTabStore.left
      ) {
        // TODO: Create a new window
      }

      this.getTabsToReplace(
        selectedTab,
        lastMouseX - e.pageX >= 1 ? 'left' : 'right',
      );

      this.lastMouseX = e.pageX;
    }
  };

  public animateProperty(
    property: string,
    obj: any,
    value: number,
    animation: boolean,
  ) {
    if (obj) {
      const props: any = {
        ease: animation ? TAB_ANIMATION_EASING : null,
      };
      props[property] = value;
      TweenLite.to(obj, animation ? TAB_ANIMATION_DURATION : 0, props);
    }
  }

  public emitEvent(name: string, ...data: any[]) {
    ipcRenderer.send('emit-tabs-event', name, ...data);
  }
}
