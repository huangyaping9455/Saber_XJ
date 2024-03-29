/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios';
import store from '@/store/';
import router from '@/router/router';
import {
  serialize
} from '@/util/util';
import {
  getToken
} from '@/util/auth';
import {
  Message
} from 'element-ui';
import website from '@/config/website';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
// token解码
// import jwtDecode from 'jwt-decode'
// const decode =  jwtDecode("eyJ0eXAiOiJKc29uV2ViVG9rZW4iLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3N1c2VyIiwiYXVkIjoiYXVkaWVuY2UiLCJyb2xlSWQiOiJCd0x0d0lTZnZJN21WNlVGRkdJVzZRPT0iLCJyb2xlTmFtZSI6InZQNlljV0x5cHdSUkxXbWFFZkoyV1E9PSIsInRlbmFudENvZGUiOiJWdFBEWTE4dis0NFlYQ2FKOFErU0JBPT0iLCJ1c2VyTmFtZSI6IjFGTXdNU0RkcWJoN2ZrUTRRMGlCMXc9PSIsInVzZXJJZCI6IkJ3THR3SVNmdkk3bVY2VUZGR0lXNlE9PSIsImFjY291bnQiOiJwSGhZa29ranJqYmkvOERyVkZRVU1nPT0iLCJleHAiOjE2MzA0MzY0MDAsIm5iZiI6MTYzMDM3NjE2Mn0.Ia3MNcrb70x7Xi1_rLQ6-rCjxNnsVjiPsyabiqgqizw");
// console.log(decode);

axios.defaults.timeout = 30000;
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});
// HTTPrequest拦截
axios.interceptors.request.use(
  (config) => {
    NProgress.start(); // start progress bar
    const meta = config.meta || {};
    const isToken = meta.isToken === false;
    const deptId = store.getters.deptId;
    if (getToken() && !isToken) {
      config.headers['blade-auth'] = 'Bearer ' + getToken(); // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    }
    if (config.params && !config.params.deptId) {
      config.params.deptId = deptId;
    }
    if (config.data && !config.data.deptId) {
      config.data.deptId = deptId;
    }
    // headers中配置serialize为true开启序列化
    if (config.method === 'post' && meta.isSerialize === true) {
      config.data = serialize(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// HTTPresponse拦截
axios.interceptors.response.use(
  (res) => {
    NProgress.done();
    const status = res.data.code || 200;
    const statusWhiteList = website.statusWhiteList || [];
    const message = res.data.msg || '未知错误';
    // console.log(res); //执行的接口
    if (res.config.url === "/api/blade-auth/auth/signIn") {

    }

    // 如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res);
    // 如果是401则跳转到登录页面
    if (status === 401) {
      store.dispatch('FedLogOut');
      router.push({
        path: '/login'
      });
    }

    // 如果请求为非200否者默认统一处理
    if (status !== 200) {
      Message({
        message: message,
        type: 'error'
      });
      return Promise.reject(new Error(message));
    }
    return res;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(new Error(error));
  }
);

export default axios;