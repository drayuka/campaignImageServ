module.exports = {
    entry: __dirname + "/src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/base"
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: 'development',

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader", options: {configFileName: __dirname + "/tsconfig.json" }},

            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test:/\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};