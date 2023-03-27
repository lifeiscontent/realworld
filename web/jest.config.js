const esModules = [
  'bail',
  'character-entities',
  'comma-separated-tokens',
  'decode-named-character-reference',
  'hast-util-whitespace',
  'is-plain-obj',
  'mdast-util-definitions',
  'mdast-util-from-markdown',
  'mdast-util-to-hast',
  'mdast-util-to-string',
  'micromark',
  'property-information',
  'react-markdown',
  'remark-parse',
  'remark-rehype',
  'space-separated-tokens',
  'trough',
  'unified',
  'unist-builder',
  'unist-util-generated',
  'unist-util-is',
  'unist-util-position',
  'unist-util-stringify-position',
  'unist-util-visit',
  'trim-lines',
  'vfile',
].join('|');

module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': `<rootDir>/__mocks__/fileMock.js`,
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    [`(${esModules}).+\\.js$`]: ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    `[/\\\\]node_modules[/\\\\](?!${esModules}).+\\.(js|jsx|mjs|cjs|ts|tsx)$`,
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};
