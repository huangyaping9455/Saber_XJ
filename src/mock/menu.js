import Mock from 'mockjs';

const top = [
  {
    label: 'bladex官网',
    icon: 'el-icon-document',
    meta: {
      i18n: 'website',
    },
    path: 'https://bladex.vip/#/',
    parentId: 1,
  },
];
export default ({ mock, }) => {
  if (!mock) return;
  Mock.mock('/user/getTopMenu', 'get', () => {
    return {
      data: top,
    };
  });
};
