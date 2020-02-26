import cookie from 'cookie';

export default (req, res) => {
  if (req.method === 'POST') {
    res
      .writeHead(200, {
        'Set-Cookie': cookie.serialize('token', req.body, {
          path: '/',
          maxAge: 60 * 60 * 24,
          httpOnly: true,
          sameSite: true,
          secure: process.env.NODE_ENV === 'production'
        }),
        'Content-Type': 'text/plain'
      })
      .end('');
  }
};
