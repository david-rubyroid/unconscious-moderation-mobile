import antfu from '@antfu/eslint-config'
import reactNative from 'eslint-plugin-react-native'

export default antfu(
  {
    react: true,
    typescript: true,
    formatters: true,
  },
  {
    ignores: [
      'node_modules',
      'android',
      'ios',
      'dist',
      'build',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'react-native': reactNative,
    },
    rules: {
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'off',
      'react-native/no-raw-text': 'off',
      'react-native/sort-styles': 'off',
      'node/prefer-global/process': ['error', 'always'],

      'prettier/prettier': 'off',

      'no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
    },
  },
)
