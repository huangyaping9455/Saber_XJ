/**
 * 模板配置项
 * @param {Object} SELF vue的this指向
 * @returns {Object} {基础配置，增强配置}
 */
export default (SELF) => {
  const mubanDisabled = SELF.stateText == 'edit' && SELF.isChildren;
  return {
    baseConfig: [
      {
        label: '模块名称',
        prop: 'muban',
        span: 24,
        rules: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: 'submit'
          }
        ]
      },
      {
        label: '模块类型',
        prop: 'leixing',
        span: 24,
        type: 'select',
        disabled: mubanDisabled,
        tip: mubanDisabled ? '存在下级不能进行修改' : '',
        dicData: [{ label: '菜单', value: 0 }, { label: '业务', value: 1 }],
        valueDefault: 0,
        rules: [
          {
            required: true,
            message: '请选择模块类型',
            trigger: 'submit'
          }
        ]
      }
    ],
    intensifyConfig: [
      {
        label: '访问令牌',
        prop: 'token',
        span: 24,
        rules: [
          {
            required: true,
            message: '请输入访问令牌',
            trigger: 'submit'
          }
        ],
        tip: '请输入对应的路由地址'
      },
      {
        label: '模块表名',
        prop: 'biaoming',
        span: 24
      },
      {
        label: '模块列表接口',
        prop: 'viewModel',
        span: 24
      },
      {
        label: '模块详情接口',
        prop: 'detailModel',
        span: 24
      },
      {
        label: '模块新增接口',
        prop: 'insertModel',
        span: 24
      },
      {
        label: '模块删除接口',
        prop: 'removeModel',
        span: 24
      },
      {
        label: '模块编辑接口',
        prop: 'updateModel',
        span: 24
      },
      {
        label: '字段查询接口',
        prop: 'viewField',
        span: 24,
        rules: [
          {
            required: true,
            message: '请输入字段查询接口',
            trigger: 'submit'
          }
        ]
      },
      {
        label: '字段新增接口',
        prop: 'insertField',
        span: 24,
        rules: [
          {
            required: true,
            message: '请输入字段新增接口',
            trigger: 'submit'
          }
        ]
      },
      {
        label: '字段删除接口',
        prop: 'removeField',
        span: 24,
        rules: [
          {
            required: true,
            message: '请输入字段删除接口',
            trigger: 'submit'
          }
        ]
      },
      {
        label: '字段编辑接口',
        prop: 'updateField',
        span: 24,
        rules: [
          {
            required: true,
            message: '请输入字段编辑接口',
            trigger: 'submit'
          }
        ]
      }
    ]
  };
};
