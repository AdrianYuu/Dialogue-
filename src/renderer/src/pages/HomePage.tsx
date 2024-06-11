import { IUser } from '@renderer/interfaces/UserInterface'
import { DUMMY_USER_LIST } from '@renderer/seeders/UserDummy'
import { useEffect, useState } from 'react'
import DummyPP from '@renderer/assets/images/dummypp.png'
import Arrow from '@renderer/assets/images/arrow.png'
import InputForm from '@renderer/components/InputForm'
import { apiGet, apiPost } from '@renderer/api/ApiService'
import useUser from '@renderer/contexts/UserContext'

const HomePage = (): JSX.Element => {
  const [userList, setUserList] = useState<IUser[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [quantity, setQuantity] = useState<string>('')
  const [userIds, setUserIds] = useState<string[]>([])
  const { user } = useUser()

  useEffect(() => {
    setUserList(DUMMY_USER_LIST)
  }, [])

  const handleChangeQuantity = (quantity: string) => {
    setQuantity(quantity)
    const newQuantity = parseInt(quantity, 10)
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setUserIds(Array(newQuantity).fill(''))
    } else {
      setUserIds([])
    }
  }

  const handleChangeUserId = (index: number, value: string) => {
    const newUserIds = [...userIds]
    newUserIds[index] = value
    setUserIds(newUserIds)
  }

  const renderUserInputs = () => {
    return userIds.map((userId, index) => (
      <div key={index}>
        <InputForm
          label={`User ID #${index + 1}`}
          type="text"
          value={userId}
          placeholder="User ID"
          onChange={(e) => handleChangeUserId(index, e)}
        />
      </div>
    ))
  }

  const validateUserId = () => {
    for (let i = 0; i < userIds.length; i++) {
      if (userIds[i] === '') {
        return false
      }
    }

    return true
  }

  const handleCreateNewChat = async () => {
    if (!validateUserId()) return

    let chatTitle = ''
    let response

    const currentUserID = user!.id
    let temp = userIds
    temp = [...temp, currentUserID]

    for (let i = 0; i < temp.length; i++) {
      try {
        response = await apiGet(`http://localhost:8000/api/v1/users/get/${temp[i]}`)
      } catch (error) {}

      if (i != temp.length - 1) {
        chatTitle += response.username + ', '
      } else {
        chatTitle += response.username
      }
    }

    try {
      response = await apiPost('http://localhost:8000/api/v1/chats/create', {
        memberIds: temp,
        title: chatTitle
      })
    } catch (error) {}
  }

  return (
    <div className="bg-gray-700 h-screen flex w-full">
      <div className="bg-gray-900 w-[7%]">
        <div className="p-5 flex flex-col gap-5 mt-5">
          <img src={DummyPP} alt="serverPic" className="rounded-full" />
          <hr className="h-[3px] bg-gray-700 outline-none border-none rounded-xl" />
          <button className="btn" onClick={() => setIsOpen((prev) => !prev)}>
            +
          </button>
          {isOpen && (
            <dialog className="modal" open>
              <div className="modal-box bg-gray-800">
                <h3 className="font-bold text-xl text-white">Create new chat!</h3>
                <InputForm
                  label="User Count"
                  type="text"
                  value={quantity}
                  placeholder="User Count"
                  onChange={handleChangeQuantity}
                />

                {renderUserInputs()}

                <div className="modal-action">
                  <button className="btn" onClick={handleCreateNewChat}>
                    Create
                  </button>
                  <button className="btn" onClick={() => setIsOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          )}
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
                <p className="text-white font-semibold text-sm">{user.username}</p>
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
            <button type="button">
              <img src={Arrow} alt="" width={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
