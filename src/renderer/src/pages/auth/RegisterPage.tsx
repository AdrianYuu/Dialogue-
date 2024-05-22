import InputForm from '@renderer/components/InputForm'
import { FormEvent, useEffect, useState } from 'react'
import Button from '../../components/Button'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const resetData = (): void => {
    setStatus('')
    setError('')
  }

  const validateFormData = (): boolean => {
    if (name === '' || email === '' || password === '' || confirmPassword == '') {
      setStatus('failed')
      setError('All field is required to be filled.')
      return false
    }

    return true
  }

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    resetData()

    if (!validateFormData()) return

    setStatus('success')
    setTimeout(() => {
      navigate('/auth/login')
    }, 1000)
  }

  useEffect(() => {
    resetData()
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-discord">
      <div className="w-[35rem] h-[43rem] bg-gray-700 rounded-3xl">
        <form className="flex flex-col p-[2rem]" onSubmit={handleSubmit}>
          <h1 className="font-semibold text-white text-3xl text-center mt-[2rem] mb-[2rem]">
            Create an Account
          </h1>
          <div className="flex flex-col gap-4 mb-[7rem]">
            <InputForm
              label="Name"
              type="text"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e)}
            />
            <InputForm
              label="Email"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e)}
            />
            <InputForm
              label="Password"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e)}
            />
            <InputForm
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e)}
            />
            <div className="flex flex-col gap-5 my-5">
              <Button label="Submit" type="submit" style="w-full btn btn-neutral" />
              <div className="flex gap-1 text-cyan-100 justify-center">
                <p>Already have an account? Click</p>
                <Link to="/auth/login" className="font-bold hover:underline">
                  Here
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="toast toast-end">
        {status && status === 'success' && (
          <div className="alert alert-success">
            <span className="text-white">Successfully register user data.</span>
          </div>
        )}
        {status && status === 'failed' && (
          <div className="alert alert-error">
            <span className="text-white">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
