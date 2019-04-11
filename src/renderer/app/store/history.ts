import * as Datastore from 'nedb';
import { observable, computed, action } from 'mobx';
import { HistoryItem, HistorySection } from '../models';
import { getPath } from '~/shared/utils/paths';
import { countVisitedTimes, compareDates, getSectionLabel } from '../utils';

interface IDateRange {
  min: number;
  max: number;
}

export class HistoryStore {
  public db = new Datastore({
    filename: getPath('storage/history.db'),
    autoload: true,
  });

  @observable
  public historyItems: HistoryItem[] = [];

  @observable
  public itemsLoaded = window.innerHeight / 48;

  @observable
  public range: IDateRange;

  @computed
  public get topSites() {
    const top1 = countVisitedTimes(this.historyItems);
    const newItems: HistoryItem[] = [];

    for (const item of top1) {
      if (item.times > 1) {
        newItems.push(item.item);
      }
    }

    return newItems.slice(0, 12);
  }

  constructor() {
    this.load();
  }

  public resetLoadedItems() {
    this.itemsLoaded = window.innerHeight / 48;
  }

  public getById(id: string) {
    return this.historyItems.find(x => x._id === id);
  }

  public async load() {
    await this.db
      .find({})
      .sort({ date: 1 })
      .exec((err: any, items: HistoryItem[]) => {
        if (err) return console.warn(err);

        this.historyItems = items;
      });
  }

  public addItem(item: HistoryItem) {
    return new Promise((resolve: (id: string) => void) => {
      this.db.insert(item, (err: any, doc: HistoryItem) => {
        if (err) return console.error(err);

        this.historyItems.push(doc);
        resolve(doc._id);
      });
    });
  }

  public removeItem(id: string) {
    this.historyItems = this.historyItems.filter(x => x._id !== id);

    this.db.remove({ _id: id }, err => {
      if (err) return console.warn(err);
    });
  }

  @computed
  public get historySections() {
    const list: HistorySection[] = [];
    let section: HistorySection;

    const max = Math.max(0, this.historyItems.length - this.itemsLoaded);

    for (let i = this.historyItems.length - 1; i >= max; i--) {
      const item = this.historyItems[i];
      const date = new Date(item.date);

      if (this.range) {
        if (date.getTime() >= this.range.max) {
          continue;
        } else if (date.getTime() <= this.range.min) {
          return list;
        }
      }

      if (compareDates(section && section.date, date)) {
        section.items.push(item);
      } else {
        section = {
          label: getSectionLabel(date),
          items: [item],
          date,
        };
        list.push(section);
      }
    }

    return list;
  }

  @action
  public select(
    range: 'all' | 'yesterday' | 'last-week' | 'last-month' | 'older',
  ) {
    const current = new Date(); // new Date(2019, 3, 21);
    const day = current.getDate();
    const month = current.getMonth();
    const year = current.getFullYear();
    let minDate: Date;
    let maxDate: Date;

    switch (range) {
      case 'yesterday': {
        minDate = new Date(year, month, day - 1, 0, 0, 0, 0);
        maxDate = new Date(year, month, day - 1, 23, 59, 59, 999);
        break;
      }
      case 'last-week': {
        // TODO
        minDate = new Date(year, month, day - current.getDay() - 6, 0, 0, 0, 0);

        console.clear();
        console.log(minDate);
        break;
      }
      case 'last-month': {
        minDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        maxDate = new Date(year, month - 1, 0, 0, 0, 0, 0);
        break;
      }
      case 'older': {
        // store.historyStore.maxDate = null;
        break;
      }
    }

    this.range = range !== 'all' && {
      min: minDate.getTime(),
      max: maxDate.getTime(),
    };

    this.itemsLoaded = window.innerHeight / 48;
  }
}
