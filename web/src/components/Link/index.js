import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Anchor } from './styles';

export default function Link({ children, to }) {
  const match = useRouteMatch({
    path: to,
    exact: true,
  });

  return (
    <div className={match ? 'active' : ''}>
      <Anchor to={to}>{children}</Anchor>
    </div>
  );
}

Link.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
