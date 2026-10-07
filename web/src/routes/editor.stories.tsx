import { GraphQLError } from 'graphql';
import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { routes } from '../app/router';
import { signIn, viewerMock } from '../stories/fixtures';
import { CREATE_ARTICLE_MUTATION } from './editor';

const meta = preview.meta({
  title: 'Pages/Editor',
  beforeEach: signIn,
  parameters: { router: { routes, url: '/editor' } },
});

/** A guest goes to the sign-in page. */
export const Guest = meta.story({
  beforeEach: () => undefined,
  play: async ({ canvas }) => {
    await canvas.findByRole('heading', { name: 'Sign in' });
  },
});

/** The action shows the validation errors of the API. */
export const ValidationErrors = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        viewerMock,
        {
          request: {
            query: CREATE_ARTICLE_MUTATION,
            variables: {
              article: {
                title: '',
                description: '',
                body: '',
                tagList: ['dragons'],
              },
            },
          },
          result: {
            errors: [
              new GraphQLError('Unprocessable entity', {
                extensions: {
                  code: 'UNPROCESSABLE_ENTITY',
                  errors: { title: ["can't be blank"] },
                },
              }),
            ],
          },
        },
      ],
    },
  },
  play: async ({ canvas, userEvent }) => {
    const tags = await canvas.findByRole('textbox', { name: 'Enter tags' });
    await userEvent.type(tags, 'dragons{Enter}');
    await expect(
      canvas.getByRole('button', { name: 'Remove tag dragons' })
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Publish Article' })
    );
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      "title can't be blank"
    );
  },
});
