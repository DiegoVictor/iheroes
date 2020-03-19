import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import faker from 'faker';

import history from '~/services/history';
import Layout from '~/components/Layout';
import NotificationContext from '~/contexts/Notifications';

describe('Layout component', () => {
  it('should be able to close a notification', async () => {
    const id = faker.random.number();
    const title = faker.lorem.word();
    const message = faker.lorem.paragraph();
    const { getByTestId, getByText, queryByText, debug } = render(
      <Router history={history}>
        <Layout>
          <NotificationContext.Consumer>
            {({ update }) => (
              <button
                data-testid="update"
                onClick={() => {
                  update(notify => {
                    notify({ id, title, message, show: true });
                  });
                }}
              />
            )}
          </NotificationContext.Consumer>
        </Layout>
      </Router>
    );

    await act(async () => {
      fireEvent.click(getByTestId('update'));
    });

    await act(async () => {
      fireEvent.click(getByText('Close'));
    });

    expect(queryByText(title)).not.toBeInTheDocument();
    expect(queryByText(message)).not.toBeInTheDocument();
  });
});
