interface INotification {
    status: NotificationStatus;
    message: string;
}

enum NotificationStatus {
    SUCCESS = 'success',
    FAILED = 'failed'
}

export { INotification, NotificationStatus };