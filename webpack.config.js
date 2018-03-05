const { resolve } = require("path");
const { spawn } = require("child_process");

const productionDevtool = "source-map";
const developmentDevtool = "eval-source-map";

const INCLUDE = [resolve(__dirname, "src")];
const EXCLUDE = [/node_modules/];

const PORT = 8080;

const OUTPUT_DIR = resolve(__dirname, "build");

const config = {
  devtool:
    process.env.NODE_ENV === "production"
      ? productionDevtool
      : developmentDevtool,

  output: {
    path: OUTPUT_DIR,
    filename: "[name].bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.(png|gif|jpg|woff2|tff|svg)$/,
        include: INCLUDE,
        exclude: EXCLUDE,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.(scss)$/,
        include: INCLUDE,
        exclude: EXCLUDE,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(tsx|ts|jsx|js)$/,
        include: INCLUDE,
        exclude: EXCLUDE,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },

  node: {
    __dirname: false,
    __filename: false,
  },

  plugins: [],

  resolve: {
    modules: ["node_modules"],
    extensions: [".jsx", ".js", ".tsx", ".ts"],
  },

  devServer: {
    contentBase: OUTPUT_DIR,
    publicPath: '/',
    stats: {
      colors: true
    },
    setup() {
      spawn('npm', ['start'], { 
        shell: true, 
        env: process.env, 
        stdio: 'inherit',
        cwd: __dirname,
      })
      .on('close', code => process.exit(0))
      .on('error', spawnError => console.error(spawnError));
    }
  }
};

let appConfig = {
  target: "electron-renderer",
  entry: {
    app: "./src/app",
  }
};

appConfig = Object.assign(appConfig, config);

module.exports = [appConfig];
