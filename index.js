const parseOgmo = require("./parseOgmo");

function ogmoLoader(source) {
  const callback = this.async();
  return parseOgmo(this.resourcePath).then(
    (data) => callback(null, data),
    (err) => callback(err, null)
  );
}

module.exports = ogmoLoader;
