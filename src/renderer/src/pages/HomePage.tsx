import { useEffect, useState } from 'react'
import DummyPP from '@renderer/assets/images/dummypp.png'
import Arrow from '@renderer/assets/images/arrow.png'
import InputForm from '@renderer/components/InputForm'
import { apiGet, apiGetWithUserIdHeader, apiPost, apiPostWithUserIdHeader } from '@renderer/api/ApiService'
import useUser from '@renderer/contexts/UserContext'
import { IConversation } from '@renderer/interfaces/ConversationInterface'
import ChatBubble from './../components/ChatBubble'
import { useNavigate } from 'react-router-dom'
import { IMessage, MessagePayload } from '@renderer/interfaces/MessageInterface'

const HomePage = (): JSX.Element => {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState<string>('')
  const [userIds, setUserIds] = useState<string[]>([])
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [conversations, setConversations] = useState<IConversation[]>([])
  const [conversation, setConversation] = useState<IConversation | null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [text, setText] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    const getData = async () => {
      const res = await apiGetWithUserIdHeader(`http://localhost:8000/api/v1/chats/getForUser`, user!.id);
      console.log(res);

      setConversations(res)
    }
    getData()
  }, [user])

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/api/v1/chats/ws/${conversation?.id}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [conversation])

  const handleChangeQuantity = (quantity: string) => {
    setQuantity(quantity)
    const newQuantity = parseInt(quantity, 10)
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity < 6) {
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
          label={`User #${index + 1}`}
          type="text"
          value={userId}
          placeholder="Enter User ID..."
          onChange={(e) => handleChangeUserId(index, e)}
        />
      </div>
    ))
  }

  const validateUserId = () => {
    if (userIds.length === 0) return false
    for (let i = 0; i < userIds.length; i++) {
      if (userIds[i] === '') {
        return false
      }
    }
    return true
  }

  const resetData = (): void => {
    setStatus('')
    setError('')
  }

  const handleCreateNewChat = async () => {
    resetData()

    if (!validateUserId()) {
      setStatus('failed')
      setError('User ID must be filled')
      return
    }

    let chatTitle = ''
    let response

    const currentUserID = user!.id
    let temp = userIds
    temp = [...temp, currentUserID]

    for (let i = 0; i < temp.length; i++) {
      try {
        response = await apiGet(`http://localhost:8000/api/v1/users/get/${temp[i]}`)
      } catch (error) {
        console.log(error)
      }

      if (i != temp.length - 1) {
        chatTitle += response.username + ', '
      } else {
        chatTitle += response.username
      }
    }

    try {
      response = await apiPostWithUserIdHeader('http://localhost:8000/api/v1/chats/create', {
        memberIds: temp,
        title: chatTitle
      }, currentUserID)
    } catch (error) {
      console.log(error)
    }

    setIsOpen(false)
    setStatus('success')
  }

  const fetchConversation = (conversationId: string) => {
    try {
      apiGet(`http://localhost:8000/api/v1/chats/get/${conversationId}`).then((response) => {
        console.log(response);
        setConversation(response)
        // append 
        setMessages(response.messages)
      })
    } catch (error) { }
  }

  const resetConversation = () => {
    setConversation(null)
  }

  const handleInputChange = (e) => {
    setText(e.target.value)
  }

  const handleSubmitChat = async () => {
    resetData()

    let response = { category: 'Not hateful' }
    try {
      response = await apiPost('http://127.0.0.1:5000/classify', { text: text })
    } catch (error) { }

    if (response.category === 'Not hateful') {
      const payload: MessagePayload = {
        SenderID: user!.id,
        ConversationID: conversation!.id,
        Content: text,
        ContentType: "TEXT"
      };

      try {
        await apiPost('http://localhost:8000/api/v1/chats/message', payload)
      } catch (error) {
        console.log(error)
      }

      setStatus('success')
      setText('')
      fetchConversation(conversation!.id)
    } else if (response.category === 'Hateful') {
      setStatus('failed')
      setError('Please enter good words!')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="bg-gray-700 h-screen flex w-full">
      <div className="bg-gray-900 w-[8rem]">
        <div className="p-5 flex flex-col gap-5 h-full">
          <img
            src={DummyPP}
            alt="serverPic"
            className="rounded-full"
            onClick={() => resetConversation()}
          />
          <hr className="h-[3px] bg-gray-700 outline-none border-none rounded-xl" />
          <button className="btn" onClick={() => setIsOpen((prev) => !prev)}>
            +
          </button>
          <div>
            {conversations.map((conversation, idx) => (
              <div key={idx}>
                <button onClick={() => fetchConversation(conversation.id)}>
                  <img src={DummyPP} alt="serverPic" className="rounded-full" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-end h-full mb-[1.4rem]">
            <button onClick={handleLogout} className="btn btn-error text-white">
              Logout
            </button>
          </div>
          {isOpen && (
            <dialog className="modal" open>
              <div className="modal-box bg-gray-800">
                <h3 className="font-bold text-xl text-white">Create New Chat!</h3>
                <InputForm
                  label=""
                  type="text"
                  value={quantity}
                  placeholder="User Count (max: 5)"
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
      <div className="bg-gray-700 flex flex-col justify-between w-full gap-5">
        {conversation && (
          <>
            <div className="flex gap-3 items-center mb-2 bg-gray-600 p-5">
              <img src={DummyPP} alt="profilePic" className="rounded-full w-[3rem]" />
              <p className="text-white">{conversation?.title}</p>
            </div>
            <div className="flex flex-col gap-8 overflow-hidden p-5">
              <div className="overflow-auto">
                {messages.map((message, index) => (
                  <div key={index} className="mb-2">
                    <ChatBubble message={message} userId={user!.id} />
                  </div>
                ))}
              </div>

              <div className="flex items-center bg-gray-500 rounded-lg py-3 px-4 gap-5">
                <input
                  type="text"
                  className="bg-gray-500 w-full rounded-lg text-white text-lg outline-none"
                  value={text}
                  onChange={handleInputChange}
                />
                <button type="button" onClick={handleSubmitChat}>
                  <img src={Arrow} alt="" width={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="toast toast-top toast-end">
        {status && status === 'success' && (
          <div className="alert alert-success">
            <span className="text-white">Successfully create conversation.</span>
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

export default HomePage
