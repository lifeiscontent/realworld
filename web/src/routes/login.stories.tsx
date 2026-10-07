import { GraphQLError } from 'graphql';
import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';
import { routes } from '../app/router';
import { LOGIN_MUTATION } from './login';

const meta = preview.meta({
  title: 'Pages/Login',
  parameters: { router: { routes, url: '/login' } },
});

export const Default = meta.story({
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: 'Sign in' });
  },
});

/** The action shows the validation errors of the API. */
export const InvalidCredentials = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: LOGIN_MUTATION,
            variables: { user: { email: 'jake@jake.jake', password: 'wrong' } },
          },
          result: {
            errors: [
              new GraphQLError('Unprocessable entity', {
                extensions: {
                  code: 'UNPROCESSABLE_ENTITY',
                  errors: { 'email or password': ['is invalid'] },
                },
              }),
            ],
          },
        },
      ],
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      await canvas.findByPlaceholderText('Email'),
      'jake@jake.jake'
    );
    await userEvent.type(canvas.getByPlaceholderText('Password'), 'wrong');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }));
    await expect(
      await canvas.findByText('email or password is invalid')
    ).toBeVisible();
  },
});
