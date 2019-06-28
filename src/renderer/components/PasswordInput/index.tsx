import * as React from 'react';

import { Textfield } from '../Textfield';
import { icons } from '~/renderer/constants';

interface Props {
  style?: any;
}

interface State {
  visible: boolean;
}

export class PasswordInput extends React.PureComponent<Props, State> {
  public state: State = {
    visible: false,
  };

  private ref = React.createRef<Textfield>();

  public onIconClick = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  public get value() {
    return this.ref.current.value;
  }

  public test() {
    return this.ref.current.test(str => str.trim().length !== 0);
  }

  public clear() {
    this.ref.current.clear();
  }

  render() {
    const { style } = this.props;
    const { visible } = this.state;

    return (
      <Textfield
        ref={this.ref}
        label="Password"
        inputType={visible ? 'text' : 'password'}
        icon={visible ? icons.invisible : icons.visible}
        onIconClick={this.onIconClick}
        style={style}
      />
    );
  }
}
