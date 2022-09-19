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
        color: blue;
        &[data-type="failed"] {
          color: red;
        }
      }
      `,
      description: "use nesting and overwrite prop",
      message: messages.expected("color", ".sample"),
      line: 5,
      column: 11,
      endLine: 5,
      endColumn: 22,
    },

    {
      code: `
      .sample {
        color: blue;
        &[data-first-type="skip"] {
          &[data-second-type="failed"] {
            color: red;
          }
        }
      }
      `,
      description: "use nesting and overwrite prop",
      message: messages.expected("color", ".sample"),
      line: 6,
      column: 13,
      endLine: 6,
      endColumn: 24,
    },

    {
      code: `
      .sample {
        &[data-first-type="target"] {
          color: blue;
          &[data-second-type="failed"] {
            color: red;
          }
        }
      }
      `,
      description: "use nesting and overwrite prop",
      message: messages.expected("color", '&[data-first-type="target"]'),
      line: 6,
      column: 13,
      endLine: 6,
      endColumn: 24,
    },
  ],
});
