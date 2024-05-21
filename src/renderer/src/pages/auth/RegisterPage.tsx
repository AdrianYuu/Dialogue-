import InputForm from '@renderer/components/InputForm'
import { useState } from 'react'

const RegisterPage = (): JSX.Element => {
  const [username, setUsername] = useState<string>('')

  return (
    <div className="flex justify-center items-center min-h-screen bg-discord">
      <div className="w-[35rem] h-[40rem] bg-gray-700 rounded-3xl">
        <form className="flex flex-col p-[2rem]">
          <h1 className="font-semibold text-white text-3xl text-center mt-[2rem] mb-[2rem]">
            Create an account
          </h1>
          <div className="flex flex-col gap-3">
            <InputForm
              label="Username"
              type="text"
              value={username}
              placeholder="username"
              onChange={(e) => setUsername(e)}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
