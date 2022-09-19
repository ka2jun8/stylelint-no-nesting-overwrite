import { utils, createPlugin, Plugin, Rule } from "stylelint";
import { Declaration, Rule as RuleNode } from "postcss";

const { report, ruleMessages, validateOptions } = utils;

export const ruleName = "ka2jun8/no-nesting-overwrite";
export const messages = ruleMessages(ruleName, {
  expected: (prop, selector) =>
    `"${prop}" must not overwrite in "${selector}" nesting. Use "--${prop}"`,
});

function isDeclarationNode(node: Declaration | RuleNode): node is Declaration {
  return node.type === "decl";
}

function isRuleNode(node: Declaration | RuleNode): node is RuleNode {
  return node.type === "rule";
}

function permitCssVariables(prop: string) {
  return prop.startsWith("--");
}

const plugin: Plugin = () => {
  return function lint(postcssRoot, postcssResult) {
    const validOptions = validateOptions(postcssResult, ruleName);

    if (!validOptions) {
      return;
    }

    postcssRoot.walkRules(({ selector, nodes: _nodes }) => {
      const declsMap = new Map<string, Declaration[]>();

      // Memo: ChildNode asserts Declaration or RuleNode.
      const nodes = _nodes as Declaration[] | RuleNode[];

      for (const node of nodes) {
        // Root Declarations
        if (isDeclarationNode(node)) {
          const parentDecls = declsMap.get(selector) || [];
          parentDecls.push(node);
          declsMap.set(selector, parentDecls);
        }

        // Nesting Rules
        if (isRuleNode(node)) {
          const parentDecls = declsMap.get(selector);
          if (!parentDecls) {
            continue;
          }
          const childeNodes = node.nodes as Declaration[] | RuleNode[];
          for (const childNode of childeNodes) {
            if (isDeclarationNode(childNode)) {
              if (permitCssVariables(childNode.prop)) {
                continue;
              }
              if (parentDecls.find((d) => d.prop === childNode.prop)) {
                report({
                  ruleName,
                  result: postcssResult,
                  message: messages.expected(childNode.prop, selector),
                  node: childNode,
                });
              }
            }
          }
        }
      }
    });
  };
};

// Refer: following assertions are based on official codes.
// https://github.com/stylelint/stylelint/blob/main/types/stylelint/type-test.ts#L121-L126
(plugin as Rule).ruleName = ruleName;
(plugin as Rule).messages = messages;

export default createPlugin(ruleName, plugin as Rule);
