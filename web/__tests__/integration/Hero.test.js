import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { act, render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';

import factory from '../utils/factory';
import api from '~/services/api';
import Heroes from '~/pages/Heroes';
import { getLabel } from '~/helpers/HeroStatuses';
import history from '~/services/history';

const api_mock = new MockAdapter(api);

describe('Heroes page', () => {
  it('should be able to get a list of heroes', async () => {
    const heroes = await factory.attrsMany('Hero', 3);

    api_mock.onGet('heroes').reply(200, heroes);

    let getByTestId;
    let getByText;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Heroes />
        </Router>
      );

      getByTestId = component.getByTestId;
      getByText = component.getByText;
    });

    heroes.forEach(hero => {
      expect(getByText(hero.name)).toBeInTheDocument();
      expect(getByTestId(`hero_rank_${hero._id}`)).toHaveTextContent(hero.rank);
      expect(
        getByText(
          hero.location.coordinates
            .slice()
            .reverse()
            .join(', ')
        )
      ).toBeInTheDocument();
      expect(getByTestId(`hero_status_${hero._id}`)).toHaveTextContent(
        getLabel(hero.status)
      );
    });
  });

  it('should be able to remove an hero', async () => {
    const [hero, ...rest] = await factory.attrsMany('Hero', 3);

    api_mock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onDelete(`/heroes/${hero._id}`)
      .reply(200);

    let queryByTestId;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Heroes />
        </Router>
      );

      getByTestId = component.getByTestId;
      queryByTestId = component.queryByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`hero_remove_${hero._id}`));
    });

    expect(queryByTestId(`hero_${hero._id}`)).not.toBeInTheDocument();
  });

  it('should not be able to remove an hero', async () => {
    const [hero, ...rest] = await factory.attrsMany('Hero', 3);

    api_mock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onDelete(`/heroes/${hero._id}`)
      .reply(404);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Heroes />
        </Router>
      );

      getByTestId = component.getByTestId;
      getByText = component.getByText;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`hero_remove_${hero._id}`));
    });

    expect(
      getByText('Não foi possivel remover o heroi, tente novamente!')
    ).toBeInTheDocument();
  });

  it('should be able to store a new hero', async () => {
    const { _id, name, rank, location, status } = await factory.attrs('Hero');

    api_mock
      .onGet('heroes')
      .reply(200, [])
      .onPost('heroes')
      .reply(200, { _id, name, rank, location, status });

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Heroes />
        </Router>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: location.coordinates[1] },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: location.coordinates[0] },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Heroi cadastrado com sucesso!')).toBeInTheDocument();
    expect(getByTestId(`hero_${_id}`)).toBeInTheDocument();
  });

  it('should not be able to store a new hero', async () => {
    const { name, rank, location, status } = await factory.attrs('Hero');

    api_mock
      .onGet('heroes')
      .reply(200, [])
      .onPost('heroes')
      .reply(400);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Heroes />
        </Router>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: location.coordinates[1] },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: location.coordinates[0] },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByText('Não foi possivel criar o heroi, tente novamente!')
    ).toBeInTheDocument();
  });

  it('should be able to edit an hero', async () => {
    const [
      hero,
      { name, rank, status, location },
      ...rest
    ] = await factory.attrsMany('Hero', 3);

    api_mock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onPut(`/heroes/${hero._id}`)
      .reply(200, { _id: hero._id, name, status, rank, location });

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Heroes />
        </Router>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`hero_edit_${hero._id}`));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: location.coordinates[1] },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: location.coordinates[0] },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Heroi atualizado com sucesso!')).toBeInTheDocument();
    expect(getByText(name)).toBeInTheDocument();
    expect(getByTestId(`hero_rank_${hero._id}`)).toHaveTextContent(rank);
    expect(
      getByText(
        location.coordinates
          .slice()
          .reverse()
          .join(', ')
      )
    ).toBeInTheDocument();
    expect(getByTestId(`hero_status_${hero._id}`)).toHaveTextContent(
      getLabel(status)
    );
  });

  it('should not be able to edit an hero', async () => {
    const [
      hero,
      { name, rank, status, location },
      ...rest
    ] = await factory.attrsMany('Hero', 3);

    api_mock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onPut(`/heroes/${hero._id}`)
      .reply(404);

    let getByText;
    let getByTestId;
    await act(async () => {
      const component = render(
        <Router history={history}>
          <Heroes />
        </Router>
      );

      getByText = component.getByText;
      getByTestId = component.getByTestId;
    });

    await act(async () => {
      fireEvent.click(getByTestId(`hero_edit_${hero._id}`));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: location.coordinates[1] },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: location.coordinates[0] },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByText('Não foi possivel atualizar o heroi, tente novamente!')
    ).toBeInTheDocument();
  });
});
