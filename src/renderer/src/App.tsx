import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { IMenu, MENU_LIST } from './settings/MenuSetting'
// import RouteCheck from './routes/RouteCheck'

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        {MENU_LIST.map((menu: IMenu) => (
          // <Route key={menu.path} element={<RouteCheck allowedRole={menu.roleAllowed} />}>
            <Route key={menu.path} path={menu.path} element={menu.element} />
          // </Route>
        ))}
      </Routes>
    </Router>
  )
}

export default App
