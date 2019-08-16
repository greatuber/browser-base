import parse from 'node-bookmarks-parser';

import { IBookmark } from '~/interfaces';
import store from '../store';

export const getBookmarkTitle = (item: IBookmark) => {
  if (!item.static) return item.title;

  if (item.static === 'main') {
    return 'Bookmarks bar';
  }

  if (item.static === 'mobile') {
    return 'Mobile bookmarks';
  }

  if (item.static === 'pinned') {
    return 'Pinned tabs';
  }

  if (item.static === 'other') {
    return 'Other bookmarks';
  }

  return '';
};

export const addImported = async (
  arr: ReturnType<typeof parse>,
  parent: IBookmark = null,
) => {
  let order = 0;

  for (const item of arr) {
    if (item.nsRoot) {
      let folder: IBookmark = null;

      if (item.nsRoot === 'toolbar') {
        folder = store.bookmarks.list.find(x => x.static === 'main');
      } else if (item.nsRoot === 'menu') {
        folder = store.bookmarks.list.find(x => x.static === 'mobile');
      } else if (item.nsRoot === 'unsorted') {
        folder = store.bookmarks.list.find(x => x.static === 'other');
      }

      if (folder) {
        addImported(item.children, folder);
      }

      return;
    }

    const bookmark = await store.bookmarks.addItem({
      isFolder: item.type === 'folder',
      title: item.title,
      url: item.url,
      parent: parent && parent._id,
      children: [],
      favicon: item.icon,
      order,
    });

    if (parent) {
      parent.children.push(bookmark._id);
    }

    if (bookmark.isFolder) {
      addImported(item.children, bookmark);
    }

    order++;
  }
};
