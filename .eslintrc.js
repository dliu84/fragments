// original .eslintrc.js file for lab 1 and lab 2
// module.exports = {
//   env: {
//     commonjs: true,
//     es2021: true,
//     node: true,
//   },
//   extends: 'eslint:recommended',
//   overrides: [],
//   parserOptions: {
//     ecmaVersion: 'latest',
//   },
//   rules: {},
// };

// .eslintrc.js for lab 3
/*Update your eslintrc.js configuration file so that ESLint knows that we're using Jest 
(otherwise, ESLint will give you lots of lint errors when you use Jest's global functions in your tests). 
We do this by adding another env setting for jest */
module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    // Add this next line to configure ESLint for Jest, see:
    // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {},
};
