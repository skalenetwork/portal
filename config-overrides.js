const webpack = require("webpack");

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert"),
        fs: false,
        url: false,
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        path: require.resolve('path-browserify'),
        os: "os-browserify/browser"
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ]);
    config.module.rules = config.module.rules.map(rule => {
        if (rule.oneOf instanceof Array) {
            return {
                ...rule,
                oneOf: [
                    {
                        test: /\.mdx?$/,
                        use: [
                            {
                                loader: '@mdx-js/loader',
                                /** @type {import('@mdx-js/loader').Options} */
                                options: {}
                            }
                        ]
                    },
                    ...rule.oneOf
                ]
            };
        }

        return rule;
    });
    return config;
};