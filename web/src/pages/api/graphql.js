import fetch from 'isomorphic-unfetch';

function camelToSnake(string) {
  return string
    .replace(/[\w]([A-Z])/g, ([start, end]) => `${start}_${end}`)
    .toLowerCase();
}

export default (req, res) => {
  if (req.method === 'POST') {
    const headers = { ...req.headers };

    if (req.cookies.token) {
      headers['Authorization'] = `Bearer ${req.cookies.token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      const fs = require('fs');

      fs.writeFileSync(
        `../api/spec/fixtures/files/graphql/${camelToSnake(
          req.body.operationName
        )}.graphql`,
        req.body.query
      );
    }

    console.log(req.body);

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
