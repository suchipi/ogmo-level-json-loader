const parseOgmo = require("./parseOgmo");

function ogmoLoader(_source) {
  return parseOgmo(this.resourcePath);
}

module.exports = ogmoLoader;
