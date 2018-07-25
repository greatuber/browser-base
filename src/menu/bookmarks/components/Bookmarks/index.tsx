import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import AppStore from '../../../../app/store';
import Store from '../../store';
import db from '../../../../shared/models/app-database';
import Item from '../Item';
import TreeBar from '../TreeBar';
import { Content, Container, Items } from './styles';

@observer
class Bookmarks extends React.Component {
  public componentDidMount() {
    this.loadBookmarks();
  }

  public loadBookmarks = async () => {
    db.favicons.each(favicon => {
      if (AppStore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
        AppStore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
      }
    });

    Store.goTo(-1);
  };

  public render() {
    const items = AppStore.bookmarks.filter(x => x.parent === Store.currentTree);

    return (
      <React.Fragment>
        <TreeBar />
        <Content>
          <Container>
            {items.length > 0 && (
              <Items>{items.map(data => <Item data={data} key={data.id} />)}</Items>
            )}
          </Container>
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(Bookmarks);
