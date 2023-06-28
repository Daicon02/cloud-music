import { HashRouter } from 'react-router-dom'
import { useRoutes } from 'react-router-dom'
import RouteList from './routes'
import { Provider } from 'react-redux'
import store from './store'
import { GlobalStyle } from './style'
import { IconStyle } from './assets/iconfont/iconfont'

const Pages = () => {
  const elements = useRoutes(RouteList)
  return elements
}

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle />
        <IconStyle />
        <Pages />
      </HashRouter>
    </Provider>
  )
}

export default App
