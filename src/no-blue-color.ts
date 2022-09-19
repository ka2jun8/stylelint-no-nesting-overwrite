import { utils, createPlugin, Plugin, Rule } from "stylelint";

const { report, ruleMessages, validateOptions } = utils;

export const ruleName = "ka2jun8/no-blue-color";
export const messages = ruleMessages(ruleName, {
  expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});

const plugin: Plugin = (_, __, context) => {
  return function lint(postcssRoot, postcssResult) {
    const validOptions = validateOptions(postcssResult, ruleName);

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
};

// Memo: assertion は stylelint 公式のサンプルを参考にしている
// https://github.com/stylelint/stylelint/blob/main/types/stylelint/type-test.ts#L121-L126
(plugin as Rule).ruleName = ruleName;
(plugin as Rule).messages = messages;

export default createPlugin(ruleName, plugin as Rule);
