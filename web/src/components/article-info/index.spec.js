import React from 'react';
import { render, screen } from '@testing-library/react';
import { ArticleInfo } from '.';

describe('ArticleUpdateButton', () => {
  it('renders link with proper URL', async () => {
    render(
      <ArticleInfo
        createdAt={new Date(2000, 2, 1).toISOString()}
        author={{ username: 'lifeiscontent' }}
      />
    );
    const link = await screen.findByRole('link');

    expect(link).toHaveAttribute('href', '/user/lifeiscontent');
  });
});
