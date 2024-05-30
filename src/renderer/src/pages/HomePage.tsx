import { IUser } from '@renderer/interfaces/UserInterface'
import { DUMMY_USER_LIST } from '@renderer/seeders/UserDummy'
import { useEffect, useState } from 'react'
import DummyPP from '@renderer/assets/images/dummypp.png'
import { IServer } from '@renderer/interfaces/ServerInterface'
import { DUMMY_SERVER_LIST } from '@renderer/seeders/ServerDummy'

const HomePage = (): JSX.Element => {
  const [userList, setUserList] = useState<IUser[]>([])
  const [serverList, setServerList] = useState<IServer[]>([])

  useEffect(() => {
    setUserList(DUMMY_USER_LIST)
    setServerList(DUMMY_SERVER_LIST)
  }, [])

  return (
    <div className="bg-gray-700 h-screen flex w-full">
      <div className="bg-gray-900 w-[7%]">
        <div className="p-5 flex flex-col gap-5 mt-5">
          <img src={DummyPP} alt="serverPic" className="rounded-full" />
          <hr className="h-[3px] bg-gray-700 outline-none border-none rounded-xl" />
          {serverList.map((_, index) => (
            <div key={index}>
              <img src={DummyPP} alt="serverPic" className="rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-800 w-1/5">
        <h1 className="text-gray-400 font-semibold px-5 pt-5 mb-5 text-sm mt-2">DIRECT MESSAGES</h1>
        <hr className="h-[3px] bg-gray-900 outline-none border-none" />
        <div className="flex flex-col gap-4 p-5">
          {userList &&
            userList.map((user, index) => (
              <div key={index} className="flex gap-3 items-center hover:bg-gray-700 rounded-2xl">
                <img src={DummyPP} alt="profilePic" className="w-[2.5rem] rounded-full" />
                <p className="text-white font-semibold text-sm">{user.name}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="bg-gray-700 flex flex-col justify-between w-full p-5 gap-5">
        <div className="flex gap-3 items-center mb-2">
          <img src={DummyPP} alt="profilePic" className="rounded-full w-[3rem]" />
          <p className="text-white">Adrian</p>
        </div>
        <div className="flex flex-col gap-8 overflow-hidden">
          <div className="overflow-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
              <>
                <div className="chat chat-start">
                  <div className="chat-bubble">Its over Anakin, I have the high ground.</div>
                </div>
                <div className="chat chat-end">
                  <div className="chat-bubble">You underestimate my power!</div>
                </div>
              </>
            ))}
          </div>
          <div className="flex items-center bg-gray-500 rounded-lg py-3 px-4 gap-5">
            <input
              type="text"
              className="bg-gray-500 w-full rounded-lg text-white text-lg outline-none"
            />
            <p className="text-white font-bold text-3xl">{'>'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
