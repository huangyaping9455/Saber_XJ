import request from '@/router/axios';

export const getList = (dept, current, size, leixing, deptName) => {
  return request({
    url: '/api/blade-doc/doc/biaozhunhuamuban/getQYBZHList',
    method: 'post',
    data: {
      dept,
      current,
      size,
      leixing,
      deptName
    }
  });
};

// export const getListselect = (dept, current, size, leixing, deptName) => {
//   return request({
//     url: '/api/blade-doc/doc/biaozhunhuamuban/getQYBZHList',
//     method: 'post',
//     data: {
//       dept,
//       current,
//       size,
//       leixing,
//       deptName
//     }
//   });
// };
export const getQYWDList = (deptId) => {
  return request({
    url: '/api/blade-doc/doc/biaozhunhuamuban/getQYWDList',
    method: 'post',
    data: {
      deptId,
    }
  });
};
export const getQYWJList = (deptId, current, size) => {
  return request({
    url: '/api/blade-doc/doc/biaozhunhuamuban/getQYWJList',
    method: 'post',
    data: {
      deptId,
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

export const addWJ = (params) => {
  return request({
    url: '/api/blade-doc/doc/biaozhunhuamuban/aKeyGeneration',
    method: 'post',
    params
  });
};

export const addWD = (params) => {
  return request({
    url: '/api/blade-doc/doc/SafetyProductionFile/aKeyGeneration',
    method: 'post',
    params
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
// 单位名称 下拉框数据
export const getByIdDeptList = (deptId) => {
  return request({
    url: '/api/blade-system/dept/getByIdDeptList',
    method: 'get',
    params: {
      deptId,
    }
  });
};
// 省 市 县
export const getSheng = (deptId, type, remark) => {
  return request({
    url: '/api/blade-system/dept/getDeptById',
    method: 'get',
    params: {
      deptId,
      type,
      remark
    }
  });
};
// 车辆牌照 下拉框数据
export const getByIdVehicleLis = (deptId) => {
  return request({
    url: '/api/blade-platform/platform/vehicle/getByIdVehicleList',
    method: 'get',
    params: {
      deptId,
    }
  });
};
// 驾驶员姓名 下拉框数据
export const getByIdJiaShiYuanList = (deptId) => {
  return request({
    url: '/api/blade-platform/platform/jiashiyuan/getByIdJiaShiYuanList',
    method: 'get',
    params: {
      deptId,
    }
  });
};
//标准化文件 删除
export const deleteBiaozhunhuamuban = (caozuoren, caozuorenid, deptId) => {
  return request({
    url: '/api/blade-doc/doc/biaozhunhuamuban/deleteBiaozhunhuamuban',
    method: 'get',
    params: {
      caozuoren,
      caozuorenid,
      deptId
    }
  });
};
//标准化文件 删除
export const deleteSafetyProductionFile = (caozuoren, caozuorenid, deptId) => {
  return request({
    url: '/api/blade-doc/doc/biaozhunhuamuban/deleteSafetyProductionFile',
    method: 'get',
    params: {
      caozuoren,
      caozuorenid,
      deptId
    }
  });
};