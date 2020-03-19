import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';

import api from '~/services/api';
import history from '~/services/history';
import factory from '../utils/factory';
import Login from '~/pages/Login';

const api_mock = new MockAdapter(api);

jest.mock('~/services/history');
history.push.mockImplementation(() => {});

describe('Login page', () => {
  beforeEach(async () => {
    localStorage.clear();
  });

  it('should be able to login', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = await factory.attrs('User');
    const token = faker.random.uuid();

    api_mock.onPost('sessions').reply(200, { user, token });

    const { getByTestId } = render(
      <Router history={history}>
        <Login />
      </Router>
    );

    fireEvent.change(getByTestId('email'), {
      target: { value: email },
    });

    fireEvent.change(getByTestId('password'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(localStorage.getItem('iheroes_user')).toBe(
      JSON.stringify({
        user,
        token,
      })
    );
    expect(history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('should be able to fail in validation', async () => {
    const email = faker.lorem.word();
    const password = faker.internet.password();
    const user = await factory.attrs('User');
    const token = faker.random.uuid();

    api_mock.onPost('sessions').reply(200, { user, token });

    const { getByTestId, getByText } = render(
      <Router history={history}>
        <Login />
      </Router>
    );

    fireEvent.change(getByTestId('email'), {
      target: { value: email },
    });

    fireEvent.change(getByTestId('password'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Email inválido')).toBeInTheDocument();
  });

  it('should not be able to login', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    api_mock.onPost('sessions').reply(400);

    const { getByTestId, getByText } = render(
      <Router history={history}>
        <Login />
      </Router>
    );

    fireEvent.change(getByTestId('email'), {
      target: { value: email },
    });

    fireEvent.change(getByTestId('password'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByText('Oops! Alguma coisa deu errado, tente novamente!')
    ).toBeInTheDocument();
  });
});
