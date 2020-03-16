import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Router from 'next/router';
import { renders } from './index.stories';

jest.mock('next/router');

describe('ArticleUpdateButton', () => {
  it('goes to link on click', () => {
    render(renders());
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(Router.push).toHaveBeenCalledWith('/[username]', '/lifeiscontent', {
      shallow: undefined
    });
  });
});
