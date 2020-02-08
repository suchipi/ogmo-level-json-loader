# `ogmo-level-json-loader`

This is a webpack loader that loads [Ogmo Editor](https://ogmo-editor-3.github.io/) level files (\*.json).

It wraps images referenced in the file with a `require`, so your normal webpack loader for PNGs or etc will be used (eg `file-loader`).

Since the JSON file extension is used for a lot of things, this loader also handles non-ogmo-level json files gracefully, returning normal json like `json-loader` would.

## Usage

```js
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/i,
        use: ["ogmo-level-json-loader"],
        type: "javascript/auto",
      },
    ],
  },
};
```

```js
const level = require("./level1.json");

console.log(level);
// { ogmoVersion: "3.3.0", "width": 320, "height": 240, ... }
```

## License

MIT
