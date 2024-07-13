import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import jsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  jsxRuntime,
  {
    rules: {
      '@typescript-eslint/no-namespace': 0,
      '@typescript-eslint/ban-types': 0,
      'require-yield': 0
    }
  }
];
