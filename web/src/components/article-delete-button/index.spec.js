import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { action } from '@storybook/addon-actions';
import { renders, canDelete } from './index.stories';

jest.mock('@storybook/addon-actions');

describe('ArticleDeleteButton', () => {
  it('does not render with insufficient access', async () => {
    const { container } = render(renders());
    expect(container.children).toHaveLength(0);
  });

  it('calls onDelete on click', async () => {
    const { getByRole } = render(canDelete());
    await wait(() => {
      const button = getByRole('button');
      fireEvent.click(button);
      expect(action('onDelete')).toHaveBeenCalled();
    });
  });
});
