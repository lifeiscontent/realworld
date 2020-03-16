import Router from 'next/router';
import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.cookie = cookie.serialize('authorization', '', {
        maxAge: -1,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      Router.replace('/', '/');
    }
  }, []);

  return null;
}
