import Layout from '@/page/index/';
export default [{
        path: '/wel',
        component: Layout,
        redirect: '/wel/index',
        children: [{
            path: 'index',
            name: '首页',
            meta: {
                i18n: 'dashboard',
            },
            component: () =>
                import( /* webpackChunkName: "views" */ '@/views/wel'),
        }, ],
    }, {
        path: '/test',
        component: Layout,
        redirect: '/test/index',
        children: [{
            path: 'index',
            name: '测试页',
            meta: {
                i18n: 'test',
            },
            component: () =>
                import( /* webpackChunkName: "views" */ '@/views/util/test'),
        }, ],
    }, {
        path: '/info',
        component: Layout,
        redirect: '/info/index',
        children: [{
            path: 'index',
            name: '个人信息',
            meta: {
                i18n: 'info',
            },
            component: () =>
                import( /* webpackChunkName: "views" */ '@/views/user/info'),
        }, ],
    },
    {
      path: '/appdown',
      name: "app下载",
      meta: {
          down: true,
          isAuth: false
      },
      component: () => import('../../views/appdown/index.vue')
    },
    // {
    //   path: '/personnel',
    //   name: "人员信息",
    //   component: () => import('../../views/daily/personnel/personnel.vue')
    // }
];