import { render, fireEvent, screen } from '@testing-library/react';
import story, { renders, canUpdate } from './index.stories';
import { action } from '@storybook/addon-actions';
import { decorateStory } from '../../utils/storybook';

jest.mock('@storybook/addon-actions');

describe('ArticleUpdateButton', () => {
  it('does not render with insufficient access', async () => {
    render(decorateStory(renders, story));

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('goes to link on click', () => {
    render(decorateStory(canUpdate, story));

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(action('nextRouter.push')).toHaveBeenCalledWith(
      '/editor/[slug]',
      '/editor/a-simple-title',
      { shallow: undefined }
    );
  });
});
