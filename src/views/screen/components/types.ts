export enum MessageStatus {
  info = 'info',
  waring = 'waring',
}

export interface IMessage {
  time: string
  title: string
  message: string
  status: MessageStatus
}
