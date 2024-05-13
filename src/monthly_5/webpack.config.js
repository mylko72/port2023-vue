const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-external-files-plugin');

module.exports = (env, argv) => {
  const dt = new Date();
  const nextMonth = '202405';
  const dateStr = `${dt.getFullYear()}_${dt.getMonth()+1}_${dt.getDate()}`;

  return {
    mode: env.mode !== undefined ? env.mode : 'none',
    entry: {
      index: ['./js/monthly_index_2404.js', './js/monthly_spot_2404.js', './js/monthly_plp_horizontal_2404.js', './js/monthly_gtag_2404.js']
    },
    output: {
      filename: `./content/dam/channel/wcms/de/monthlylg/assets/${nextMonth}/monthly_[name].${dateStr}.[chunkhash].js`,
      path: path.resolve(__dirname),
    },
    devtool: env.mode === 'production' ? false : 'inline-source-map',
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    devServer: {
      port: 9000,
      static: {
        directory: path.resolve(__dirname),
      },
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/i,
          exclude: /node_modules/,
          use: [
            // "style-loader",
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                url: false,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ]
    },
    plugins: [
      new WatchExternalFilesPlugin({
        files: ['monthly_content_fr.html', 'monthly_content_de.html', 'monthly_content_uk.html', 'monthly_content_it.html'],
      }),
      new webpack.BannerPlugin({
        banner: `Build Date : ${new Date().toLocaleString()}`
      }),
      new HtmlWebpackPlugin({
        template: 'monthly_layout.html',
        filename: 'index.html',
        inject: false,
        minify: false,
        cache: false,
        templateParameters: (compilation, assets) => {
          const files = {
            de: fs.readFileSync('monthly_content_de.html', { encoding: 'utf-8' }),
            fr: fs.readFileSync('monthly_content_fr.html', { encoding: 'utf-8' }),
            uk: fs.readFileSync('monthly_content_uk.html', { encoding: 'utf-8' }),
            it: fs.readFileSync('monthly_content_it.html', { encoding: 'utf-8' }),
          };

          const css = assets.css.map((filePath) => `<link rel="stylesheet" type="text/css" href="${filePath}">`).join("\n");
          const js = assets.js.map((filePath) => `<script src="${filePath}"></script>`).join("\n");

          if (env.targetCountry !== undefined) {
            if (env.targetCountry === 'all') {
              Object.keys(files).forEach(function(key) {
                const country = key.toString();
                const data = files[key];
                const srcChange = data.replaceAll('/wcms/de/', `/wcms/${country}/`)
                fs.writeFile(`./dist/html/monthly_content_${country}.html`, srcChange, (err) => {
                  if (err) console.log('Error: ', err);
                })
              });
            } else {
              const data = files[env.targetCountry].replaceAll('/wcms/de/', `/wcms/${env.targetCountry}/`);
              fs.writeFile(`./dist/html/monthly_content_${env.targetCountry}.html`, data, (err) => {
                if (err) console.log('Error: ', err);
              })
            }
          }

          return { css, js, files };
        },
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          `./content/dam/channel/wcms/de/monthlylg/assets/${nextMonth}`,
        ],
        cleanAfterEveryBuildPatterns: [
          `./content/dam/channel/wcms/de/monthlylg/assets/${nextMonth}/*.LICENSE.txt`,
        ],
        // protectWebpackAssets: false
      }),
      new MiniCssExtractPlugin({
        linkType: false,
        filename: `./content/dam/channel/wcms/de/monthlylg/assets/${nextMonth}/monthly_[name].${dateStr}.[contenthash].css`,
        chunkFilename: `./content/dam/channel/wcms/de/monthlylg/assets/${nextMonth}/monthly_[id].${dateStr}.[contenthash].css`,
      }),
      new WebpackManifestPlugin({ 
        fileName: `./content/dam/channel/wcms/de/monthlylg/assets/${nextMonth}/assets.json`,
        basePath: './'
      }),
    ],
  }
}