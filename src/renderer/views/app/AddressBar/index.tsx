import { observer } from 'mobx-react';
import React, { Component } from 'react';
import {
  Input, InputContainer, StyledAddressBar, Icon,
} from './styles';
import Suggestions from '../Suggestions';
import SuggestionItem from '../../../models/suggestion-item';
import store from '../../../store';
import { isURL, getAddressbarURL } from '../../../utils/url';
import { loadSuggestions } from '../../../utils/suggestions';
import icons from '../../../defaults/icons';

interface Props {
  visible: boolean;
}

@observer
export default class AddressBar extends Component<Props, {}> {
  private input: HTMLInputElement;

  private canSuggest = false;

  private visible = false;

  private lastSuggestion: SuggestionItem;

  public componentDidMount() {
    window.addEventListener('mousedown', () => {
      store.addressBar.toggled = false;
      store.suggestions = [];
    });
  }

  public onInputFocus = () => {
    this.input.select();
  };

  public autoComplete(text: string, suggestion: SuggestionItem) {
    const regex = /(http(s?)):\/\/(www.)?|www./gi;
    const regex2 = /(http(s?)):\/\//gi;

    const start = text.length;

    if (suggestion) {
      const { secondaryText } = suggestion;

      if (secondaryText.startsWith(text.replace(regex, ''))) {
        this.input.value = text + secondaryText.replace(text.replace(regex, ''), '');
      } else if (`www.${secondaryText}`.startsWith(text.replace(regex2, ''))) {
        this.input.value = text + `www.${secondaryText}`.replace(text.replace(regex2, ''), '');
      }
      this.input.setSelectionRange(start, this.input.value.length);
    }
  }

  public onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.keyCode;

    if (
      key !== 8 // backspace
      && key !== 13 // enter
      && key !== 17 // ctrl
      && key !== 18 // alt
      && key !== 16 // shift
      && key !== 9 // tab
      && key !== 20 // capslock
      && key !== 46 // delete
      && key !== 32 // space
    ) {
      this.canSuggest = true;
    } else {
      this.canSuggest = false;
    }

    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
      if (e.keyCode === 40 && store.selectedSuggestion + 1 <= store.suggestions.length - 1) {
        store.selectedSuggestion++;
      } else if (e.keyCode === 38 && store.selectedSuggestion - 1 >= 0) {
        store.selectedSuggestion--;
      }

      const suggestion = store.suggestions.find(x => x.id === store.selectedSuggestion);

      this.input.value = suggestion.isSearch ? suggestion.primaryText : suggestion.secondaryText;
    }
  };

  public onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13) {
      // Enter.
      const workspace = store.getCurrentWorkspace();
      const tab = workspace.getSelectedTab();

      e.preventDefault();

      const text = e.currentTarget.value;
      let url = text;

      if (isURL(text) && !text.includes('://')) {
        url = `http://${text}`;
      } else if (!text.includes('://')) {
        url = `https://www.google.com/search?q=${text}`;
      }

      this.input.value = url;

      const page = store.getPageById(tab.id);

      page.url = url;

      store.addressBar.toggled = false;
    }
  };

  public onInput = () => {
    if (this.canSuggest) {
      this.autoComplete(this.input.value, this.lastSuggestion);
    }

    loadSuggestions(this.input).then(suggestion => {
      this.lastSuggestion = suggestion;
      if (this.canSuggest) {
        this.autoComplete(this.input.value.substring(0, this.input.selectionStart), suggestion);
        this.canSuggest = false;
      }
    });

    store.selectedSuggestion = 0;
  };

  public getInputValue = () => {
    if (this.input != null) {
      return this.input.value;
    }
    return null;
  };

  public render() {
    const { visible } = this.props;
    const dictionary = store.dictionary.addressBar;

    if (store.addressBar.toggled && this.visible !== store.addressBar.toggled) {
      const page = store.getSelectedPage();
      if (page.webview != null && page.webview.getWebContents() != null) {
        this.input.value = getAddressbarURL(page.webview.getURL());
      }

      this.input.focus();
    }

    if (this.visible !== store.addressBar.toggled) {
      this.visible = store.addressBar.toggled;
    }

    const suggestionsVisible = store.suggestions.length !== 0;

    return (
      <StyledAddressBar
        visible={visible}
        suggestionsVisible={suggestionsVisible}
        onMouseDown={e => e.stopPropagation()}
      >
        <InputContainer suggestionsVisible={suggestionsVisible}>
          <Icon image={icons.search} />
          <Input
            suggestionsVisible={suggestionsVisible}
            innerRef={r => (this.input = r)}
            onFocus={this.onInputFocus}
            placeholder={dictionary.search}
            onInput={this.onInput}
            onKeyPress={this.onKeyPress}
            onKeyDown={this.onKeyDown}
          />
          <div style={{ clear: 'both' }} />
        </InputContainer>
        <Suggestions visible={visible} />
      </StyledAddressBar>
    );
  }
}
