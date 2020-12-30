const tsConfig = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/camelcase": "off", // In favor of @typescript-eslint/naming-convention
    "@typescript-eslint/class-name-casing": "off", // In favor of @typescript-eslint/naming-convention
    "@typescript-eslint/naming-convention": [
      "warn", // TODO Mingrui: We should turn this to "error" asap
      { selector: "default", format: ["camelCase"] },
      {
        selector: "variableLike",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
      },
      { selector: "memberLike", format: ["camelCase", "snake_case"] },
      { selector: "enumMember", format: ["PascalCase"] },
      { selector: "typeLike", format: ["PascalCase"] },
    ],
    "no-undef": "off", // in ts there might be global defined keywords
    "no-unused-vars": "off", // In favor of @typescript-eslint/no-unused-vars
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "none",
        argsIgnorePattern: "(next|reject|results|ignore)",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/no-empty-function": "off", // This rule doesn't seem very helpful
    // TODO Mingrui: This rule requires parseOptions to point to our tsconfig, this significantly
    // increase lint time and might cause tslint include/exclude inconsistent with eslint include/exclude
    // disable for now, let me come back later to fix this
    // '@typescript-eslint/no-floating-promises': 'warn',
  },
  // parserOptions: {
  //     project: 'tsconfig.json',
  // },
};

const reactConfig = {
  plugins: ["react", "react-hooks"],
  rules: {
    "react/jsx-uses-vars": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-fragments": "error",
    "react/jsx-tag-spacing": "error",
    "react/jsx-key": "error",
    "react/jsx-closing-bracket-location": [
      "error",
      { selfClosing: "tag-aligned", nonEmpty: "tag-aligned" },
    ],
  },
};

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
    jquery: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      modules: true,
    },
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/internal-regex": "^@clef/",
    react: {
      version: "detect",
    },
  },
  plugins: ["prettier", "import", "workspaces"],
  overrides: [
    {
      files: ["*.ts"],
      ...tsConfig,
    },
    {
      files: ["*.tsx"],
      ...reactConfig,
      ...tsConfig,
      rules: {
        ...tsConfig.rules,
        ...reactConfig.rules,
      },
    },
    {
      files: ["*.jsx"],
      ...reactConfig,
    },
  ],
  rules: {
    "workspaces/no-relative-imports": "error",
    "workspaces/require-dependency": "error",
    "import/no-absolute-path": "error",
    "prettier/prettier": ["error", { singleQuote: true }],
    "no-return-await": "error",
    "prefer-destructuring": [
      "error",
      {
        array: false,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
    camelcase: "off", // In favor of @typescript-eslint/naming-convention
    "max-len": [
      "warn", // TODO Mingrui: We should turn this to "error" asap
      {
        code: 100,
        tabWidth: 2,
        comments: 120,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignorePattern: "^import\\s.+\\sfrom\\s.+;$",
      },
    ],
    "prefer-const": "error",
    "no-use-before-define": "error",
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "none",
        argsIgnorePattern: "(next|reject|results|ignore)",
        ignoreRestSiblings: true,
      },
    ],
    "no-console": "error",
    "no-prototype-builtins": "off",
    "no-trailing-spaces": ["error"],
    // Ths rule might conflicts with prettier when dealing with React component
    // "multiline-ternary": ["error", "always-multiline"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn", // TODO Mingrui: We should turn this to "error" asap
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "echarts-for-react",
            message:
              "Please use <ReactEchartLite /> from client/components/EchartLite/index.ts instead.",
          },
        ],
      },
    ],
  },
};
