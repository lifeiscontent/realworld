import cookie from 'cookie';
export default (req, res) => {
  if (req.method === 'POST') {
    res
      .writeHead(200, {
        'Set-Cookie': cookie.serialize('token', req.body, {
          path: '/'
        }),
        'Content-Type': 'text/plain'
      })
      .end('');
  }
};
