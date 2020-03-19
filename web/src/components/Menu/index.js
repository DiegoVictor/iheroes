import React from 'react';
import { Nav } from 'react-bootstrap';

import { Container } from './styles';
import history from '~/services/history';
import Link from '~/components/Link';

export default function Menu() {
  return (
    <Container activeKey={history.action}>
      <Nav.Item>
        <Link to="/dashboard">Ameaças</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/heroes">Herois</Link>
      </Nav.Item>
    </Container>
  );
}
