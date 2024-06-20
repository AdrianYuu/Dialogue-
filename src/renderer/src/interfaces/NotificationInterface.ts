export interface INotification {
  status: NotificationStatus
  message: string
}

export enum NotificationStatus {
  SUCCESS = 'success',
  FAILED = 'failed'
}

// export { INotification, NotificationStatus }
