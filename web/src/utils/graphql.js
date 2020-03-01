export function handleValidationError(error, callback) {
  const errors = [];
  if (error.graphQLErrors?.length) {
    error.graphQLErrors.forEach(graphqlError => {
      if (graphqlError.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
        errors.push(...graphqlError.extensions.errors);
      }
    });
  }

  callback(errors);
}
