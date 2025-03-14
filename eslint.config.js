/* eslint-disable no-undef */
const importPlugin = require("eslint-plugin-import");
const { configs } = require("@eslint/js");
const typescriptPlugin = require("eslint-plugin-typescript");
const promisePlugin = require("eslint-plugin-promise");
const typescriptEslintParser = require("@typescript-eslint/parser"); // Import parser object
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin"); // Import plugin

module.exports = [
  configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptEslintParser, // Use parser object directly
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      typescript: typescriptPlugin,
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...promisePlugin.configs.recommended.rules,
      ...typescriptEslintPlugin.configs.recommended.rules,
      ...typescriptEslintPlugin.configs["recommended-requiring-type-checking"].rules,
      "import/no-cycle": [0],
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-inferrable-types": [0],
      "@typescript-eslint/no-unsafe-call": [0],
      "@typescript-eslint/no-unsafe-assignment": [0],
      "@typescript-eslint/no-unsafe-member-access": [0],
      "@typescript-eslint/explicit-function-return-type": ["error"],
      "no-async-promise-executor": [0],
      "promise/no-callback-in-promise": [0],
      "promise/no-return-wrap": [0],
      "require-atomic-updates": [0],
      "indent": ["error", 2, { "FunctionDeclaration": { "parameters": "first"}, "SwitchCase": 1 }],
      "function-paren-newline": [0],
      "object-curly-newline": ["error", { "consistent": true }],
      "prefer-destructuring": ["error", {"object": true, "array": false}],
      "no-restricted-globals": [0],
      "no-multiple-empty-lines": "error",
      "max-len": ["error", 140],
      "no-unused-vars": [0],
      "no-return-assign": [0],
      "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
      "import/prefer-default-export": [0],
      "no-use-before-define": ["error", { "functions": true, "classes": true }],
      "import/no-unresolved": [0],
      "no-underscore-dangle": [0],
      "no-undef": 0,
      "new-cap": [
        2,
        {
          "capIsNewExceptions": [
            "NgModule",
            "ViewChild",
            "Output",
            "Injectable",
            "Component",
            "Directive",
            "HostListener",
            "HostBinding",
            "Input",
            "express.Router",
            "DataTypes.STRING",
            "DataTypes.CHAR",
            "DataTypes.TEXT",
            "DataTypes.INTEGER",
            "DataTypes.BIGINT",
            "DataTypes.FLOAT",
            "DataTypes.REAL",
            "DataTypes.DOUBLE",
            "DataTypes.DECIMAL",
            "DataTypes.BOOLEAN",
            "DataTypes.TIME",
            "DataTypes.DATE",
            "DataTypes.DATEONLY",
            "DataTypes.HSTORE",
            "DataTypes.JSON",
            "DataTypes.JSONB",
            "DataTypes.NOW",
            "DataTypes.BLOB",
            "DataTypes.RANGE",
            "DataTypes.UUID",
            "DataTypes.UUIDV1",
            "DataTypes.UUIDV4",
            "DataTypes.VIRTUAL",
            "DataTypes.ENUM",
            "DataTypes.ARRAY"
          ]
        }
      ],
    },
  },
  {
    files: ["**/*.spec.ts", "*.spec.ts", "src/test-env.ts", "src/setup.ts"],
    rules: {
      "no-unused-expressions": [0],
      "@typescript-eslint/require-await": [0],
      "@typescript-eslint/camelcase": [0],
      "@typescript-eslint/no-misused-promises": [0],
      "max-classes-per-file": [0],
      "@typescript-eslint/no-unused-expressions": [0],
      "@typescript-eslint/prefer-promise-reject-errors": [0]
    },
  },
];
