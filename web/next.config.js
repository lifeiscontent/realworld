const fs = require('fs');
const dotenv = require('dotenv');

const env = [
  '.env',
  `.env.${process.env.NODE_ENV}`,
  `.env.${process.env.NODE_ENV}.local`,
].reduce(
  (env, file) => {
    if (fs.existsSync(file)) {
      return { ...env, ...dotenv.parse(fs.readFileSync(file)) };
    }
    return env;
  },
  {
    GRAPHQL_URL: 'https://realworld-api-production.herokuapp.com/graphql',
  }
);

module.exports = {
  env,
};
