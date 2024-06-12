import { IMessage } from './MessageInterface'
import { IUser } from './UserInterface'

export interface IConversation {
  id: string
  title: string
  members: IUser[]
  messages: IMessage[]
}
