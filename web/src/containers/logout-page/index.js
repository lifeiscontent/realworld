import cookie from 'cookie';
import Router from 'next/router';
import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';

export default function LogoutPage() {
  const client = useApolloClient();
  useEffect(() => {
    document.cookie = cookie.serialize('authorization', '', {
      maxAge: -1,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    client.resetStore().then(() => Router.push('/'));
  }, [client]);

  return null;
}
