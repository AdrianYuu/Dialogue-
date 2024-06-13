import { useEffect, useState } from 'react'
import { apiGet, apiGetWithUserIdHeader, apiPost, apiPostWithUserIdHeader } from '@renderer/api/ApiService'
import useUser from '@renderer/contexts/UserContext'
import { IConversation } from '@renderer/interfaces/ConversationInterface'
import { useNavigate } from 'react-router-dom'
import { IMessage, MessagePayload } from '@renderer/interfaces/MessageInterface'
import { INotification, NotificationStatus } from '@renderer/interfaces/NotificationInterface'
import Sidebar from '@renderer/components/home/sidebar'
import ChatWindow from '@renderer/components/home/chatwindow'
import CreateChatModal from '@renderer/components/home/createchatdialog'
import NotificationComponent from '@renderer/components/notification'

const HomePage = (): JSX.Element => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<INotification | null>(null);

  const handlePostNotification = (status: NotificationStatus, message: string) => {
    const notification: INotification = {
      status,
      message
    };
    setNotification(notification);
  };

  const validateUserIds = (userIds: string[]): boolean => {
    const userIdsValid = userIds.length > 0 && userIds.every((id) => id.trim() !== '');
    if (!userIdsValid) {
      handlePostNotification(NotificationStatus.FAILED, 'Please enter valid user IDs');
    }

    return userIdsValid;
  };

  const generateChatTitle = async (userIds: string[]): Promise<string> => {
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

    return chatTitle;
  };

  const handleCreateNewChat = async (userIds: string[]) => {
    if (!validateUserIds(userIds)) {
      return;
    }

    try {
      const chatTitle = await generateChatTitle(userIds);
      const payload = {
        memberIds: [...userIds],
        title: chatTitle
      };

      await apiPostWithUserIdHeader('http://localhost:8000/api/v1/chats/create', payload, user!.id);
      setIsCreateModalOpen(false);

      handlePostNotification(NotificationStatus.SUCCESS, 'Successfully created conversation');
    } catch (error) {
      handlePostNotification(NotificationStatus.FAILED, 'Failed to create chat');
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

  const handleConversationSelect = async (id: string | null) => {
    if (id) {
      await fetchConversation(id);
      return;
    }

    setConversation(null);
    setMessages([]);
  };

  const validateChatProfaity = async (text: string): Promise<boolean> => {
    try {
      const response = await apiPost('http://127.0.0.1:5000/classify', { text });
      const isProfane = response.catch === 'Hateful';
      if (isProfane) {
        handlePostNotification(NotificationStatus.FAILED, 'Chat contains profanity');
      }
      
      return response.catch === 'Not hateful';
    } catch (error) {
      handlePostNotification(NotificationStatus.FAILED, 'Failed to validate chat');
      return false;
    }
  }

  const handleSubmitChat = async () => {
    try {
      const isProfane = await validateChatProfaity(text);
      if (!isProfane) {
        return;
      }

      const payload: MessagePayload = {
        SenderID: user!.id,
        ConversationID: conversation!.id,
        Content: text,
        ContentType: "TEXT"
      };
      await apiPost('http://localhost:8000/api/v1/chats/message', payload);

      setText('');
      await fetchConversation(conversation!.id);
      handlePostNotification(NotificationStatus.SUCCESS, 'Successfully sent message');
    } catch (error) {
      handlePostNotification(NotificationStatus.FAILED, 'Failed to send message');
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
        handlePostNotification(NotificationStatus.FAILED, 'Failed to fetch conversations');
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!conversation) {
      return;
    }

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
  }, [conversation]);

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }, [notification])

  return (
    <div className="bg-gray-700 h-screen flex w-full">
      <Sidebar
        conversations={conversations}
        onSelectConversation={handleConversationSelect}
        onToggleModal={() => setIsCreateModalOpen((prev) => !prev)}
        onLogout={handleLogout}
      />

      {conversation && user && (
        <ChatWindow
          user={user}
          conversation={conversation}
          messages={messages}
          onSubmitChat={handleSubmitChat}
        />
      )}

      <CreateChatModal
        isOpen={isCreateModalOpen}
        onCreateChat={handleCreateNewChat}
        onCloseModal={() => setIsCreateModalOpen(false)}
      />

      <NotificationComponent notification={notification} />
    </div>
  );
};

export default HomePage
