import request from '@/router/axios';

export const getPostInfo = (postId) => {
  return request({
    url: '/api/blade-platform/platform/departmentpost/selectByPostId',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const imgPreviewBySuoshuren = (fileProperty) => {
  return request({
    url: '/api/blade-doc/doc/biaozhunhuamuban/imgPreviewBySuoshuren',
    method: 'POST',
    params: {
      fileProperty
    }
  });
};

export const getSchedule = (date, deptId) => {
  return request({
    url: '/api/blade-platform/platform/richenganpai/richengIndex',
    method: 'GET',
    params: {
      date,
      deptId
    }
  });
};

export const getRichengList = (deptId, dateTime, current, size, renwubiaoti, isFinish, renwuleixing) => {
  return request({
    url: '/api/blade-platform/platform/richenganpai/getRiChengByDateList',
    method: 'post',
    data: {
      deptId,
      dateTime,
      current,
      size,
      renwubiaoti,
      isFinish,
      renwuleixing
    }
  });
};

export const getChaoqiRicheng = (deptId, dateTime, current, size, renwubiaoti, isFinish, renwuleixing) => {
  return request({
    url: '/api/blade-platform/platform/richenganpai/getRiChengChaoQiByDateList',
    method: 'post',
    data: {
      deptId,
      dateTime,
      current,
      size,
      renwubiaoti,
      isFinish,
      renwuleixing
    }
  });
};

export const getRichengDetail = (Id) => {
  return request({
    url: '/api/blade-platform/platform/richenganpai/detail',
    method: 'GET',
    params: {
      Id
    }
  });
};

export const getAnpaiRicheng = (deptId, dateTime, current, size, renwubiaoti, isFinish, renwuleixing) => {
  return request({
    url: '/api/blade-platform/platform/richenganpai/getAnpaiByUserList',
    method: 'post',
    data: {
      deptId,
      dateTime,
      current,
      size,
      renwubiaoti,
      isFinish,
      renwuleixing
    }
  });
};

export const updateRicheng = (data) => {
  return request({
    url: '/api/blade-platform/platform/richenganpai/update',
    method: 'post',
    data
  });
};

export const addRicheng = (data) => {
  return request({
    url: '/api/blade-platform/platform/richenganpai/submit',
    method: 'post',
    data
  });
};
// 删除 日程安排
export const removeRiChang = (Id, userId, userName) => {
  return request({
    url: '/api/blade-platform/platform/richenganpai/remove',
    method: 'get',
    params: {
      Id,
      userId,
      userName
    }
  });
};
// 删除 日程安排
export const getListTree = (deptId) => {
  return request({
    url: '/api/blade-doc/doc/biaozhunhuamuban/getListTree',
    method: 'get',
    params: {
      deptId
    }
  });
};