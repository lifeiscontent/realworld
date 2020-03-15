import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Router, { RouterContext } from 'next/router';
import { renders } from './index.stories';

jest.mock('next/router');

describe('ArticleUpdateButton', () => {
  it('goes to link on click', () => {
    render(
      <RouterContext.Provider value={Router.router}>
        {renders()}
      </RouterContext.Provider>
    );
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(Router.router.push).toHaveBeenCalledWith(
      '/[username]',
      '/lifeiscontent',
      { shallow: undefined }
    );
  });
});
