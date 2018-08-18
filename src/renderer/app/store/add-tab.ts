import store from '@app/store';

export class AddTabStore {
  public left = 0;

  public ref: HTMLDivElement;

  public setLeft(left: number, animation: boolean) {
    store.tabsStore.animateProperty('x', this.ref, left, animation);
    this.left = left;
  }
}
