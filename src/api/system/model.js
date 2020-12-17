import request from "@/router/axios";

// 获取模板 list
export const getList = id => {
  return request({
    url: "/api/blade-platform/platform/muban/list",
    method: "get",
    params: {
      id
    }
  });
};

export const remove = ids => {
  return request({
    url: "/api/blade-platform/platform/muban/del",
    method: "POST",
    params: {
      ids
    }
  });
};

export const insert = data => {
  return request({
    url: "/api/blade-platform/platform/muban/insert",
    method: "post",
    data
  });
};

export const update = data => {
  return request({
    url: "/api/blade-platform/platform/muban/update",
    method: "post",
    data
  });
};

export const initField = (deptId, biaoming) => {
  return request({
    url: "/api/blade-platform/platform/muban/InsertMubanMap",
    method: "get",
    params: { deptId, biaoming }
  });
};

export const initModel = deptId => {
  return request({
    url: "/api/blade-platform/platform/muban/InsertAllMubanMap",
    method: "get",
    params: { deptId }
  });
};
