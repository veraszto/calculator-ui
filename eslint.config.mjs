import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import stylisticJsx from '@stylistic/eslint-plugin-jsx';
import jest from 'eslint-plugin-jest';

console.log("Running eslint config");
//console.log(pluginJs.configs.recommended);
//console.log(pluginReact.configs.flat.recommended);
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { globals: {...globals.browser, "jest/globals": true} }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
    jest.configs['flat/recommended'],
  {
	  settings: {
	  react: {
		  version: '^18.3.1'
	  }
  }},
  {
      plugins: {
          '@stylistic/jsx': stylisticJsx
      }
  },
  {
      rules: {
        '@stylistic/jsx/jsx-indent': ['error', 4]
      }
  },

];
