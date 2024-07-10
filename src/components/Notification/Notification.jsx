import './notification.css';

export const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type === 'error' ? 'errorNotification' : 'successNotification'}>{message}</div>;
};
