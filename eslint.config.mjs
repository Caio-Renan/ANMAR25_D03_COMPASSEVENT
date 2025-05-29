import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import sonar from 'eslint-plugin-sonarjs';
import security from 'eslint-plugin-security';
import jest from 'eslint-plugin-jest';

/** @type {import('@eslint/eslintrc').FlatConfigItem[]} */
export default [
    {
        ignores: ['dist', 'node_modules', 'coverage', '.husky'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            prettier: prettierPlugin,
            sonarjs: sonar,
            security: security,
            jest: jest,
        },
        rules: {
            'prettier/prettier': 'error',

            ...typescript.configs.recommended.rules,

            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': 'error',

            'no-console': ['warn', { allow: ['warn', 'error'] }],

            'sonarjs/no-duplicate-string': 'warn',
            'sonarjs/no-identical-functions': 'warn',

            'security/detect-object-injection': 'warn',

            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
            'jest/prefer-to-have-length': 'warn',
            'jest/valid-expect': 'error',
        },
    },
    {
        files: ['**/*.spec.ts', '**/__tests__/**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'no-console': 'off',
            'jest/no-disabled-tests': 'warn',
            'jest/no-focused-tests': 'error',
            'jest/no-identical-title': 'error',
        },
    },
];