import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import {
  Form as Frm,
  Table,
  Row,
  Col,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';

import UserContext from '~/contexts/User';
import NotificationsContext from '~/contexts/Notifications';
import { getLabel } from '~/helpers/HeroStatuses';
import api from '~/services/api';
import Select from '~/components/Select';
import Input from '~/components/Input';
import Layout from '~/components/Layout';
import Modal from '~/components/Modal';
import { Container } from './styles';

export default () => {
  const [heroes, setHeroes] = useState([]);
  const [hero, setHero] = useState(null);
  const { token } = useContext(UserContext);
  const google_map_url = useMemo(() => '//www.google.com.br/maps/place/', []);

  const handleRemoveHero = useCallback(
    (id, notify) => {
      (async () => {
        try {
          await api.delete(`/heroes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setHeroes(heroes.filter(hero => hero._id !== id));
        } catch (err) {
          notify({
            id: new Date().getTime(),
            title: 'Erro',
            message: 'Não foi possivel remover o heroi, tente novamente!',
            show: true,
          });
        }
      })();
    },
    [heroes, token]
  );

  const handleHeroForm = useCallback(
    ({ name, rank, status, latitude, longitude }, notify) => {
      (async () => {
        if (hero._id) {
          try {
            const response = await api.put(
              `/heroes/${hero._id}`,
              { name, rank, status, latitude, longitude },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            notify({
              id: new Date().getTime(),
              title: 'Sucesso',
              message: 'Heroi atualizado com sucesso!',
              show: true,
            });
            setHeroes(
              heroes.map(h => {
                if (h._id === hero._id) {
                  return response.data;
                }
                return h;
              })
            );
          } catch (err) {
            notify({
              id: new Date().getTime(),
              title: 'Erro',
              message: 'Não foi possivel atualizar o heroi, tente novamente!',
              show: true,
            });
          }
        } else {
          try {
            const response = await api.post(
              'heroes',
              { name, rank, status, latitude, longitude },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            notify({
              id: new Date().getTime(),
              title: 'Sucesso',
              message: 'Heroi cadastrado com sucesso!',
              show: true,
            });
            setHeroes([...heroes, response.data]);
          } catch (err) {
            notify({
              id: new Date().getTime(),
              title: 'Erro',
              message: 'Não foi possivel criar o heroi, tente novamente!',
              show: true,
            });
          }
        }
        setHero(null);
      })();
    },
    [token, hero, heroes]
  );

  useEffect(() => {
    (async () => {
      const { data } = await api.get('heroes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHeroes(
        data.map(hero => ({
          ...hero,
          latitude: hero.location.coordinates[1],
          longitude: hero.location.coordinates[0],
        }))
      );
    })();
  }, [token]);

  return (
    <Layout>
      <Container fluid>
        <Row>
          <Col>
            <div className="text-right">
              <Button data-testid="new" onClick={() => setHero({})} size="sm">
                Novo
              </Button>
            </div>
            <NotificationsContext.Consumer>
              {({ update }) => (
                <>
                  <Table hover striped size="sm">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Rank</th>
                        <th>Localização</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {heroes.map(hero => (
                        <tr key={hero._id} data-testid={`hero_${hero._id}`}>
                          <td>{hero.name}</td>
                          <td data-testid={`hero_rank_${hero._id}`}>
                            {hero.rank}
                          </td>
                          <td>
                            <Link
                              to={`${google_map_url +
                                hero.location.coordinates[1]},${
                                hero.location.coordinates[0]
                              }`}
                              target="_blank"
                            >
                              {hero.location.coordinates
                                .slice()
                                .reverse()
                                .join(', ')}
                            </Link>
                          </td>
                          <td data-testid={`hero_status_${hero._id}`}>
                            {getLabel(hero.status)}
                          </td>
                          <td className="text-right">
                            <ButtonGroup>
                              <Button
                                data-testid={`hero_edit_${hero._id}`}
                                size="sm"
                                onClick={() => {
                                  setHero(hero);
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                data-testid={`hero_remove_${hero._id}`}
                                disabled={hero.status === 'fighting'}
                                size="sm"
                                onClick={() => {
                                  update(notify => {
                                    handleRemoveHero(hero._id, notify);
                                  });
                                }}
                              >
                                Remover
                              </Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Modal
                    title="Heroi"
                    show={!!hero}
                    onHide={() => setHero(null)}
                  >
                    <Form
                      initialData={hero}
                      onSubmit={data => {
                        update(notify => {
                          handleHeroForm(data, notify);
                        });
                      }}
                    >
                      <Frm.Group>
                        <Frm.Label>Nome</Frm.Label>
                        <Input
                          className="form-control"
                          name="name"
                          data-testid="name"
                        />
                      </Frm.Group>
                      <Frm.Group>
                        <Frm.Label>Rank</Frm.Label>
                        <Select
                          className="form-control"
                          name="rank"
                          data-testid="rank"
                        >
                          {['S', 'A', 'B', 'C'].map(rank => (
                            <option key={rank} value={rank}>
                              {rank}
                            </option>
                          ))}
                        </Select>
                      </Frm.Group>
                      <Row>
                        <Col>
                          <Frm.Group>
                            <Frm.Label>Latitude</Frm.Label>
                            <Input
                              className="form-control"
                              name="latitude"
                              data-testid="latitude"
                            />
                          </Frm.Group>
                        </Col>
                        <Col>
                          <Frm.Group>
                            <Frm.Label>Longitude</Frm.Label>
                            <Input
                              className="form-control"
                              name="longitude"
                              data-testid="longitude"
                            />
                          </Frm.Group>
                        </Col>
                      </Row>
                      {hero && hero.status !== 'fighting' && (
                        <Frm.Group>
                          <Frm.Label>Status</Frm.Label>
                          <Select
                            className="form-control"
                            name="status"
                            data-testid="status"
                          >
                            <option value="resting">Descasando</option>
                            <option value="out_of_combat">
                              Fora de Combate
                            </option>
                            <option value="patrolling">Patrulhando</option>
                          </Select>
                        </Frm.Group>
                      )}
                      <ButtonGroup>
                        <Button
                          data-testid="cancel"
                          variant="secondary"
                          onClick={() => setHero(null)}
                        >
                          Cancelar
                        </Button>
                        <Button data-testid="submit" type="submit">
                          Enviar
                        </Button>
                      </ButtonGroup>
                    </Form>
                  </Modal>
                </>
              )}
            </NotificationsContext.Consumer>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
