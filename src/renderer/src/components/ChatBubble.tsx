import { IMessage } from '@renderer/interfaces/MessageInterface'

interface IChatBubble {
  message: IMessage
  userId: string
}

const ChatBubble = ({ message, userId }: IChatBubble): JSX.Element => {
  return (
    <div>
      {message.senderId === userId ? (
        <div className="chat chat-end">
          <p className="text-white mb-1">{message.sender.username}</p>
          <div className="chat-bubble">{message.content}</div>
        </div>
      ) : (
        <div className="chat chat-start flex flex-col">
          <p className="text-white mb-1">{message.sender.username}</p>
          <div className="chat-bubble">{message.content}</div>
        </div>
      )}
    </div>
  )
}

export default ChatBubble
