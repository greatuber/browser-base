import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledSuggestions } from './style';
import store from '~/renderer/views/app/store';
import { Suggestion } from '../Suggestion';

interface Props {
  visible: boolean;
}

const onMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const Suggestions = observer(({ visible }: Props) => {
  return (
    <StyledSuggestions
      visible={visible && store.settings.object.suggestions}
      onMouseDown={onMouseDown}
    >
      {store.suggestions.list.map(suggestion => (
        <Suggestion suggestion={suggestion} key={suggestion.id} />
      ))}
    </StyledSuggestions>
  );
});
