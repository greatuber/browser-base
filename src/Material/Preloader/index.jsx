import React from 'react'

export default class Preloader extends React.Component {
  render () {
    const {
      className
    } = this.props

    return (
      <div className={'preloader ' + (className != null ? className : '')} style={this.props.style}>
        <svg className='preloader-indeterminate' viewBox='25 25 50 50'>
          <circle className='path' cx='50' cy='50' r='20' fill='none' strokeMiterlimit='10' />
        </svg>
      </div>
    )
  }
}
