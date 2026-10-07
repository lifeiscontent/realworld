import type { CodegenConfig } from '@graphql-codegen/cli';

// The setup that Apollo Client recommends: typescript-operations makes only
// types, with no runtime code. The documents are gql tags in the source
// files, typed with TypedDocumentNode.
// https://www.apollographql.com/docs/react/development-testing/graphql-codegen
const config: CodegenConfig = {
  overwrite: true,
  schema: '../api/schema.graphql',
  documents: ['src/**/*.{ts,tsx}', '!src/types/__generated__/**'],
  generates: {
    './src/types/__generated__/graphql.ts': {
      plugins: ['typescript-operations'],
      config: {
        // Apollo Client always includes `__typename` fields.
        nonOptionalTypename: true,
        // Apollo Client does not add `__typename` to root operation types.
        skipTypeNameForRoot: true,
        scalars: { ISO8601DateTime: 'string' },
        useTypeImports: true,
      },
    },
  },
};

export default config;
