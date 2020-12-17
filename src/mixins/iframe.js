/**
 * 尽量保证 iframe mxin 没有多余的副作用 只提供方法
 */

import { getToken } from '@/util/auth';
export default {
  data() {
    return {};
  },
  created() {},
  computed: {
    iframe() {
      return this.$store.state.common.iframe;
    }
  },
  watch: {
    iframe: {
      immediate: true,
      handler: 'iframeOnRouterReady'
    }
  },
  methods: {
    iframeOnRouterBack() {
      this.$router.go(-1);
    },
    // 重新获取用户信息
    iframeOnGetUserInfo(postId) {
      this.$store.dispatch('GetUserInfo', postId);
    },
    iframeOnRouterReady() {
      const store = this.$store;
      const iframe = this.iframe;
      if (!iframe.data) return;

      const e = iframe.data;
      // 前往页面
      const to = () => {
        console.log('to', e.path);
        this.$router.replace({ path: e.path });
      };

      // 加载完毕
      const ready = () => {
        iframe.source.postMessage(
          {
            flag: 'safety-system',
            action: 'routerReady'
          },
          '*'
        );
        e.load = true;
        this[e.action] && this[e.action](e.params);
      };

      // 如果未登录
      if (!getToken()) {
        store.dispatch('LoginByUsername', e.account).then(() => {
          store.dispatch('GetMenu').then((data) => {
            this.$router.$avueRouter.formatRoutes(data, true);
            to();
          });
        });
      } else {
        // 如果抵达目标页面
        let isLoad = e.load || this.$route.path == e.path;
        isLoad ? ready() : to();
      }
    }
  }
};
