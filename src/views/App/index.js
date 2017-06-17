import '../../app.scss'
import './global'
import Tabs from '../../components/Tabs'
import Component from '../../classes/Component'
import UI from '../../classes/UI'

class App extends Component {
  constructor() {
    super()
  }

  beforeRender() {
    window.app = this
    this.cursor = {}
  }

  render() {
    return (
      <div>
        <Tabs ref='tabs' />
        <div className='pages' ref='pages' />
      </div>
    )
  }

  afterRender() {
    this.elements.tabs.addTab()
  }
}

// Wait for sass load.
setTimeout(function () {
  UI.render(<App />, document.getElementById('app'))
}, 1)
