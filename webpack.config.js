const {VueLoaderPlugin} = require("vue-loader");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WatchTimePlugin = require('webpack-watch-time-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = (env, argv) => {
    let config = {
        entry: {
            script: './src/script.js',
        },
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js?ver=[chunkhash]',
            publicPath: '/wp-content/plugins/ssr-demo/dist/',
        },
        resolve: {
            extensions: ['*', '.js'],
            alias: {
                vue$: 'vue/dist/vue.esm.js',
            },
        },
        mode: 'development',
        performance: {
            hints: false,
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.twig$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                context: 'src',
                                name: '[path][name].[ext]',
                            },
                        },
                        { loader: 'extract-loader' },
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: false,
                                interpolate: true,
                                attrs: ['img:src', 'link:href'],
                            },
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/env'],
                            },
                        },
                    ],
                },
                {
                    test: /\.vue$/,
                    use: {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                js: {
                                    loader: 'babel-loader',
                                    options: {
                                        presets: ['@babel/preset-env'],
                                        plugins: ['@babel/plugin-syntax-dynamic-import'],
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    test: /\.(png|svg|jpg|jpeg|tiff|webp|gif|ico|woff|woff2|eot|ttf|otf|mp4|webm|wav|mp3|m4a|aac|oga)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                context: 'src',
                                name: '[path][name].[ext]?ver=[md5:hash:8]',
                            },
                        },
                    ],
                },
                {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [autoprefixer({})],
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                precision: 10,
                            },
                        },
                    ],
                }
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
            new WatchTimePlugin(),
            new VueLoaderPlugin(),
        ],
    };

    let serverConfig = Object.assign({}, config, {target: 'node', entry: {server: './src/server.js'}})

    return [config, serverConfig];
};
