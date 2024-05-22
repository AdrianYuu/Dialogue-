import { Role } from '@renderer/constants/RoleConstant'
import LoginPage from '@renderer/pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import HomePage from '@renderer/pages/HomePage'

export interface IMenu {
  name: string
  path: string
  roleAllowed: Role
  element: JSX.Element
}

export const MENU_LIST: IMenu[] = [
  {
    name: 'home',
    path: '/',
    roleAllowed: Role.USER,
    element: <HomePage />
  },
  {
    name: 'register',
    path: '/auth/register',
    roleAllowed: Role.UNAUTHORIZED,
    element: <RegisterPage />
  },
  {
    name: 'login',
    path: '/auth/login',
    roleAllowed: Role.UNAUTHORIZED,
    element: <LoginPage />
  }
]
