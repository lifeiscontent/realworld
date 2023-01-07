import { render } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './index.stories';

const { AsGuestWithInvalidFormShowsErrors, AsGuestWithValidFormCallsOnSubmit } =
  composeStories(stories);

describe('ArticleForm', () => {
  let onSubmit;

  beforeEach(() => {
    onSubmit = jest.fn();
  });

  // eslint-disable-next-line jest/expect-expect
  it('displays errors on submit', async () => {
    const { container } = render(
      <AsGuestWithInvalidFormShowsErrors onSubmit={onSubmit} />
    );

    await AsGuestWithInvalidFormShowsErrors.play({
      canvasElement: container,
      args: { onSubmit },
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('calls onSubmit when valid on submit', async () => {
    const { container } = render(
      <AsGuestWithValidFormCallsOnSubmit onSubmit={onSubmit} />
    );

    await AsGuestWithInvalidFormShowsErrors.play({
      canvasElement: container,
      args: { onSubmit },
    });
  });
});
