import { IConversation } from './ConversationInterface'
import { IUser } from './UserInterface'

export interface IMessage {
  id: string
  senderId: string
  sender: IUser
  conversationId: string
  conversation: IConversation
  content: string
  contentType: string
}
