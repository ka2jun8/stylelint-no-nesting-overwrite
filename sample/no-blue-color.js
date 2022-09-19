// https://medium.com/swlh/writing-your-first-custom-stylelint-rule-a9620bb2fb73

const stylelint = require("stylelint");
const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = "ka2jun8/no-blue-color";
const messages = ruleMessages(ruleName, {
  expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

module.exports = stylelint.createPlugin(ruleName, (_, __, context) => {
  return function lint(postcssRoot, postcssResult) {
    console.log(`stylelint 'ka2jun8/no-blue-color' starts.`);

    const validOptions = validateOptions(postcssResult, ruleName, {});

    if (!validOptions) {
      return;
    }

    const isAutoFixing = Boolean(context.fix);

    postcssRoot.walkDecls((decl) => {
      const hasBlue = decl.value.includes("blue");
      if (!hasBlue) {
        return;
      }
      if (isAutoFixing) {
        const newValue = decl.value.replace("blue", "#0000FF");
        if (decl.raws.value) {
          decl.raws.value.raw = newValue;
        } else {
          decl.value = newValue;
        }
      } else {
        report({
          ruleName,
          result: postcssResult,
          message: messages.expected("blue", "#0000FF"),
          node: decl,
          word: "blue",
        });
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
