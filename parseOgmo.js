const fs = require("fs");
const template = require("@babel/template").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const makeProgram = template(`
  module.exports = EXPORTS;
`);

const makeRequire = template.expression(`
  typeof require(SOURCE) === "object" &&
    require(SOURCE) != null &&
    require(SOURCE).__esModule &&
    {}.hasOwnProperty.call(require(SOURCE), "default")

    ? require(SOURCE).default
    : require(SOURCE)
`);

function jsonToAst(data) {
  if (typeof data === "object" && data != null) {
    if (Array.isArray(data)) {
      return t.arrayExpression(data.map(jsonToAst));
    } else {
      if (typeof data.type === "string") return data;

      const objExpression = t.objectExpression([]);
      Object.entries(data).forEach(([key, value]) => {
        const keyNode = jsonToAst(key);
        const valueNode = jsonToAst(value);

        objExpression.properties.push(t.objectProperty(keyNode, valueNode));
      });

      return objExpression;
    }
  } else if (data === null) {
    return t.nullLiteral();
  } else if (data === undefined) {
    return t.identifier("undefined");
  } else if (typeof data === "string") {
    return t.stringLiteral(data);
  } else if (typeof data === "number") {
    return t.numericLiteral(data);
  } else if (typeof data === "boolean") {
    return t.booleanLiteral(data);
  }
}

function parseOgmo(filepath) {
  const jsonStr = fs.readFileSync(filepath, "utf-8");
  const parsedJson = JSON.parse(jsonStr);

  if (
    typeof parsedJson === "object" &&
    parsedJson != null &&
    typeof parsedJson.ogmoVersion === "string"
  ) {
    if (Array.isArray(parsedJson.layers)) {
      parsedJson.layers.forEach((layer) => {
        if (typeof layer.folder === "string" && Array.isArray(layer.decals)) {
          const baseFolder = "./" + layer.folder;
          layer.decals.forEach((decal) => {
            if (typeof decal.texture === "string") {
              decal.texture = makeRequire({
                SOURCE: t.stringLiteral(baseFolder + "/" + decal.texture),
              });
            }
          });
        }
      });
    }

    const ast = makeProgram({
      EXPORTS: jsonToAst(parsedJson),
    });

    return generate(ast).code;
  } else {
    return "module.exports = " + jsonStr;
  }
}

module.exports = parseOgmo;
