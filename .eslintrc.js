module.exports = {
  globals: {
    MyGlobal: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/react',
  ],
  plugins: ['prettier', 'jest'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', 'tsx'] }],
    'prettier/prettier': [
      'error',
      {
        printWidth: 250,
        singleQuote: true,
        arrowParens: 'always',
        trailingComma: 'all',
        endOfLine: 'auto',
        overrides: [
          {
            files: 'package*.json',
            options: {
              printWidth: 1000,
            },
          },
        ],
      },
    ],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
  },

  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
