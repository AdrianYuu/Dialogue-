import { ReactNode, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Role } from '@renderer/constants/RoleConstant'
import useUser from '@renderer/contexts/UserContext'

interface IRouteCheck {
  allowedRole: Role
}

const RouteCheck = (routeCheck: IRouteCheck): ReactNode => {
  const navigate = useNavigate()
  const { user } = useUser()

  useEffect(() => {
    if (routeCheck.allowedRole === Role.UNAUTHORIZED) {
      if (user !== null) {
        navigate('/')
      }
    } else if (routeCheck.allowedRole === Role.USER) {
      if (user === undefined || user === null) {
        navigate('/auth/login')
      }
    }
  }, [])

  return <Outlet />
}

export default RouteCheck
