import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import NotificationsContext from '~/contexts/Notifications';
import UserContext from '~/contexts/User';
import Notification from '~/components/Notification';
import Menu from '~/components/Menu';
import Theme, { Container, Notifications } from './styles';

export default function Layout({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { token } = useContext(UserContext);

  return (
    <Container>
      <Theme />
      <NotificationsContext.Provider
        value={{
          list: notifications,
          update: callback => {
            callback(notification => {
              setNotifications([...notifications, notification]);
            });
          },
        }}
      >
        <Notifications>
          {notifications.map(notification => (
            <Notification
              data-testid={`notification_${notification.id}`}
              key={notification.id}
              title={notification.title}
              message={notification.message}
              onClose={() => {
                setNotifications(
                  notifications.filter(n => n.id !== notification.id)
                );
              }}
              show={notification.show}
            />
          ))}
        </Notifications>
        {token && <Menu />}
        {children}
      </NotificationsContext.Provider>
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};
