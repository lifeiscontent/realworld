import fetch from 'isomorphic-unfetch';

export default (req, res) => {
  if (req.method === 'POST') {
    const headers = { ...req.headers };

    if (req.cookies.token) {
      headers['Authorization'] = `Bearer ${req.cookies.token}`;
    }

    return fetch(process.env.GRAPHQL_URL_SERVER, {
      body: JSON.stringify(req.body),
      credentials: 'omit',
      headers,
      method: req.method
    })
      .then(value => {
        res.status(value.status);
        return value.json();
      })
      .then(res.json);
  } else {
    res.status(404).end('');
  }
};
