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
          test: /\.js$/i,
          include: [
            path.resolve('src'),
            path.resolve('node_modules', 'data-loader'),
            path.resolve('node_modules', 'interpro-components'),
            path.resolve('node_modules', 'pdb-web-components'),
          ],
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
          test: /\.css$/i,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.(jpe?g|png)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10 * 1024,
                name: '[name].[hash:3].[ext]',
              },
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
