import { IUser } from '@renderer/interfaces/UserInterface'
import { DUMMY_USER_LIST } from '@renderer/seeders/UserDummy'
import { useEffect, useState } from 'react'
import DummyPP from '@renderer/assets/images/dummypp.png'

const HomePage = (): JSX.Element => {
  const [userList, setUserList] = useState<IUser[]>([])

  useEffect(() => {
    setUserList(DUMMY_USER_LIST)
  }, [])

  return (
    <div className="bg-gray-700 h-screen flex w-full">
      <div className="bg-gray-800 w-1/5">
        <h1 className="text-gray-400 font-semibold px-5 pt-5 text-xl mt-2">Direct Message</h1>
        <div className="flex flex-col gap-4 p-5">
          {userList &&
            userList.map((user, index) => (
              <div
                key={index}
                className="flex gap-3 items-center p-2 hover:bg-gray-700 rounded-2xl"
              >
                <img src={DummyPP} alt="profilePic" className="w-[3rem] rounded-full" />
                <p className="text-white font-semibold text-sm">{user.name}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="bg-gray-700 flex flex-col justify-between w-[95%] p-5 gap-5">
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
