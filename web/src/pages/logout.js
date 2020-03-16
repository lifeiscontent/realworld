import React, { useEffect } from 'react';
import Router from 'next/router';

export default () => {
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
};
