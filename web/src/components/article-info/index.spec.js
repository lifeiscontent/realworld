import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Router, { RouterContext } from 'next/router';
import { renders } from './index.stories';

jest.mock('next/router');

describe('ArticleUpdateButton', () => {
  it('goes to link on click', async () => {
    const { getByRole } = render(
      <RouterContext.Provider value={Router.router}>
        {renders()}
      </RouterContext.Provider>
    );
    await wait(() => {
      const link = getByRole('link');
      fireEvent.click(link);
      expect(Router.router.push).toHaveBeenCalledWith(
        '/[username]',
        '/lifeiscontent',
        { shallow: undefined }
      );
    });
  });
});
