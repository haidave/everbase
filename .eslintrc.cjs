// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        'plugin:tailwindcss/recommended',
      ],
      files: ['*.ts', '*.tsx', '*.mdx'],
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
      plugins: ['tailwindcss'],
      settings: {
        tailwindcss: {
          callees: ['cn'],
          config: 'tailwind.config.js',
        },
      },
      rules: {
        // disabled because it's conflicting with prettier-plugin-tailwindcss
        // https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/231
        'tailwindcss/classnames-order': 'off',
        'tailwindcss/no-custom-classname': 'off',
      },
    },
    {
      files: ['src/pages/**/*.{ts,tsx}'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // https://github.com/orgs/react-hook-form/discussions/8622#discussioncomment-4060570
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': 'allow-with-description',
        minimumDescriptionLength: 3,
      },
    ],
  },
}

module.exports = config
