import * as React from 'react';
import { observer } from 'mobx-react';

import { Favicon, Remove, Title, Time, Site } from './style';
import { IHistoryItem } from '~/interfaces';
import store from '~/renderer/views/app/store';
import { ListItem } from '../../../components/ListItem';
import { formatTime } from '~/renderer/views/app/utils';

const onClick = (item: IHistoryItem) => (e: React.MouseEvent) => {
  if (!e.ctrlKey) return;

  const index = store.history.selectedItems.indexOf(item._id);

  if (index === -1) {
    store.history.selectedItems.push(item._id);
  } else {
    store.history.selectedItems.splice(index, 1);
  }
};

const onTitleClick = (url: string) => (e: React.MouseEvent) => {
  if (!e.ctrlKey) {
    store.tabs.addTab({ url, active: true });
    store.overlay.visible = false;
  }
};

const onRemoveClick = (item: IHistoryItem) => () => {
  store.history.removeItem(item._id);
};

export default observer(({ data }: { data: IHistoryItem }) => {
  const selected = store.history.selectedItems.includes(data._id);

  return (
    <ListItem key={data._id} onClick={onClick(data)} selected={selected}>
      <Favicon
        style={{
          backgroundImage: `url(${store.favicons.favicons[data.favicon]})`,
        }}
      />
      <Title onClick={onTitleClick(data.url)}>{data.title}</Title>
      <Site>{data.url.split('/')[2]}</Site>
      <Time>{formatTime(new Date(data.date))}</Time>
      <Remove onClick={onRemoveClick(data)} />
    </ListItem>
  );
});
