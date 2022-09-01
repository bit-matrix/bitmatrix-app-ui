require('ignore-styles');

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@babel/register')({
  ignore: [/(node_module)/],
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  extensions: ['.js', '.ts', '.tsx'],
});

require('./server');
