import { IConversation } from './ConversationInterface'
import { IUser } from './UserInterface'

export interface IMessage {
  id: string
  sender_id: string
  sender: IUser
  conversationId: string
  conversation: IConversation
  content: string
  contentType: string
}


interface MessagePayload {
  SenderID: string;
  ConversationID: string;
  Content: string;
  ContentType: string;
}
