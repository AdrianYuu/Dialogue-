import { IChildren } from '@renderer/interfaces/ChildrenInterface'
import { IUser } from '@renderer/interfaces/UserInterface'
import { createContext, useContext, useState } from 'react'

interface IUserContext {
  user: IUser | null
  login: (email: string, password: string) => boolean
}

const userContext = createContext<IUserContext>({} as IUserContext)

export function UserProvider({ children }: IChildren): JSX.Element {
  const USER_KEY = 'dialogue'

  const [user, setUser] = useState<IUser | null>(
    localStorage.getItem(USER_KEY)
      ? (JSON.parse(localStorage.getItem(USER_KEY) as string) as IUser)
      : null
  )

  function login(email: string, password: string): boolean {
    if (email === 'adrianyu@gmail.com' && password === 'adrian') {
      setUser({
        userId: 1,
        name: 'adrian',
        email: 'adrianyu@gmail.com',
        password: 'adrian',
        role: 'Admin'
      })
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          userId: 1,
          name: 'adrian',
          email: 'adrianyu@gmail.com',
          password: 'adrian',
          role: 'Admin'
        })
      )
      return true
    }

    setUser(null)
    return false
  }

  const data = { user, login }

  return <userContext.Provider value={data}>{children}</userContext.Provider>
}

export default function useUser(): IUserContext {
  return useContext(userContext)
}
