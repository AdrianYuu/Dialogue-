import { apiGet } from '@renderer/api/ApiService'
import { IChildren } from '@renderer/interfaces/ChildrenInterface'
import { IUser } from '@renderer/interfaces/UserInterface'
import { createContext, useContext, useState } from 'react'

interface IUserContext {
  user: IUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const userContext = createContext<IUserContext>({} as IUserContext)

export function UserProvider({ children }: IChildren): JSX.Element {
  const USER_KEY = 'dialogue'

  const [user, setUser] = useState<IUser | null>(
    localStorage.getItem(USER_KEY)
      ? (JSON.parse(localStorage.getItem(USER_KEY) as string) as IUser)
      : null
  )

  async function login(email: string, password: string): Promise<boolean> {
    let response

    try {
      response = await apiGet(
        `http://localhost:8000/api/v1/users/auth/login?email=${email}&password=${password}`
      )
    } catch (error) {
      setUser(null)
      return false
    }

    setUser({
      id: response.id,
      email: response.email,
      password: response.password,
      username: response.username,
      displayName: response.displayName
    })
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: response.id,
        email: response.email,
        password: response.password,
        username: response.username,
        displayName: response.displayName
      })
    )
    return true
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }

  const data = { user, login, logout }

  return <userContext.Provider value={data}>{children}</userContext.Provider>
}

export default function useUser(): IUserContext {
  return useContext(userContext)
}
