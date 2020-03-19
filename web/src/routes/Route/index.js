import React from 'react';
import { Route as ReactRouterRoute, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import UserContext from '~/contexts/User';

export default function Route({
  privated,
  guest,
  component: Component,
  ...rest
}) {
  return (
    <UserContext.Consumer>
      {context => (
        <ReactRouterRoute
          {...rest}
          render={props => {
            if (!context.token) {
              if (privated) {
                return <Redirect to="/" />;
              }
            } else if (guest) {
              return <Redirect to="/dashboard" />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </UserContext.Consumer>
  );
}

Route.propTypes = {
  privated: PropTypes.bool,
  guest: PropTypes.bool,
  component: PropTypes.func.isRequired,
};

Route.defaultProps = {
  privated: false,
  guest: false,
};
