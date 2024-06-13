import DummyPP from '@renderer/assets/images/dummypp.png'
import Arrow from '@renderer/assets/images/arrow.png'
import { IConversation } from '@renderer/interfaces/ConversationInterface';
import { IMessage } from '@renderer/interfaces/MessageInterface';
import ChatBubble from '../ChatBubble';
import { IUser } from '@renderer/interfaces/UserInterface';
import { useState } from 'react';

interface ChatWindowProps {
  user: IUser;
  conversation: IConversation;
  messages: IMessage[];

  onSubmitChat: () => void;
};

const ChatWindow = (props: ChatWindowProps) => {
  const [text, setText] = useState<string>('');

  const handleInputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmitChat = () => {
    props.onSubmitChat();
    setText('');
  };

  return (
    <div className="bg-gray-700 flex flex-col justify-between w-full gap-5">
      <>
        <div className="flex gap-3 items-center mb-2 bg-gray-600 p-5">
          <img src={DummyPP} alt="profilePic" className="rounded-full w-[3rem]" />
          <p className="text-white">{props.conversation.title}</p>
        </div>
        <div className="flex flex-col gap-8 overflow-hidden p-5">
          <div className="overflow-auto">
            {props.messages.map((message, index) => (
              <div key={index} className="mb-2">
                <ChatBubble message={message} userId={props.user.id} />
              </div>
            ))}
          </div>
          <div className="flex items-center bg-gray-500 rounded-lg py-3 px-4 gap-5">
            <input
              type="text"
              className="bg-gray-500 w-full rounded-lg text-white text-lg outline-none"
              value={text}
              onChange={handleInputchange}
            />
            <button type="button" onClick={handleSubmitChat}>
              <img src={Arrow} alt="" width={15} />
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default ChatWindow;
