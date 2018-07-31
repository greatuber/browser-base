import { observer } from 'mobx-react';
import React from 'react';

import {
  Root, IconsContainer, Icon, Label, DeleteIcon, Input,
} from './styles';
import Workspace from '../../../../models/workspace';
import store from '../../../../store';

@observer
export default class extends React.Component<{ workspace: Workspace }, {}> {
  public static defaultProps = {
    selected: false,
  };

  public state = {
    inputVisible: false,
  };

  private input: HTMLInputElement;

  public onClick = () => {
    const { workspace } = this.props;

    store.selectedWorkspace = workspace.id;
  };

  public onDelete = (e?: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { workspace } = this.props;
    const { workspaces } = store;

    if (workspaces.length > 0) {
      let altWorkspaceIndex = workspaces.indexOf(workspace) + 1;

      if (altWorkspaceIndex === workspaces.length) {
        altWorkspaceIndex = workspaces.indexOf(workspace) - 1;
      }

      const altWorkspace = workspaces[altWorkspaceIndex];

      for (const tab of workspace.tabs) {
        store.pages.splice(store.pages.indexOf(store.getPageById(tab.id)), 1);
      }

      store.selectedWorkspace = altWorkspace.id;
      workspace.remove();
    }
  };

  public onLabelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.toggleInput(true);
  };

  public onInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  public onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    this.toggleInput(false);
  };

  public onInputKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.toggleInput(false);
    }
  };

  public toggleInput = (flag: boolean) => {
    const { workspace } = this.props;

    if (flag) {
      this.input.value = workspace.name;
      this.input.select();
    } else {
      const value = this.input.value;

      if (value.length > 0) {
        this.input.value = value;
        workspace.name = value;
      }
    }

    this.setState({ inputVisible: flag });
  };

  public render() {
    const { workspace } = this.props;
    const { inputVisible } = this.state;
    const { workspaces } = store;

    const selected = store.selectedWorkspace === workspace.id;
    const icons = workspace.getIcons();

    return (
      <Root onClick={this.onClick}>
        {workspaces.length > 1 && <DeleteIcon className="delete-icon" onClick={this.onDelete} />}
        <IconsContainer selected={selected}>
          {icons != null && icons.map((data: any, key: any) => <Icon key={key} src={data} />)}
        </IconsContainer>
        <Label onClick={this.onLabelClick}>{workspace.name}</Label>
        <Input
          innerRef={r => (this.input = r)}
          visible={inputVisible}
          onClick={this.onInputClick}
          onBlur={this.onInputBlur}
          onKeyPress={this.onInputKeypress}
        />
      </Root>
    );
  }
}
