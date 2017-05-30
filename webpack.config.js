const path = require('path');

const HTMLPlugin = require('html-webpack-plugin');

module.exports = env => {
  return {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      filename: '[name].[chunkhash:3].js',
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: '[name].[chunkhash:3].js',
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    'env',
                    {
                      targets: {
                        browsers: ['last 1 chrome version'],
                      },
                      modules: false,
                    },
                  ],
                  ['stage-2'],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      modules: ['node_modules', path.resolve(__dirname, 'src')],
    },
    devtool: 'source-map',
    devServer: {
      overlay: true,
    },
    plugins: [
      new HTMLPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
      }),
    ],
  };
};
