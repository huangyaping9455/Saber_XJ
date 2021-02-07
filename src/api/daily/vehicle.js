import request from '@/router/axios';

// 车辆变更
// export const getYDList = (data) => {
//   return request({
//     url: '/api/blade-anbiao/anbiao/vehiclesMoveInfo/list',
//     method: 'post',
//     data
//   });
// };
// 车辆信息 机构异动
export const getYDtree = (postId) => {
  return request({
    url: '/api/blade-system/dept/YDtree',
    method: 'get',
    params: {
      postId
    }
  });
};
// 车辆信息 机构异动(点击1)
export const getYDTrueTree = (data) => {
  return request({
    url: '/api/blade-platform/platform/vehiclesMoveInfo/insert',
    method: 'post',
    data
  });
};
// 车辆信息 机构异动(点击2)
export const getYDUpdateTree = (params) => {
  return request({
    url: '/api/blade-platform/platform/vehicle/updateDeptId',
    method: 'post',
    params: params
  });
};