import { render, screen, fireEvent } from '@testing-library/react';
import { action } from '@storybook/addon-actions';
import story, { renders, canDelete } from './index.stories';
import { decorateStory } from '../../utils/storybook';

jest.mock('@storybook/addon-actions');

describe('ArticleDeleteButton', () => {
  it('does not render with insufficient access', () => {
    render(decorateStory(renders, story));
    const button = screen.queryByText('Delete Article');

    expect(button).toBeNull();
  });

  it('calls onDelete on click', async () => {
    render(decorateStory(canDelete, story));
    const button = await screen.findByText('Delete Article');
    fireEvent.click(button);
    expect(action('onDelete')).toHaveBeenCalled();
  });
});
