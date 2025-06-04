export default {
  '**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,md,yaml,yml,js,mjs,cjs}': ['prettier --write'],
};
