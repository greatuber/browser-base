import { observer } from 'mobx-react';
import React from 'react';
import Item from '../Item';
import TreeBar from '../TreeBar';
import { Content, Container, Items } from './styles';
import store from '../../../store';

@observer
export default class Bookmarks extends React.Component {
  public async componentDidMount() {
    store.goToBookmarkFolder(-1);
  }

  public render() {
    const items = store.bookmarks.filter(x => x.parent === store.currentBookmarksTree);

    return (
      <React.Fragment>
        <TreeBar />
        <Content>
          <Container>
            {items.length > 0 && (
              <Items>
                {items.map(data => (
                  <Item data={data} key={data.id} />
                ))}
              </Items>
            )}
          </Container>
        </Content>
      </React.Fragment>
    );
  }
}
