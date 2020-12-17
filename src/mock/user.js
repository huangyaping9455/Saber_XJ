import Mock from 'mockjs';
export default ({ mock }) => {
  if (!mock) return;
  // 用户登录
  Mock.mock('/user/login', 'post', {
    data: String(new Date().getTime())
  });
};
