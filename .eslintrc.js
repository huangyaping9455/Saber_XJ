/*
  eslint 参考 https://cn.eslint.org/docs/rules/
  "off"   或 0 - 关闭规则
  "warn"  或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
  "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
*/

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? 2 : 0,
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "vue/no-unused-vars": process.env.NODE_ENV === "production" ? 2 : 0
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  plugins: ["vue"]
};
