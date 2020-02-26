import fetch from 'isomorphic-unfetch';

export default (req, res) => {
  if (req.method === 'POST') {
    const headers = { ...req.headers };

    if (req.cookies.token) {
      headers['Authorization'] = `Bearer ${req.cookies.token}`;
    }

    console.log(headers['Authorization']);

    return fetch('http://localhost:4000/graphql', {
      body: JSON.stringify(req.body),
      credentials: 'include',
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
