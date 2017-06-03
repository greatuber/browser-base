function div (parent, data = {}) {
  let element = document.createElement('div')
  Object.assign(element, data)
  parent.appendChild(element)
  return element
}

function createElement (type, parent, data = {}) {
  let element = document.createElement(type)
  Object.assign(element, data)
  parent.appendChild(element)
  return element
}

Element.prototype.css = function (data, value = null) {
  if (typeof data === 'object') {
    for (var key in data) {
      if (key === 'top' || key === 'bottom' || key === 'left' || key === 'right' || key === 'width' || key === 'height' || key.indexOf('margin') !== -1) {
        if (typeof data[key] === 'number') {
          data[key] = data[key].toString() + 'px'
        }
      }
    }
    Object.assign(this.style, data)
  } else if (typeof data === 'string') {
    if (value != null) {
      if (data === 'top' || data === 'bottom' || data === 'left' || data === 'right' || data === 'width' || data === 'height' || data.indexOf('margin') !== -1) {
        if (typeof value === 'number') {
          value = value.toString() + 'px'
        }
      }
      this.style[data] = value
    } else {
      return this.style[data]
    }
  }
  return null
}