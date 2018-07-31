import { observer } from 'mobx-react';
import React from 'react';
import { Button, Icon } from './styles';
import Ripples from '../../../../components/Ripples';

interface Props {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  onMouseDown?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  size?: number;
  style?: any;
  icon: string;
  divRef?: (ref: HTMLDivElement) => void;
  disabled?: boolean;
  className?: string;
  children?: any;
}

@observer
export default class ToolbarButton extends React.Component<Props, {}> {
  public static defaultProps = {
    size: 20,
  };

  private ripples: Ripples;

  private ref: HTMLDivElement;

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseDown } = this.props;

    this.ripples.makeRipple(e.pageX, e.pageY);

    if (typeof onMouseDown === 'function') {
      onMouseDown(e);
    }
  };

  public componentDidMount() {
    this.forceUpdate();
  }

  public onMouseUp = () => {
    this.ripples.removeRipples();
  };

  public getSize = () => {
    if (this.ref) {
      return {
        height: this.ref.offsetHeight,
        width: this.ref.offsetWidth,
      };
    }
    return {
      height: 0,
      width: 0,
    };
  };

  public render() {
    const {
      icon, onClick, size, disabled, className, divRef, children,
    } = this.props;

    let { style } = this.props;

    style = { ...style };

    const { height, width } = this.getSize();

    return (
      <Button
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={onClick}
        className={className}
        style={style}
        innerRef={r => {
          this.ref = r;
          if (typeof divRef === 'function') {
            divRef(r);
          }
        }}
        disabled={disabled}
      >
        <Icon icon={icon} size={size} disabled={disabled} />
        <Ripples
          icon
          ref={r => (this.ripples = r)}
          color="#000"
          parentWidth={width}
          parentHeight={height}
          rippleTime={0.6}
          initialOpacity={0.1}
          size={38}
        />
        {children}
      </Button>
    );
  }
}
