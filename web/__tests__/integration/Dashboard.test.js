import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import faker from 'faker';
import MockAdapter from 'axios-mock-adapter';
import { Router } from 'react-router-dom';

import api from '~/services/api';
import history from '~/services/history';
import factory from '../utils/factory';
import Dashboard from '~/pages/Dashboard';

const api_mock = new MockAdapter(api);

jest.mock('~/services/history');
history.push.mockImplementation(() => {});

describe('Dashboard page', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem(
      JSON.stringify({
        token: faker.random.uuid(),
      })
    );
  });

  it('should be able to get a list of monsters fighting and defeated', async () => {
    const fighting = await factory.attrsMany('Monster', 3, {
      status: 'fighting',
    });
    const defeated = await factory.attrsMany('Monster', 3, {
      status: 'defeated',
    });

    api_mock
      .onGet('monsters', {
        params: {
          status: 'fighting',
        },
      })
      .reply(200, fighting)
      .onGet('monsters', {
        params: {
          status: 'defeated',
        },
      })
      .reply(200, defeated);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    [...fighting, ...defeated].forEach(monster => {
      const [hero] = monster.heroes;

      expect(getByText(hero.name)).toBeInTheDocument();
      expect(getByTestId(`hero_rank_${hero._id}`)).toHaveTextContent(hero.rank);
      expect(getByText(monster.name)).toBeInTheDocument();
      expect(getByTestId(`monster_rank_${monster._id}`)).toHaveTextContent(
        monster.rank
      );
      expect(
        getByText(
          monster.location.coordinates
            .slice()
            .reverse()
            .join(', ')
        )
      );
    });
  });

  it('should be able to set a monster as defeated', async () => {
    const monster = await factory.attrs('Monster', {
      status: 'fighting',
    });

    api_mock
      .onGet('monsters', {
        params: {
          status: 'fighting',
        },
      })
      .reply(200, [monster])
      .onGet('monsters', {
        params: {
          status: 'defeated',
        },
      })
      .reply(200, [])
      .onPut(`/monsters/${monster._id}/defeated`)
      .reply(200);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`monster_defeated_${monster._id}`));
    });

    const [hero] = monster.heroes;
    fireEvent.change(getByTestId(`hero_status_${hero._id}`), {
      target: { value: 'resting' },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Ameaça atualizada com sucesso!')).toBeInTheDocument();
  });

  it('should not be able to set a monster as defeated', async () => {
    const monster = await factory.attrs('Monster', {
      status: 'fighting',
    });

    api_mock
      .onGet('monsters', {
        params: {
          status: 'fighting',
        },
      })
      .reply(200, [monster])
      .onGet('monsters', {
        params: {
          status: 'defeated',
        },
      })
      .reply(200, [])
      .onPut(`/monsters/${monster._id}/defeated`)
      .reply(404);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`monster_defeated_${monster._id}`));
    });

    const [hero] = monster.heroes;
    fireEvent.change(getByTestId(`hero_status_${hero._id}`), {
      target: { value: 'resting' },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByText('Não foi possivel atualizar o status da ameaça!')
    ).toBeInTheDocument();
  });
});
