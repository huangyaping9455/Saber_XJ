const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
// const baseUrl = 'http://wujing930717.vipgz1.idcfengye.com';
// const baseUrl = 'http://36.133.42.216:8200';

// const baseUrl = "http://www.zkgt-safety.com:8200";
const baseUrl = "http://222.82.236.242:8896";
// const baseUrl = "http://58.144.142.198:8896";//铭信
// const baseUrl = "http://47.108.26.59:8200";
// const baseUrl = "http://47.108.29.76:8200";
// const baseUrl = "http://114.115.168.84:8200";
// const baseUrl = "http://47.112.250.151:8200";
// const baseUrl = "http://60.171.241.126:8200";
// const baseUrl = "http://218.70.170.82:8200";

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  chainWebpack: (config) => {
    // 路径别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("A", resolve("src/assets"))
      .set("C", resolve("src/components"))
      .set("U", resolve("src/utils"))
      .set("V", resolve("src/views"))
      .set("S", resolve("src/style"));
    // 忽略的打包文件
    config.externals({
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT",
    });
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();
    entry.add("@/mock").end();
  },
  devServer: {
    proxy: {
      "/api": {
        target: baseUrl,
        ws: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
};