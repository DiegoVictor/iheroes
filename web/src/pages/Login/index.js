import React, { useCallback, useContext } from 'react';
import { Container, Col, Row, Button, Form as Frm } from 'react-bootstrap';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import UserContext from '~/contexts/User';
import NotificationsContext from '~/contexts/Notifications';
import api from '~/services/api';
import history from '~/services/history';
import Layout from '~/components/Layout';
import Input from '~/components/Input';
import Box from '~/components/Box';

export default () => {
  const context = useContext(UserContext);
  const handleLogin = useCallback(
    ({ email, password }, notify) => {
      (async () => {
        try {
          const schema = Yup.object().shape({
            email: Yup.string()
              .email('Email inválido')
              .required('O email é obrigatório'),
            password: Yup.string().required('A senha é obrigatória'),
          });

          await schema.validate(
            { email, password },
            {
              abortEarly: false,
            }
          );

          const { data } = await api.post('sessions', { email, password });

          localStorage.setItem('iheroes_user', JSON.stringify(data));
          context.token = data.token;
          context.user = data.user;

          history.push('/dashboard');
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            notify({
              id: new Date().getTime(),
              title: 'Erro',
              message: err.message,
              show: true,
            });
          } else {
            notify({
              id: new Date().getTime(),
              title: 'Erro',
              message: 'Oops! Alguma coisa deu errado, tente novamente!',
              show: true,
            });
          }
        }
      })();
    },
    [context.token, context.user]
  );

  return (
    <Layout>
      <Container fluid className="h-100">
        <Row className="justify-content-center h-100">
          <Col className="d-flex align-items-center">
            <Box>
              <NotificationsContext.Consumer>
                {({ update }) => (
                  <Form
                    onSubmit={data =>
                      update(notify => {
                        handleLogin(data, notify);
                      })
                    }
                  >
                    <Frm.Group>
                      <Frm.Label>Email</Frm.Label>
                      <Input
                        data-testid="email"
                        type="email"
                        className="form-control form-control-lg"
                        name="email"
                      />
                    </Frm.Group>
                    <Frm.Group>
                      <Frm.Label>Senha</Frm.Label>
                      <Input
                        data-testid="password"
                        type="password"
                        className="form-control form-control-lg"
                        name="password"
                      />
                    </Frm.Group>

                    <Button data-testid="submit" type="submit" size="lg" block>
                      Entrar
                    </Button>
                  </Form>
                )}
              </NotificationsContext.Consumer>
            </Box>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
