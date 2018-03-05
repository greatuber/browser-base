import React from 'react'

export default class Switch extends React.Component {
  constructor () {
    super()

    this.state = {
      thumbLeft: -2,
      toggled: false
    }

    this.toggled = false
  }

  onClick = (e) => {
    this.toggle()
  }

  toggle (flag = !this.state.toggled) {
    this.setState({
      thumbLeft: flag ? this.track.offsetWidth - this.thumb.offsetWidth + 2 : -2,
      toggled: flag
    })

    this.toggled = flag

    this.triggerEvent()
  }

  triggerEvent () {
    const onToggle = this.props.onToggle

    const e = {
      switch: this,
      toggled: this.toggled
    }

    if (typeof onToggle === 'function') onToggle(e)
  }

  render () {
    const thumbStyle = {
      left: this.state.thumbLeft
    }

    return (
      <div className={'material-switch ' + (this.state.toggled ? 'toggled' : '')} onClick={this.onClick}>
        <div className='track' ref={(r) => this.track = r} />
        <div className='thumb' ref={(r) => this.thumb = r} style={thumbStyle} />
      </div>
    )
  }
}
