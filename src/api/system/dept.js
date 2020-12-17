import request from '@/router/axios';

export const tree = params => {
  return request({
    url: '/api/blade-system/dept/tree',
    method: 'GET',
    params
  });
};

// 获取多岗设置菜单树
export const treeDG = postId => {
  return request({
    url: '/api/blade-system/dept/treeDG',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const viewInfo = id => {
  return request({
    url: '/api/blade-system/dept/viewInfo',
    method: 'GET',
    params: {
      id
    }
  });
};

export const viewInfoPost = id => {
  return request({
    url: '/api/blade-system/dept/detail',
    method: 'GET',
    params: {
      id
    }
  });
};

export const insert = data => {
  return request({
    url: '/api/blade-system/dept/insert',
    method: 'POST',
    data
  });
};

export const remove = id => {
  return request({
    url: '/api/blade-system/dept/remove',
    method: 'GET',
    params: {
      id
    }
  });
};

export const update = data => {
  return request({
    url: '/api/blade-system/dept/submit',
    method: 'POST',
    data
  });
};

export const selectByPostId = postId => {
  return request({
    url: '/api/blade-system/dept/selectByPostId',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const savePer = data => {
  return request({
    url: '/api/blade-system/dept/savePer',
    method: 'POST',
    data
  });
};

export const updatePer = data => {
  return request({
    url: '/api/blade-system/dept/updatePer',
    method: 'POST',
    data
  });
};

export const removePer = id => {
  return request({
    url: '/api/blade-system/dept/removePer',
    method: 'GET',
    params: {
      id
    }
  });
};

export const checkPost = postId => {
  return request({
    url: '/api/blade-system/dept/switchingJobs',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const saveMultiple = (userId, postIds) => {
  return request({
    url: '/api/blade-system/dept/saveMultiple',
    method: 'POST',
    params: {
      userId,
      postIds
    }
  });
};

export const checkHavePost = userId => {
  return request({
    url: '/api/blade-system/dept/checkHavePost',
    method: 'GET',
    params: {
      userId
    }
  });
};

// 运维菜单权限
export const YWTree = () => {
  return request({
    url: '/api/blade-system/dept/grant-tree',
    method: 'GET'
  });
};

export const YWTreeKeys = postId => {
  return request({
    url: '/api/blade-system/dept/post-tree-keys',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const YWTreeSave = (postIds, menuIds) => {
  return request({
    url: '/api/blade-system/dept/grant',
    method: 'GET',
    params: {
      postIds,
      menuIds
    }
  });
};

// 安标菜单权限
export const ABTree = () => {
  return request({
    url: '/api/blade-system/dept/ABgrant-tree',
    method: 'GET'
  });
};

export const ABTreeKeys = postId => {
  return request({
    url: '/api/blade-system/dept/ABpostTreeKeys',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const ABTreeSave = (postIds, menuIds) => {
  return request({
    url: '/api/blade-system/dept/ABgrant',
    method: 'GET',
    params: {
      postIds,
      menuIds
    }
  });
};

// APP菜单权限
export const APPTree = () => {
  return request({
    url: '/api/blade-system/dept/Appgrant-tree',
    method: 'GET'
  });
};

export const APPTreeKeys = postId => {
  return request({
    url: '/api/blade-system/dept/AppgrantTreeByPost',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const APPTreeSave = (postIds, menuIds) => {
  return request({
    url: '/api/blade-system/dept/Appgrant',
    method: 'GET',
    params: {
      postIds,
      menuIds
    }
  });
};

// 安全标准化目录权限
export const MLTree = params => {
  return request({
    url: '/api/blade-platform/platform/biaozhunhuamuban/Jurgrant-tree',
    method: 'GET',
    params
  });
};

export const MLTreeKeys = postId => {
  return request({
    url: '/api/blade-platform/platform/biaozhunhuamuban/JurpostTreeKeys',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const MLTreeSave = (postIds, menuIds) => {
  return request({
    url: '/api/blade-system/dept/Jurgrant',
    method: 'GET',
    params: {
      postIds,
      menuIds
    }
  });
};

// 预警权限接口
export const YJTree = params => {
  return request({
    url: '/api/blade-platform/platform/yujingquanxian/allyujing',
    method: 'GET',
    params
  });
};

export const YJTreeKeys = postId => {
  return request({
    url: '/api/blade-platform/platform/yujingquanxian/yujingTreeKeys',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const YJTreeSave = (postIds, menuIds) => {
  return request({
    url: '/api/blade-platform/platform/yujingquanxian/submit',
    method: 'GET',
    params: {
      postIds,
      menuIds
    }
  });
};

// 其他功能权限
export const FNTree = params => {
  return request({
    url: '/api/blade-system/dept/Businesstree-tree',
    method: 'GET',
    params
  });
};

export const FNTreeKeys = postId => {
  return request({
    url: '/api/blade-system/dept/BusinessgrantTreeByPost',
    method: 'GET',
    params: {
      postId
    }
  });
};

export const FNTreeSave = (postIds, menuIds) => {
  return request({
    url: '/api/blade-system/dept/Businessgrant',
    method: 'GET',
    params: {
      postIds,
      menuIds
    }
  });
};

// 权限追加

export const grantAdd = params => {
  return request({
    url: '/api/blade-system/dept/grantAdd',
    method: 'GET',
    params
  });
};

// 权限同步
export const grantSyn = params => {
  return request({
    url: '/api/blade-system/dept/grantSyn',
    method: 'GET',
    params
  });
};

// 机构异动 tree
export const YDtree = params => {
  return request({
    url: '/api/blade-system/dept/YDtree',
    method: 'GET',
    params
  });
};

// 机构异动 treeSave
export const YDtreeSave = params => {
  return request({
    url: '/api/blade-system/dept/YDsave',
    method: 'POST',
    params
  });
};
