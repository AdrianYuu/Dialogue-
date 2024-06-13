import { INotification, NotificationStatus } from "@renderer/interfaces/NotificationInterface";

interface NotificationProps {
  notification: INotification | null;
}

const NotificationComponent = (props: NotificationProps) => {

  const getNotificationClass = (status: NotificationStatus) => {
    return status === 'success' ? 'alert alert-success' : 'alert alert-error';
  };

  return (
    props.notification && (
      <div className={`toast toast-top toast-end ${getNotificationClass(props.notification.status)}`}>
        <span className="text-white">{props.notification.message}</span>
      </div>
    )
  );
};

export default NotificationComponent;
