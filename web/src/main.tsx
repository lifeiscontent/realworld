import { ApolloProvider } from '@apollo/client/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { createApolloClient } from './app/apollo';
import { routerContextFor } from './app/context';
import { routes } from './app/router';
import './app.css';

const client = createApolloClient();
const router = createBrowserRouter(routes, {
  getContext: routerContextFor(client),
});

const root = document.getElementById('root');
if (!root) throw new Error('The page has no #root element.');

createRoot(root).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>
);
