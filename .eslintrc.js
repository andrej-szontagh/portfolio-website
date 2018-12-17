module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        'plugin:vue/recommended'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        "vue/html-indent": ["error", 4],

        // there is a bug or something !!
        //"vue/no-multi-spaces": ["error", { "ignoreProperties": true }],

        "vue/no-multi-spaces": 'off',

        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
}
