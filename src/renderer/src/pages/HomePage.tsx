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
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<string>('');
  const [userIds, setUserIds] = useState<string[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ status: string, message: string } | null>(null);

  const isQuantityValid = (quantity: string) => {
    const newQuantity = parseInt(quantity, 10);
    return !isNaN(newQuantity) && newQuantity > 0 && newQuantity <= 5;
  }

  const handleQuantityChange = (quantity: string) => {
    setQuantity(quantity);

    if (!isQuantityValid(quantity)) {
      const newQuantity = parseInt(quantity, 10);
      setUserIds(Array(newQuantity).fill(''));
    } else {
      setUserIds([]);
    }
  };

  const handleUserIdChange = (index: number, value: string) => {
    const newUserIds = [...userIds];
    newUserIds[index] = value;
    setUserIds(newUserIds);
  };

  const renderUserInputs = () => {
    return userIds.map((userId, index) => (
      <div key={index}>
        <InputForm
          label={`User #${index + 1}`}
          type="text"
          value={userId}
          placeholder="Enter User ID..."
          onChange={(value) => handleUserIdChange(index, value)}
        />
      </div>
    ));
  };

  const validateUserIds = (): boolean => {
    return userIds.length > 0 && userIds.every((id) => id.trim() !== '');
  };

  const handleCreateNewChat = async () => {
    if (!validateUserIds()) {
      setNotification({ status: 'failed', message: 'User ID must be filled' });
      return;
    }

    let chatTitle = '';
    const memberIds = [...userIds, user!.id];

    for (let i = 0; i < memberIds.length; i++) {
      try {
        const response = await apiGet(`http://localhost:8000/api/v1/users/get/${memberIds[i]}`);
        chatTitle += response.username + (i < memberIds.length - 1 ? ', ' : '');
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    }

    try {
      await apiPostWithUserIdHeader('http://localhost:8000/api/v1/chats/create', {
        memberIds,
        title: chatTitle
      }, user!.id);
      setIsOpen(false);
      setNotification({ status: 'success', message: 'Successfully created conversation' });
    } catch (error) {
      console.error('Failed to create chat', error);
      setNotification({ status: 'failed', message: 'Failed to create chat' });
    }
  };

  const fetchConversation = async (conversationId: string) => {
    try {
      const response = await apiGet(`http://localhost:8000/api/v1/chats/get/${conversationId}`);
      setConversation(response);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to fetch conversation', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmitChat = async () => {
    try {
      const response = await apiPost('http://127.0.0.1:5000/classify', { text });
      if (response.category === 'Not hateful') {
        const payload: MessagePayload = {
          SenderID: user!.id,
          ConversationID: conversation!.id,
          Content: text,
          ContentType: "TEXT"
        };
        await apiPost('http://localhost:8000/api/v1/chats/message', payload);
        setText('');
        await fetchConversation(conversation!.id);
        setNotification({ status: 'success', message: 'Message sent' });
      } else {
        setNotification({ status: 'failed', message: 'Please enter good words!' });
      }
    } catch (error) {
      console.error('Failed to send message', error);
      setNotification({ status: 'failed', message: 'Failed to send message' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await apiGetWithUserIdHeader(`http://localhost:8000/api/v1/chats/getForUser`, user!.id);
        setConversations(res);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      }
    };
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (conversation?.id) {
      const ws = new WebSocket(`ws://localhost:8000/api/v1/chats/ws/${conversation.id}`);
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
      return () => {
        ws.close();
      };
    }
  }, [conversation]);

  return (
    <div className="bg-gray-700 h-screen flex w-full">
      <div className="bg-gray-900 w-[8rem]">
        <div className="p-5 flex flex-col gap-5 h-full">
          <img
            src={DummyPP}
            alt="serverPic"
            className="rounded-full"
            onClick={() => setConversation(null)}
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
                  onChange={(value) => handleQuantityChange(value)}
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
              <p className="text-white">{conversation.title}</p>
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
      {notification && (
        <div className={`toast toast-top toast-end ${notification.status === 'success' ? 'alert alert-success' : 'alert alert-error'}`}>
          <span className="text-white">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default HomePage
