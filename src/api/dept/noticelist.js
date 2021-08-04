import request from '@/router/axios';

export const getList = (dept, current, size) => {
  return request({
    url: '/api/blade-platform/platform/appVersionInfo/getList',
    method: 'post',
    data: {
      dept,
      current,
      size,
    }
  });
};

export const getStatus = (id, isdeleted, updateuser) => {
  return request({
    url: '/api/blade-platform/platform/appVersionInfo/update',
    method: 'post',
    data: {
      id,
      isdeleted,
      updateuser,

    }

  });
};

export const remove = (ids) => {
  return request({
    url: '/api/blade-desk/notice/remove',
    method: 'post',
    params: {
      ids,
    },
  });
};

export const add = (data) => {
  return request({
    url: '/api/blade-platform/platform/appVersionInfo/insert',
    method: 'post',
    data
  });
};

export const update = (row) => {
  return request({
    url: '/api/blade-desk/notice/submit',
    method: 'post',
    data: row,
  });
};

export const getNotice = (id) => {
  return request({
    url: '/api/blade-desk/notice/detail',
    method: 'get',
    params: {
      id,
    },
  });
};
export const getfild = (file, fileld, table) => {
  return request({
    url: '/api/blade-upload/upload/upload',
    method: 'post',
    data: {
      file,
      fileld,
      table
    },
  });
};
// 人员管理
export const getListProson = (deptId, current, size, deptName, account, realName, zhuangtai) => {
  return request({
    url: '/api/blade-user/user/userlist',
    method: 'post',
    data: {
      deptId,
      current,
      size,
      deptName,
      account,
      realName,
      zhuangtai
    }
  });
};
// 人员管理（删除）
export const Prosonremove = (ids) => {
  return request({
    url: '/api/blade-user/user/remove',
    method: 'post',
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    params: {
      ids
    }
  });
};
// 人员管理（删除）
export const updateUserStatus = (ids, status, user) => {
  return request({
    url: '/api/blade-user/user/updateUserStatus',
    method: 'post',
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    params: {
      ids,
      status,
      user
    }
  });
};
// 人员管理（重置密码）
export const Prosonrepsd = (userIds) => {
  return request({
    url: '/api/blade-user/user/reset-password',
    method: 'post',
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    params: {
      userIds
    }
  });
};
// 驾驶员信息 绑定车辆
export const getJSYByVehicle = (jiashiyuanid) => {
  return request({
    url: '/api/blade-platform/platform/jiashiyuan/getJSYByVehicle',
    method: 'get',
    params: {
      jiashiyuanid,
    },
  });
};
// 驾驶员信息（重置密码）
export const resetPassword = (ids) => {
  return request({
    url: '/api/blade-platform/platform/jiashiyuan/resetPassword',
    method: 'post',
    params: {
      ids
    }
  });
};

// 驾驶员信息 绑定车辆
export const getJSYVehiclelist = (deptId, jiashiyuanleixing, current, size, deptName, jiashiyuanxingming, biaoshi) => {
  return request({
    url: '/api/blade-platform/platform/jiashiyuan/getJVPageList',
    method: 'get',
    params: {
      deptId,
      jiashiyuanleixing,
      current,
      size,
      deptName,
      jiashiyuanxingming,
      biaoshi,
    },
  });
};

// 预警管理菜单
export const getallyujing = () => {
  return request({
    url: '/api/blade-platform/platform/yujingquanxian/allyujing',
    method: 'get',
  });
};
// 驾驶员信息 绑定车辆
export const getGDSVehicleList = (deptId, begintime, endtime, current, size) => {
  return request({
    url: '/api/blade-platform/platform/vehicle/selectGDSVehicleList',
    method: 'post',
    data: {
      deptId,
      begintime,
      endtime,
      current,
      size,
    },
  });
};
// 驾驶员信息 绑定车辆
export const getGDSMXVehicleList = (deptId, begintime, endtime, current, size, areaName, cheliangzhuangtai) => {
  return request({
    url: '/api/blade-platform/platform/vehicle/selectGDSMXVehicleList',
    method: 'post',
    data: {
      deptId,
      begintime,
      endtime,
      current,
      size,
      areaName,
      cheliangzhuangtai
    },
  });
};
// 预警权限
export const getyujingquanxian = (menuIds, postIds) => {
  return request({
    url: '/api/blade-platform/platform/yujingquanxian/submit',
    method: 'get',
    params: {
      menuIds,
      postIds
    },
  });
};
// 预警项企业
export const selectYJDept = (deptId, current, size, yujingxiang, deptName) => {
  return request({
    url: '/api/blade-platform/platform/yujingquanxian/selectYJDept',
    method: 'post',
    data: {
      deptId,
      current,
      size,
      yujingxiang,
      deptName
    },
  });
};
// 预警项企业
export const delYuJingByXiangId = (deptId, postId, yujingxiangid) => {
  return request({
    url: '/api/blade-platform/platform/yujingquanxian/delYuJingByXiangId',
    method: 'post',
    params: {
      deptId,
      postId,
      yujingxiangid
    },
  });
};