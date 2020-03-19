import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import {
  Form as Frm,
  Table,
  OverlayTrigger,
  Popover,
  Badge,
  Button,
  Row,
  Col,
  ButtonGroup,
} from 'react-bootstrap';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';

import NotificationsContext from '~/contexts/Notifications';
import UserContext from '~/contexts/User';
import api from '~/services/api';
import Input from '~/components/Input';
import Layout from '~/components/Layout';
import Modal from '~/components/Modal';
import Select from '~/components/Select';
import { Container } from './styles';

export default () => {
  const google_map_url = useMemo(() => '//www.google.com.br/maps/place/', []);
  const { token } = useContext(UserContext);
  const [monster, setMonster] = useState(null);
  const [monsters, setMonsters] = useState([]);
  const [history, setHistory] = useState([]);

  const reList = useCallback(() => {
    (async () => {
      const { data } = await api.get('monsters', {
        params: {
          status: 'fighting',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMonsters(data);
    })();
  }, [token]);

  const handleMonsterDefeated = useCallback(
    ({ heroes }, notify) => {
      (async () => {
        try {
          await api.put(
            `/monsters/${monster._id}/defeated`,
            { heroes },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setMonsters(monsters.filter(m => m._id !== monster._id));
          setHistory([...history, monster]);

          notify({
            id: new Date().getTime(),
            title: 'Sucesso',
            message: 'Ameaça atualizada com sucesso!',
            show: true,
          });
        } catch (err) {
          notify({
            id: new Date().getTime(),
            title: 'Erro',
            message: 'Não foi possivel atualizar o status da ameaça!',
            show: true,
          });
        }

        setMonster(null);
      })();
    },
    [history, monster, monsters, token]
  );

  useEffect(() => {
    (async () => await reList())();
    setInterval(reList, 60 * 1000);
  }, [reList]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('monsters', {
        params: {
          status: 'defeated',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(
        data.map(monster => ({
          ...monster,
          updatedAt: new Date(monster.updatedAt).toLocaleString(),
        }))
      );
    })();
  }, [token]);

  return (
    <Layout>
      <Container fluid>
        <h5 className="d-flex align-items-center">
          Combatendo{' '}
          <Badge className="ml-1" variant="primary">
            {monsters.length}
          </Badge>
        </h5>
        <Table hover striped size="sm">
          <thead>
            <tr>
              <th>Heroi(s)</th>
              <th>Ameaça</th>
              <th>Localização</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {monsters.map(monster => (
              <tr key={monster._id}>
                <td>
                  {monster.heroes.map(hero => (
                    <OverlayTrigger
                      key={hero._id}
                      trigger={['hover', 'focus']}
                      placement="bottom"
                      overlay={
                        <Popover>
                          <Popover.Title as="h3">{hero.name}</Popover.Title>
                          <Popover.Content>
                            <p>{hero.description}</p>
                          </Popover.Content>
                        </Popover>
                      }
                    >
                      <span>
                        {hero.name}
                        <Badge
                          data-testid={`hero_rank_${hero._id}`}
                          variant="secondary"
                        >
                          {hero.rank}
                        </Badge>
                      </span>
                    </OverlayTrigger>
                  ))}
                </td>
                <td>
                  <span className="d-flex align-items-center">
                    {monster.name}{' '}
                    <Badge
                      className="ml-1"
                      variant="secondary"
                      data-testid={`monster_rank_${monster._id}`}
                    >
                      {monster.rank}
                    </Badge>
                  </span>
                </td>
                <td>
                  <Link
                    to={`${google_map_url + monster.location.coordinates[1]},${
                      monster.location.coordinates[0]
                    }`}
                    target="_blank"
                  >
                    {monster.location.coordinates
                      .slice()
                      .reverse()
                      .join(', ')}
                  </Link>
                </td>
                <td className="text-right">
                  <Button
                    data-testid={`monster_defeated_${monster._id}`}
                    onClick={() => {
                      setMonster(monster);
                    }}
                    size="sm"
                  >
                    Ameaça combatida
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h5 className="d-flex mt-5 align-items-center">
          Combatidos
          <Badge className="ml-1" variant="primary">
            {history.length}
          </Badge>
        </h5>
        <Table hover striped size="sm">
          <thead>
            <tr>
              <th>Heroi(s)</th>
              <th>Ameaça</th>
              <th>Localização</th>
              <th>Última atualização</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  Sem resultados
                </td>
              </tr>
            )}
            {history.map(monster => (
              <tr key={monster._id}>
                <td>
                  {monster.heroes.map(hero => (
                    <OverlayTrigger
                      key={hero._id}
                      trigger={['hover', 'focus']}
                      placement="bottom"
                      overlay={
                        <Popover>
                          <Popover.Title as="h3">{hero.name}</Popover.Title>
                          <Popover.Content>
                            <p>{hero.description}</p>
                          </Popover.Content>
                        </Popover>
                      }
                    >
                      <div>
                        {hero.name}
                        <Badge variant="secondary">
                          <div data-testid={`hero_rank_${hero._id}`}>
                            {hero.rank}
                          </div>
                        </Badge>
                      </div>
                    </OverlayTrigger>
                  ))}
                </td>
                <td>
                  <span className="d-flex align-items-center">
                    {monster.name}{' '}
                    <Badge
                      className="ml-1"
                      variant="secondary"
                      data-testid={`monster_rank_${monster._id}`}
                    >
                      {monster.rank}
                    </Badge>
                  </span>
                </td>
                <td>
                  <Link
                    to={`${google_map_url + monster.location.coordinates[1]},${
                      monster.location.coordinates[0]
                    }`}
                    target="_blank"
                  >
                    {monster.location.coordinates
                      .slice()
                      .reverse()
                      .join(', ')}
                  </Link>
                </td>
                <td>{monster.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <NotificationsContext.Consumer>
          {({ update }) => (
            <Modal
              title="Ameaça"
              show={!!monster}
              onHide={() => setMonster(null)}
            >
              <Form
                initialData={monster}
                onSubmit={data => {
                  update(notify => {
                    handleMonsterDefeated(data, notify);
                  });
                }}
              >
                <Frm.Group>
                  <Frm.Label>Status do(s) herois após o combate:</Frm.Label>
                </Frm.Group>
                <Row>
                  {monster &&
                    monster.heroes.map((hero, index) => (
                      <Col xs={6} key={hero._id}>
                        <Frm.Group>
                          <Frm.Label>{hero.name}</Frm.Label>
                          <Input
                            type="hidden"
                            name={`heroes[${index}][_id]`}
                            defaultValue={hero._id}
                          />
                          <Select
                            className="form-control"
                            key={hero._id}
                            name={`heroes[${index}][status]`}
                            data-testid={`hero_status_${hero._id}`}
                          >
                            <option value="resting">Descansando</option>
                            <option value="patrolling">Patrulhando</option>
                            <option value="out_of_combat">
                              Fora de combate
                            </option>
                          </Select>
                        </Frm.Group>
                      </Col>
                    ))}
                </Row>
                <ButtonGroup>
                  <Button
                    data-testid="cancel"
                    variant="secondary"
                    onClick={() => setMonster(null)}
                  >
                    Cancelar
                  </Button>
                  <Button data-testid="submit" type="submit">
                    Enviar
                  </Button>
                </ButtonGroup>
              </Form>
            </Modal>
          )}
        </NotificationsContext.Consumer>
      </Container>
    </Layout>
  );
};
