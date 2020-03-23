import story, { canCreateComment } from './index.stories';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { decorateStory } from '../../utils/storybook';

describe('ArticleComments', () => {
  it('canCreateComment', async () => {
    render(decorateStory(canCreateComment, story));

    const commentInput = await screen.findByPlaceholderText(
      'Write a comment...'
    );

    const submitButton = await screen.findByText('Post Comment');

    fireEvent.change(commentInput, { target: { value: 'Hello world' } });

    await waitFor(async () => {
      fireEvent.click(submitButton);
    });

    const comment = await screen.findByText('Hello world', {
      selector: '.card-text > p',
    });

    expect(comment).toHaveTextContent('Hello world');
  });
});
