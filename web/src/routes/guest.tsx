import { Outlet } from 'react-router';

import { guestOnly } from '../app/middleware';
import { FormPage } from '../layout/FormPage';

/** The layout of the sign-in and sign-up pages, which are for guests only. */
export const middleware = [guestOnly];

export function Component() {
  return (
    <FormPage page="auth-page" width="narrow">
      <Outlet />
    </FormPage>
  );
}
