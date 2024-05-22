import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { IMenu, MENU_LIST } from './settings/MenuSetting'
import RouteCheck from './routes/RouteCheck'
import { UserProvider } from './contexts/UserContext'

function App(): JSX.Element {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {MENU_LIST.map((menu: IMenu) => (
            <Route key={menu.path} element={<RouteCheck allowedRole={menu.roleAllowed} />}>
              <Route key={menu.path} path={menu.path} element={menu.element} />
            </Route>
          ))}
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
