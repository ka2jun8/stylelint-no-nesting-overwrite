import { getTestRule } from "jest-preset-stylelint";
import { messages, ruleName } from "../";

const testRule = getTestRule({ plugins: ["./dist"] });

testRule({
  plugins: ["."],
  ruleName,
  config: [true],

  accept: [
    {
      code: `
      .sample {
        --color: blue;
        color: var(--color);
        &[data-type="success"] {
          --color: red;
        }
      }
      `,
      description: "use nesting and css variables",
    },
    {
      code: `
      .sample {
        --color: blue;
        color: var(--color);
        &[data-first-type="skip"] {
          &[data-second-type="success"] {
            --color: red;
          }
        }
      }
      `,
      description: "use nesting and css variables",
    },
  ],

  reject: [
    {
      code: `
      .sample {
        --color: blue;
        color: var(--color);
        &[data-type="failed"] {
          color: red;
        }
      }
      `,
      description: "use nesting and overwrite prop",
      message: messages.expected("color", ".sample"),
      line: 6,
      column: 11,
      endLine: 6,
      endColumn: 22,
    },

    {
      code: `
      .sample {
        --color: blue;
        color: var(--color);
        &[data-first-type="skip"] {
          &[data-second-type="failed"] {
            color: red;
          }
        }
      }
      `,
      description: "use nesting and overwrite prop",
      message: messages.expected("color", ".sample"),
      line: 8,
      column: 11,
      endLine: 8,
      endColumn: 22,
    },
  ],
});
