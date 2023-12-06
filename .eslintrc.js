module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'unused-imports',
    ],
    rules: {
        indent: 'off', // ['error', 4], // prettier conflict
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'import/no-extraneous-dependencies': 'off',
        'no-console': 'off',
        'max-len': [2, { code: 160, tabWidth: 4, ignoreUrls: true }],
        'no-unused-expressions': [
            'error',
            { allowShortCircuit: true, allowTernary: true },
        ],
        'no-underscore-dangle': 'off',
        'no-use-before-define': 'off',
        'no-nested-ternary': 'off',
        "semi": ["error", "always"],

        // Supermetrics
        'import/prefer-default-export': 'off', // default exports are bad: https://basarat.gitbook.io/typescript/main-1/defaultisbad
        'import/no-default-export': 'error', // default exports are bad, prefer named exports

        // reducers
        'no-param-reassign': ['error', { props: false }],

        // d3 joins
        'no-shadow': 'off',

        // For dev
        'no-unused-vars': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'lines-between-class-members': 'off',
        'max-classes-per-file': 'off',
        'no-undef': 'off',
        'no-inferrable-types': 'off',
        'no-debugger': 'off',

        // d3 types
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
