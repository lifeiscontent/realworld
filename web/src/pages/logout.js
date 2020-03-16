import Router from 'next/router';
import { useEffect } from 'react';

export default function Logout() {
  document.cookie = cookie.serialize('authorization', '', {
    maxAge: -1,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  useEffect(() => {
    Router.replace('/', '/');
  }, []);

  return null;
}
